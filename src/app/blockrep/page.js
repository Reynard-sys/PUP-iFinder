"use client";

import Header from "../../components/layout/studentheader";
import SubjectCard from "../../components/layout/SubjectCard";
import { useEffect, useState } from "react";
import { getStudentSubjects } from "../actions/getStudentSubjects";

export default function BlockRepPage() {
  const [subjects, setSubjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const cardsPerPage = 6;

  useEffect(() => {
    async function fetchSubjects() {
      const storedStudent = localStorage.getItem("student");
      if (!storedStudent) return;

      const studentObj = JSON.parse(storedStudent);
      const studentNumber = studentObj.studentNumber;

      const result = await getStudentSubjects(studentNumber);

      if (result.success) {
        setSubjects(result.data);
      } else {
        console.error(result.error);
      }
    }

    fetchSubjects();
  }, []);

  const totalPages = Math.ceil(subjects.length / cardsPerPage);

  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentSubjects = subjects.slice(startIndex, endIndex);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white pt-32 sm:pt-36 pb-20 px-6 sm:px-8 lg:px-12">
        <div className="max-w-[1500px] mx-auto">
          <h1 className="text-5xl sm:text-6xl font-bold text-[#800000] mb-10 sm:mb-14">
            Block Rep Dashboard
          </h1>

          {subjects.length === 0 ? (
            <p className="text-gray-500 text-xl text-center mt-20">
              No subjects found. Upload your COR first.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
                {currentSubjects.map((subject) => (
                  <SubjectCard
                    key={subject.subjectSectionID}
                    subjectSectionID={subject.subjectSectionID}
                    courseCode={subject.subjectCode}
                    courseName={subject.subjectTitle}
                    section={subject.sectionCode}
                    basePath="/blockrep/subjectDetails"
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
