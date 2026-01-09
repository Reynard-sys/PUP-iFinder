"use server";

import mysql from "mysql2/promise";

export async function verifyCode(accessCode, studentNumber) {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "1106",
      database: "pup_ifinder",
    });

    // ✅ Check access code exists
    const [rows] = await connection.execute(
      "SELECT * FROM authorization WHERE AccessCode = ?",
      [accessCode]
    );

    if (rows.length === 0) {
      return { success: false, error: "Access code does not exist." };
    }

    const authRow = rows[0];

    // ✅ Check if already used
    if (authRow.UsedBy !== null) {
      return {
        success: false,
        error: "This access code has already been used.",
      };
    }

    // ✅ Get student's SectionID
    const [studentRows] = await connection.execute(
      "SELECT SectionID FROM student WHERE StudentNumber = ?",
      [studentNumber]
    );

    if (studentRows.length === 0) {
      return { success: false, error: "Student not found." };
    }

    const sectionID = studentRows[0].SectionID;

    // ✅ Student has no COR / SectionID yet
    if (!sectionID) {
      return {
        success: false,
        error: "Upload your COR first. Section is missing.",
      };
    }

    // ✅ Update UsedBy AND sectionID in authorization
    await connection.execute(
      "UPDATE authorization SET UsedBy = ?, sectionID = ? WHERE AccessCode = ? AND UsedBy IS NULL",
      [studentNumber, sectionID, accessCode]
    );

    return { success: true };
  } catch (err) {
    console.error("VERIFY CODE ERROR:", err);
    return { success: false, error: err.message };
  } finally {
    if (connection) await connection.end();
  }
}
