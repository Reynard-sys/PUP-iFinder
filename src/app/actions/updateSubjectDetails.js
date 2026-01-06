"use server";

import mysql from "mysql2/promise";

export async function updateSubjectDetails(
  subjectSectionID,
  facultyNumber,
  quickLinks
) {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "1106",
      database: "pup_ifinder",
    });

    await connection.execute(
      `UPDATE subject_section 
       SET FacultyNumber = ? 
       WHERE SubjectSectionID = ?`,
      [facultyNumber || null, subjectSectionID]
    );

    const [
      messenger,
      gclassroom,
      msteams,
      canvas,
      gdrive,
      additionallink1,
      additionallink2,
    ] = quickLinks.map((l) => l.url);

    await connection.execute(
      `
      INSERT INTO class_resource
      (SubjectSectionID, Messenger, GClassroom, MSTeams, Canvas, GDrive, additionallink1, additionallink2)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        Messenger = VALUES(Messenger),
        GClassroom = VALUES(GClassroom),
        MSTeams = VALUES(MSTeams),
        Canvas = VALUES(Canvas),
        GDrive = VALUES(GDrive),
        additionallink1 = VALUES(additionallink1),
        additionallink2 = VALUES(additionallink2)
      `,
      [
        subjectSectionID,
        messenger,
        gclassroom,
        msteams,
        canvas,
        gdrive,
        additionallink1,
        additionallink2,
      ]
    );

    await connection.end();
    return { success: true };
  } catch (error) {
    console.error("UPDATE SUBJECT DETAILS ERROR:", error);
    return { success: false, error: error.message };
  }
}
