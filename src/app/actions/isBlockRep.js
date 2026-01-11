"use server";

import mysql from "mysql2/promise";

export async function verifyCode(accessCode, studentNumber) {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "1106",
      database: "pup_ifinder",
    });

    const [rows] = await connection.execute(
      "SELECT * FROM authorization WHERE AccessCode = ?",
      [accessCode]
    );

    if (rows.length === 0) {
      await connection.end();
      return { success: false, error: "Access code does not exist." };
    }

    const authRow = rows[0];

    if (authRow.UsedBy !== null) {
      await connection.end();
      return {
        success: false,
        error: "This access code has already been used.",
      };
    }

    const [studentRows] = await connection.execute(
      "SELECT SectionID FROM student WHERE StudentNumber = ?",
      [studentNumber]
    );

    if (studentRows.length === 0) {
      await connection.end();
      return { success: false, error: "Student not found." };
    }

    const sectionID = studentRows[0].SectionID;

    if (!sectionID) {
      await connection.end();
      return {
        success: false,
        error: "Upload your COR first. Section is missing.",
      };
    }

    const [existingBlockRep] = await connection.execute(
      "SELECT * FROM blockrep WHERE BlockRepID = ?",
      [studentNumber]
    );

    if (existingBlockRep.length > 0) {
      await connection.end();
      return {
        success: false,
        error: "You are already registered as a block representative.",
      };
    }

    await connection.execute(
      "UPDATE authorization SET UsedBy = ? WHERE AccessCode = ?",
      [studentNumber, accessCode]
    );

    await connection.execute(
      "INSERT INTO blockrep (BlockRepID, SectionID) VALUES (?, ?)",
      [studentNumber, sectionID]
    );

    await connection.end();
    return { success: true };
  } catch (err) {
    console.error("VERIFY CODE ERROR:", err);
    return { success: false, error: err.message };
  }
}
