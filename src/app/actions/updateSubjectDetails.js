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
      user: "denrick",
      password: "Denrickbruno_1245",
      database: "pup_ifinder",
    });

    const messenger = quickLinks[0]?.url || "";
    const gclassroom = quickLinks[1]?.url || "";
    const msteams = quickLinks[2]?.url || "";
    const canvas = quickLinks[3]?.url || "";
    const gdrive = quickLinks[4]?.url || "";
    const add1 = quickLinks[5]?.url || "";
    const add2 = quickLinks[6]?.url || "";
    const facultyNum = facultyNumber || "";

    await connection.execute(
      `CALL sp_update_subject_details(?,?,?,?,?,?,?,?,?)`,
      [
        subjectSectionID,
        facultyNumber,
        messenger,
        gclassroom,
        msteams,
        canvas,
        gdrive,
        add1,
        add2,
      ]
    );

    await connection.end();

    return { success: true };
  } catch (error) {
    console.error("UPDATE SUBJECT DETAILS ERROR:", error);
    return { success: false, error: error.message };
  }
}
