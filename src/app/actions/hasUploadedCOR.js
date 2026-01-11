"use server";

import mysql from "mysql2/promise";

export async function hasUploadedCOR(studentNumber) {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "denrick",
      password: "Denrickbruno_1245",
      database: "pup_ifinder",
    });

    const [rows] = await connection.execute(
      "SELECT SectionID FROM student WHERE StudentNumber = ? LIMIT 1",
      [studentNumber]
    );

    await connection.end();

    if (rows.length === 0) return { success: true, hasCOR: false };

    return { success: true, hasCOR: rows[0].SectionID != null };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
