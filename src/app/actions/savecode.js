"use server";

import mysql from "mysql2/promise";

export async function saveCodes(codes, facultyNumber) {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "1106",
      database: "pup_ifinder",
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
