"use server";

import mysql from "mysql2/promise";

export async function updateSubjectDetails(subjectSectionID, facultyNumber, quickLinks) {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "1106",
      database: "pup_ifinder",
    });

    // ✅ Update faculty in Subject_Section
    await connection.execute(
      `UPDATE Subject_Section SET FacultyNumber = ? WHERE SubjectSectionID = ?`,
      [facultyNumber, subjectSectionID]
    );

    // ✅ Update quick links in Class_Resource
    await connection.execute(
      `
      UPDATE Class_Resource
      SET Messenger = ?, GClassroom = ?, MSTeams = ?, Canvas = ?, GDrive = ?, additionallink1 = ?, additionallink2 = ?
      WHERE SubjectSectionID = ?
      `,
      [
        quickLinks[0]?.url || null,
        quickLinks[1]?.url || null,
        quickLinks[2]?.url || null,
        quickLinks[3]?.url || null,
        quickLinks[4]?.url || null,
        quickLinks[5]?.url || null,
        quickLinks[6]?.url || null,
        subjectSectionID,
      ]
    );

    await connection.end();
    return { success: true };
  } catch (err) {
    console.error("UPDATE SUBJECT DETAILS ERROR:", err);
    return { success: false, error: err.message };
  }
}
