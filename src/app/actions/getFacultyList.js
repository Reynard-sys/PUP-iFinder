"use server";

import mysql from "mysql2/promise";

export async function getFacultyList() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "1106",
      database: "pup_ifinder",
    });

    const [rows] = await connection.execute(`
      SELECT FacultyNumber, FacultyName
      FROM Faculty
      ORDER BY FacultyName ASC
    `);

    await connection.end();
    return { success: true, data: rows };
  } catch (err) {
    console.error("GET FACULTY LIST ERROR:", err);
    return { success: false, error: err.message };
  }
}
