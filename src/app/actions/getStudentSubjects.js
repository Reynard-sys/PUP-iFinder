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
      SELECT 
  cs.MatchedSubjectSectionID AS subjectSectionID,
  ssub.SubjectCode AS subjectCode,
  sub.SubjectTitle AS subjectTitle,
  sec.SectionCode AS sectionCode
FROM cor_subject cs
JOIN subject_section ssub ON cs.MatchedSubjectSectionID = ssub.SubjectSectionID
JOIN subject sub ON ssub.SubjectCode = sub.SubjectCode
JOIN section sec ON ssub.SectionID = sec.SectionID
WHERE cs.StudentNumber = ?
AND cs.MatchStatus = 'Matched'
GROUP BY cs.MatchedSubjectSectionID;
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
