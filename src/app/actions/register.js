"use server";

import mysql from "mysql2/promise";

export async function registerStudent(formData) {
  const studentNumber = formData.get("studentNumber");
  const name = formData.get("name");
  console.log("Data received for:", name);
  const studentType = formData.get("studentType");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match" };
  }

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const query =
      "INSERT INTO student (StudentNumber, StudentName, StudentType, Email, Password) VALUES (?, ?, ?, ?, ?)";

    await connection.execute(query, [
      studentNumber,
      name,
      studentType,
      email,
      password,
    ]);
    await connection.end();

    return { success: true };
  } catch (error) {
    console.error("REGISTER ERROR:", error);
  return { success: false, error: error.message };
  }
}
