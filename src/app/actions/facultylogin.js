"use server";

import mysql from "mysql2/promise";

export async function facLogin(formData) {
  const facultyNumber = formData.get("facultyNumber");
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
      "SELECT FacultyNumber, FacultyEmail, Password FROM faculty WHERE FacultyNumber = ?",
      [facultyNumber]
    );

    await connection.end();

    if (rows.length === 0) {
      return { success: false, error: "Faculty number not found" };
    }

    const faculty = rows[0];

    if (faculty.Password !== password) {
      return { success: false, error: "Incorrect password" };
    }

    return {
      success: true,
      faculty: {
        email: faculty.FacultyEmail,
        facultyNumber: faculty.FacultyNumber,
      },
    };
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return { success: false, error: error.message };
  }
}
