import mysql from "mysql2/promise";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req) {
  let connection;

  try {
    const { studentNumber } = await req.json();

    if (!studentNumber) {
      return NextResponse.json(
        { success: false, error: "Missing student number." },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "1106",
      database: "pup_ifinder",
    });

    await connection.execute(
      `DELETE FROM cor_subject WHERE StudentNumber = ?`,
      [studentNumber]
    );

    await connection.execute(
      `UPDATE student SET SectionID = NULL WHERE StudentNumber = ?`,
      [studentNumber]
    );

    await connection.end();

    const filePath = path.join(
      process.cwd(),
      "public",
      "cor_uploads",
      `${studentNumber}.pdf`
    );

    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.warn("PDF file not found (already deleted).");
    }

    return NextResponse.json({
      success: true,
      message: "COR deleted successfully!",
    });
  } catch (err) {
    console.error("COR DELETE ERROR:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Server error." },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end();
  }
}
