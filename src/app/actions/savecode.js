"use server";

import mysql from "mysql2/promise";

export async function saveCodes(codes, facultyNumber) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const query =
      "INSERT INTO authorization (FacultyNumber, AccessCode) VALUES (?, ?)";

    for (const code of codes) {
      await connection.execute(query, [facultyNumber, code]);
    }

    await connection.end();

    return { success: true };
  } catch (error) {
    console.error("SAVE CODES ERROR:", error);
    return { success: false, error: error.message };
  }
}
