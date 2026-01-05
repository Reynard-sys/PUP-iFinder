"use server";

import mysql from "mysql2/promise";

export async function hasUsedCode(studentNumber) {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "1106",
      database: "pup_ifinder",
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
