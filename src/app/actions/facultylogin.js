"use server";

import mysql from "mysql2/promise";

export async function facLogin(formData) {
  const facultyNumber = formData.get("facultyNumber");
  const password = formData.get("password");

  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "1106",
      database: "pup_ifinder",
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
