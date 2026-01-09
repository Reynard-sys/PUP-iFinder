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
<<<<<<< HEAD
      SELECT 
        ss.SubjectSectionID AS subjectSectionID,
        ss.SubjectCode AS subjectCode,
        sub.SubjectTitle AS subjectTitle,
        sec.SectionCode AS sectionCode
      FROM subject_section ss
      JOIN subject sub ON ss.SubjectCode = sub.SubjectCode
      JOIN section sec ON ss.SectionID = sec.SectionID
      WHERE ss.SectionID = (
        SELECT SectionID
        FROM student
        WHERE StudentNumber = ?
      )
=======
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
>>>>>>> parent of 8cc74c3 (fixed bugs, added pdf drag and pdf error message)
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
