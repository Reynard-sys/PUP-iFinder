"use server";

import mysql from "mysql2/promise";

export async function hasUsedCode(studentNumber) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute(
      "SELECT AccessCode FROM authorization WHERE UsedBy = ? LIMIT 1",
      [studentNumber]
    );

    await connection.end();

    if (rows.length > 0) {
      return { success: true, used: true };
    }

    return { success: true, used: false };
  } catch (err) {
    console.error("CHECK USED CODE ERROR:", err);
    return { success: false, error: "Server error. Try again." };
  }
}
