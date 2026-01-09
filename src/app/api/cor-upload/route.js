import mysql from "mysql2/promise";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs/promises";
import path from "path";

export const maxDuration = 60;

export async function POST(req) {
  let connection;

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
    const base64PDF = buffer.toString("base64");
    const uploadDir = path.join(process.cwd(), "public", "cor_uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, `${studentNumber}.pdf`);
    await fs.writeFile(filePath, buffer);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `
You are given a Certificate of Registration PDF.

Extract student info and subject list.
Return ONLY valid JSON, no markdown, no explanation.
Use this exact schema:

{
  "student_id": string|null,
  "program": string|null,
  "yearlevel": number|string|null,
  "BlockNumber": string|number|null,
  "subjects": [
    {
      "subject_code": string,
      "subject_title": string,
      "section_code": string,
      "schedule": string
    }
  ]
}

IMPORTANT RULES:
- The "program" field MUST be the PROGRAM CODE as written in the COR (ex: BSIT, BSCS, BSA, etc.)
- DO NOT return the full program name like "BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY"
- student_id format: YYYY-####(4-5 digits)-XX-#
- Convert yearlevel: First Year=1, Second Year=2, Third Year=3, Fourth Year=4
- BlockNumber must be ONLY the section/block number (ex: 4, 2N, 1D) and NOT the entire section string.
- Subject codes may include formats like:
  - COMP 019
  - GEED 007
  - ELEC IT-FE1
  - ACCO 014
- subject_code must ONLY be the subject code (not words like "fees amount")
- Do NOT merge two subjects together.
- Remove all fees/payment lines.
- schedule must include multiple lines if present (preserve newline characters).
- If missing value, put null.

Return ONLY JSON.
`;

    console.log("Sending PDF to Gemini");

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "application/pdf",
          data: base64PDF,
        },
      },
      { text: prompt },
    ]);

    const rawText = result.response.text();
    console.log("Gemini raw response:\n", rawText);

    const cleaned = rawText.replace(/```json|```/g, "").trim();

    let scraped;
    try {
      scraped = JSON.parse(cleaned);
    } catch (err) {
      console.error("JSON parse failed. Cleaned text:\n", cleaned);
      return NextResponse.json(
        { success: false, error: "Gemini returned invalid JSON." },
        { status: 500 }
      );
    }

    if (!scraped.student_id || scraped.student_id !== studentNumber) {
      return NextResponse.json(
        {
          success: false,
          error: `Student number is not matched. Please upload the correct COR`,
        },
        { status: 400 }
      );s
    }

    connection = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "1106",
      database: "pup_ifinder",
    });

    const [mainSecRows] = await connection.execute(
      `SELECT SectionID FROM section WHERE Program=? AND YearLevel=? AND BlockNumber=?`,
      [scraped.program, scraped.yearlevel, scraped.BlockNumber]
    );

    let mainSectionID;

    if (mainSecRows.length === 0) {
      const [insertMainSec] = await connection.execute(
        `INSERT INTO section (Program, YearLevel, BlockNumber) VALUES (?, ?, ?)`,

        [scraped.program, scraped.yearlevel, scraped.BlockNumber]
      );
      mainSectionID = insertMainSec.insertId;
    } else {
      mainSectionID = mainSecRows[0].SectionID;
    }

    await connection.execute(
      `UPDATE student SET SectionID=? WHERE StudentNumber=?`,
      [mainSectionID, studentNumber]
    );

    for (const sub of scraped.subjects) {
      if (!sub.subject_code || !sub.section_code) continue;

      const [program, yearBlock] = sub.section_code.split(" ");
      const [yearLevelStr, blockNumber] = yearBlock.split("-");
      const yearLevel = parseInt(yearLevelStr, 10);

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

      await connection.execute(
        `INSERT IGNORE INTO subject (SubjectCode, SubjectTitle) VALUES (?, ?)`,
        [sub.subject_code, sub.subject_title || ""]
      );

      const [ssRows] = await connection.execute(
        `SELECT SubjectSectionID FROM subject_section WHERE SubjectCode=? AND SectionID=?`,
        [sub.subject_code, sectionID]
      );

      let subjectSectionID;
      if (ssRows.length === 0) {
        const [insertSS] = await connection.execute(
          `INSERT INTO subject_section (SubjectCode, SectionID, schedule) VALUES (?, ?, ?)`,
          [sub.subject_code, sectionID, sub.schedule || ""]
        );
        subjectSectionID = insertSS.insertId;
      } else {
        subjectSectionID = ssRows[0].SubjectSectionID;
      }

      await connection.execute(
        `INSERT IGNORE INTO class_resource (SubjectSectionID) VALUES (?)`,
        [subjectSectionID]
      );

      await connection.execute(
        `
        INSERT INTO cor_subject 
        (StudentNumber, RawSubjectCode, RawSectionCode, MatchedSectionID, MatchedSubjectID, MatchedSubjectSectionID, MatchStatus)
        VALUES (?, ?, ?, ?, ?, ?, 'Matched')
        ON DUPLICATE KEY UPDATE MatchStatus='Matched'
        `,
        [
          studentNumber,
          sub.subject_code,
          sub.section_code,
          sectionID,
          sub.subject_code,
          subjectSectionID,
        ]
      );
    }

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "COR uploaded and saved successfully!",
      data: scraped,
    });
  } catch (err) {
    console.error("COR UPLOAD ERROR:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Server error." },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end();
  }
}
