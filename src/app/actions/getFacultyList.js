"use server";

import mysql from "mysql2/promise";

export async function getFacultyList() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute(`
      SELECT FacultyNumber, FacultyName, FacultyEmail
      FROM faculty
      ORDER BY FacultyName ASC
    `);

    await connection.end();
    return { success: true, data: rows };
  } catch (err) {
    console.error("GET FACULTY LIST ERROR:", err);
    return { success: false, error: err.message };
  }
}
