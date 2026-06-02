"use server";

import mysql from "mysql2/promise";

export async function getStudentSubjects(studentNumber) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute(
      `
      SELECT 
        ss.SubjectSectionID AS subjectSectionID,
        ss.SubjectCode AS subjectCode,
        sub.SubjectTitle AS subjectTitle,
        sec.SectionCode AS sectionCode
      FROM subject_section ss
      JOIN subject sub ON ss.SubjectCode = sub.SubjectCode
      JOIN section sec ON ss.SectionID = sec.SectionID
      WHERE ss.SubjectSectionID IN (
        SELECT MatchedSubjectSectionID
        FROM cor_subject
        WHERE StudentNumber = ?
          AND MatchStatus = 'Matched'
          AND MatchedSubjectSectionID IS NOT NULL
      )
      ORDER BY sec.YearLevel, sec.BlockNumber, ss.SubjectCode
      `,
      [studentNumber]
    );

    await connection.end();
    return { success: true, data: rows };
  } catch (err) {
    console.error("GET STUDENT SUBJECTS ERROR:", err);
    return { success: false, error: err.message };
  }
}
