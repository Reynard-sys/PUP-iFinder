"use server";

import mysql from "mysql2/promise";

export async function getUsedCodes(facultyNumber, yearLevel) {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "denrick",
      password: "Denrickbruno_1245",
      database: "pup_ifinder",
    });

    const [rows] = await connection.execute(
      `
      SELECT 
        a.AuthID,
        a.UsedBy,
        sec.Program,
        sec.SectionID,
        a.AccessCode
      FROM authorization a
      JOIN student s ON a.UsedBy = s.StudentNumber
      JOIN section sec ON s.SectionID = sec.SectionID
      WHERE a.UsedBy IS NOT NULL
      AND a.FacultyNumber = ?
      AND sec.YearLevel = ?
      ORDER BY a.AuthID DESC
      `,
      [facultyNumber, yearLevel]
    );

    await connection.end();
    return { success: true, data: rows };
  } catch (error) {
    console.error("GET USED CODES ERROR:", error);
    return { success: false, error: error.message };
  }
}
