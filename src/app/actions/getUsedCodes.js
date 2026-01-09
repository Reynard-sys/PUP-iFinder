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
        a.sectionID AS SectionID,
        sec.Program,
        sec.SectionCode,
        a.AccessCode
      FROM authorization a
      LEFT JOIN section sec ON a.sectionID = sec.SectionID
      WHERE a.FacultyNumber = ?
        AND sec.YearLevel = ?
        AND a.UsedBy IS NOT NULL
        AND (
          a.UsedBy LIKE ?
          OR sec.Program LIKE ?
          OR sec.SectionCode LIKE ?
          OR a.AccessCode LIKE ?
        )
      ORDER BY a.AuthID DESC
      `,
      [facultyNumber, yearLevel, search, search, search, search]
    );

    return { success: true, data: rows };
  } catch (err) {
    console.error("GET USED CODES ERROR:", err);
    return { success: false, error: err.message };
  } finally {
    if (connection) await connection.end();
  }
}
