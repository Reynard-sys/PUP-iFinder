"use server";

import mysql from "mysql2/promise";

export async function getUsedCodes(facultyNumber, yearLevel, keyword = "") {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "1106",
      database: "pup_ifinder",
    });

    const search = `%${keyword}%`;

    const [rows] = await connection.execute(
      `
      SELECT 
        a.AuthID,
        a.UsedBy,
        sec.Program,
        sec.BlockNumber,
        a.AccessCode
      FROM authorization a
      JOIN student s ON a.UsedBy = s.StudentNumber
      JOIN section sec ON s.SectionID = sec.SectionID
      WHERE a.UsedBy IS NOT NULL
        AND a.FacultyNumber = ?
        AND sec.YearLevel = ?
        AND (
          ? = '' OR s.StudentNumber LIKE ?
        )
      ORDER BY a.AuthID DESC
      `,
      [facultyNumber, yearLevel, keyword, search]
    );

    return { success: true, data: rows };
  } catch (error) {
    console.error("GET USED CODES ERROR:", error);
    return { success: false, error: error.message };
  } finally {
    if (connection) await connection.end();
  }
}
