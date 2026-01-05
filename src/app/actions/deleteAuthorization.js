"use server";

import mysql from "mysql2/promise";

export async function deleteAuthorization(authID) {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "1106",
      database: "pup_ifinder",
    });

    await connection.execute(
      "DELETE FROM authorization WHERE AuthID = ?",
      [authID]
    );

    await connection.end();
    return { success: true };
  } catch (error) {
    console.error("DELETE AUTH ERROR:", error);
    return { success: false, error: error.message };
  }
}
