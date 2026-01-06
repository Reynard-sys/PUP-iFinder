"use server";

import mysql from "mysql2/promise";

export async function isBlockRep(studentNumber, subjectSectionID) {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1106",
    database: "pup_ifinder",
  });

  const [rows] = await connection.execute(
    `
    SELECT br.BlockRepID
    FROM blockrep br
    JOIN subject_section ss ON br.SectionID = ss.SectionID
    WHERE ss.SubjectSectionID = ? AND br.BlockRepID = ?
    `,
    [subjectSectionID, studentNumber]
  );

  await connection.end();

  return { success: true, isRep: rows.length > 0 };
}
