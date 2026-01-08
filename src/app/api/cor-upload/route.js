import mysql from "mysql2/promise";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const studentNumber = formData.get("studentNumber");

    if (!file || !studentNumber) {
      return NextResponse.json(
        { success: false, error: "Missing file or student number." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const tempPath = path.join(os.tmpdir(), `${Date.now()}_${file.name}`);
    await fs.writeFile(tempPath, buffer);

    const scriptPath = path.join(
      process.cwd(),
      "src",
      "scripts",
      "extract_cor_info.py"
    );

    const { stdout } = await execFileAsync("python", [scriptPath, tempPath]);

    const scraped = JSON.parse(stdout);

    if (scraped.student_id !== studentNumber) {
      return NextResponse.json(
        {
          success: false,
          error: "Student number does not match uploaded COR.",
        },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "1106",
      database: "pup_ifinder",
    });

    const [secRows] = await connection.execute(
      `SELECT SectionID FROM section WHERE Program=? AND YearLevel=? AND BlockNumber=?`,
      [scraped.program, scraped.yearlevel, scraped.BlockNumber]
    );

    let sectionID;

    if (secRows.length === 0) {
      const [insertSec] = await connection.execute(
        `INSERT INTO section (Program, YearLevel, BlockNumber) VALUES (?, ?, ?)`,
        [scraped.program, scraped.yearlevel, scraped.BlockNumber]
      );
      sectionID = insertSec.insertId;
    } else {
      sectionID = secRows[0].SectionID;
    }

    await connection.execute(
      `UPDATE student SET SectionID=? WHERE StudentNumber=?`,
      [sectionID, studentNumber]
    );

    for (const sub of scraped.subjects) {
      // ✅ Parse section_code like "BSIT 3-1D"
      const [program, yearBlock] = sub.section_code.split(" "); // ["BSIT","3-1D"]
      const [yearLevelStr, blockNumber] = yearBlock.split("-"); // ["3","1D"]
      const yearLevel = parseInt(yearLevelStr, 10);

      // ✅ Find or insert section for this subject
      const [secRows] = await connection.execute(
        `SELECT SectionID FROM section WHERE Program=? AND YearLevel=? AND BlockNumber=?`,
        [program, yearLevel, blockNumber]
      );

      let sectionID;

      if (secRows.length === 0) {
        const [insertSec] = await connection.execute(
          `INSERT INTO section (Program, YearLevel, BlockNumber) VALUES (?, ?, ?)`,
          [program, yearLevel, blockNumber]
        );
        sectionID = insertSec.insertId;
      } else {
        sectionID = secRows[0].SectionID;
      }

      // ✅ Insert subject table
      await connection.execute(
        `INSERT IGNORE INTO subject (SubjectCode, SubjectTitle) VALUES (?, ?)`,
        [sub.subject_code, sub.subject_title]
      );

      // ✅ Find or insert subject_section based on subject + section
      const [ssRows] = await connection.execute(
        `SELECT SubjectSectionID FROM subject_section WHERE SubjectCode=? AND SectionID=?`,
        [sub.subject_code, sectionID]
      );

      let subjectSectionID;

      if (ssRows.length === 0) {
        const [insertSS] = await connection.execute(
          `INSERT INTO subject_section (SubjectCode, SectionID, schedule) VALUES (?, ?, ?)`,
          [sub.subject_code, sectionID, sub.schedule]
        );
        subjectSectionID = insertSS.insertId;
      } else {
        subjectSectionID = ssRows[0].SubjectSectionID;
      }

      // ✅ Insert COR_Subject record
      await connection.execute(
        `INSERT INTO cor_subject 
      (StudentNumber, RawSubjectCode, RawSectionCode, MatchedSectionID, MatchedSubjectID, MatchedSubjectSectionID, MatchStatus)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          studentNumber,
          sub.subject_code,
          sub.section_code,
          sectionID,
          sub.subject_code,
          subjectSectionID,
          "Matched",
        ]
      );
    }

    await connection.end();

    await fs.unlink(tempPath);

    return NextResponse.json({ success: true, sectionID });
  } catch (err) {
    console.error("COR UPLOAD ERROR:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Server error." },
      { status: 500 }
    );
  }
}
