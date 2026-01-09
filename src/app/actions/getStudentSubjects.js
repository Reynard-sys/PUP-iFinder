"use server";

import mysql from "mysql2/promise";

export async function getStudentSubjects(studentNumber) {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "denrick",
      password: "Denrickbruno_1245",
      database: "pup_ifinder",
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
      WHERE ss.SectionID = (
        SELECT SectionID
        FROM student
        WHERE StudentNumber = ?
      )
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
