"use server";

import mysql from "mysql2/promise";

export async function getSubjectDetails(subjectSectionID) {
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
        ss.SubjectSectionID,
        ss.SubjectCode,
        sub.SubjectTitle,
        sec.SectionCode,
        ss.schedule,
        f.FacultyName,
        f.FacultyEmail AS FacultyEmail
      FROM subject_section ss
      JOIN subject sub ON ss.SubjectCode = sub.SubjectCode
      JOIN section sec ON ss.SectionID = sec.SectionID
      LEFT JOIN faculty f ON ss.FacultyNumber = f.FacultyNumber
      WHERE ss.SubjectSectionID = ?
      `,
      [subjectSectionID]
    );

    if (rows.length === 0) {
      await connection.end();
      return { success: false, error: "Subject not found." };
    }

    const subject = rows[0];

    const [repRows] = await connection.execute(
      `
      SELECT 
        s.StudentName,
        s.Email
      FROM blockrep br
      JOIN student s ON br.BlockRepID = s.StudentNumber
      WHERE br.SectionID = (
        SELECT SectionID FROM subject_section WHERE SubjectSectionID = ?
      )
      `,
      [subjectSectionID]
    );

    const blockRep = repRows.length > 0 ? repRows[0] : null;

    const [resourceRows] = await connection.execute(
      `
      SELECT 
        Messenger,
        GClassroom,
        MSTeams,
        Canvas,
        GDrive,
        additionallink1,
        additionallink2
      FROM class_resource
      WHERE SubjectSectionID = ?
      `,
      [subjectSectionID]
    );

    const resources = resourceRows.length > 0 ? resourceRows[0] : null;

    await connection.end();

    return {
      success: true,
      data: {
        courseCode: subject.SubjectCode,
        courseName: subject.SubjectTitle,
        section: subject.SectionCode,
        schedule: subject.schedule || "No schedule yet.",
        faculty: {
          name: subject.FacultyName || "Not assigned yet",
          email: subject.FacultyEmail || "Not assigned yet",
        },
        blockRep: {
          name: blockRep?.StudentName || "No block rep yet",
          email: blockRep?.Email || "",
        },
        quickLinks: [
          { name: "Messenger Link", url: resources?.Messenger || "" },
          { name: "Google Classroom Link", url: resources?.GClassroom || "" },
          { name: "MS Teams Link", url: resources?.MSTeams || "" },
          { name: "Canvas Link", url: resources?.Canvas || "" },
          { name: "Google Drive Link", url: resources?.GDrive || "" },
          { name: "Other Link 1", url: resources?.additionallink1 || "" },
          { name: "Other Link 2", url: resources?.additionallink2 || "" },
        ],
      },
    };
  } catch (error) {
    console.error("GET SUBJECT DETAILS ERROR:", error);
    return { success: false, error: error.message };
  }
}
