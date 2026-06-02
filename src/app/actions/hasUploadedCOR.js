"use server";

import mysql from "mysql2/promise";

export async function hasUploadedCOR(studentNumber) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
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
