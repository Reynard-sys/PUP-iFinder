"use server";

import mysql from "mysql2/promise";

export async function deleteAuthorization(authID) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    await connection.execute("DELETE FROM authorization WHERE AuthID = ?", [
      authID,
    ]);

    await connection.end();
    return { success: true };
  } catch (error) {
    console.error("DELETE AUTH ERROR:", error);
    return { success: false, error: error.message };
  }
}
