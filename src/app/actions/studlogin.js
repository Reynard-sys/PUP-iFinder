"use server";

import mysql from "mysql2/promise";

export async function studLogin(formData) {
  const studentNumber = formData.get("studentNumber");
  const password = formData.get("password");

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute(
      "SELECT StudentNumber, Email, Password FROM student WHERE StudentNumber = ?",
      [studentNumber]
    );

    await connection.end();

    if (rows.length === 0) {
      return { success: false, error: "Student number not found" };
    }

    const student = rows[0];

    if (student.Password !== password) {
      return { success: false, error: "Incorrect password" };
    }

    return {
      success: true,
      student: {
        email: student.Email,
        studentNumber: student.StudentNumber,
      },
    };
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return { success: false, error: error.message };
  }
}
