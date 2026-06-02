"use server";

import mysql from "mysql2/promise";

export async function verifyCode(accessCode, studentNumber) {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [alreadyBR] = await connection.execute(
      "SELECT 1 FROM blockrep WHERE BlockRepID = ? LIMIT 1",
      [studentNumber]
    );
    if (alreadyBR.length > 0) {
      await connection.end();
      return { success: true, alreadyBlockRep: true };
    }

    const [authRows] = await connection.execute(
      "SELECT AccessCode, UsedBy FROM authorization WHERE AccessCode = ?",
      [accessCode]
    );
    if (authRows.length === 0) {
      await connection.end();
      return { success: false, error: "Access code does not exist." };
    }
    if (authRows[0].UsedBy !== null) {
      await connection.end();
      return { success: false, error: "This access code has already been used." };
    }

    const [studentRows] = await connection.execute(
      "SELECT SectionID FROM student WHERE StudentNumber = ? LIMIT 1",
      [studentNumber]
    );
    if (studentRows.length === 0) {
      await connection.end();
      return { success: false, error: "Student not found." };
    }

    const sectionID = studentRows[0].SectionID;
    if (!sectionID) {
      await connection.end();
      return { success: false, error: "Upload your COR first. Section is missing." };
    }

    const [secTaken] = await connection.execute(
      "SELECT BlockRepID FROM blockrep WHERE SectionID = ? LIMIT 1",
      [sectionID]
    );
    if (secTaken.length > 0) {
      await connection.end();
      return {
        success: false,
        error: "Your block already has a block representative.",
      };
    }

    await connection.execute(
      "INSERT IGNORE INTO blockrep (BlockRepID, SectionID) VALUES (?, ?)",
      [studentNumber, sectionID]
    );

    const [updateRes] = await connection.execute(
      "UPDATE authorization SET UsedBy = ? WHERE AccessCode = ? AND UsedBy IS NULL",
      [studentNumber, accessCode]
    );

    if (updateRes.affectedRows === 0) {
      await connection.end();
      return { success: false, error: "This access code has already been used." };
    }

    await connection.end();
    return { success: true };
  } catch (err) {
    if (connection) await connection.end();
    return { success: false, error: err.message };
  }
}
