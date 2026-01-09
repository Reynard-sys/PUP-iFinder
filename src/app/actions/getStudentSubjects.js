"use server";

import mysql from "mysql2/promise";

export async function getStudentSubjects(studentNumber) {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "1106",
      database: "pup_ifinder",
    });

    const [rows] = await connection.execute(
      `
      SELECT DISTINCT
        cs.MatchedSubjectSectionID AS subjectSectionID,
        cs.MatchedSubjectID AS subjectCode,
        sub.SubjectTitle AS subjectTitle,
        sec.SectionCode AS sectionCode
      FROM cor_subject cs
      JOIN subject sub ON cs.MatchedSubjectID = sub.SubjectCode
      JOIN section sec ON cs.MatchedSectionID = sec.SectionID
      WHERE cs.StudentNumber = ?
      AND cs.MatchStatus = 'MATCHED'
      ORDER BY cs.MatchedSubjectID ASC
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
