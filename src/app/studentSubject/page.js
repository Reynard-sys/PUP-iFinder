"use client";

import Header from "../../components/layout/studentheader";
import SubjectCard from "../../components/layout/SubjectCard";
import { useState } from "react";       

export default function StudentSubject() {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  const allSubjects = [
    { id: 1, courseCode: "COMP 015", courseName: "Fundamentals of Research", section: "BSIT 3-1" },
    { id: 2, courseCode: "COMP 015", courseName: "Fundamentals of Research", section: "BSIT 3-1" },
    { id: 3, courseCode: "COMP 015", courseName: "Fundamentals of Research", section: "BSIT 3-1" },
    { id: 4, courseCode: "COMP 015", courseName: "Fundamentals of Research", section: "BSIT 3-1" },
    { id: 5, courseCode: "COMP 015", courseName: "Fundamentals of Research", section: "BSIT 3-1" },
    { id: 6, courseCode: "COMP 015", courseName: "Fundamentals of Research", section: "BSIT 3-1" },
    { id: 7, courseCode: "COMP 020", courseName: "Web Development", section: "BSIT 3-1" },
    { id: 8, courseCode: "COMP 025", courseName: "Database Systems", section: "BSIT 3-1" },
    { id: 9, courseCode: "COMP 030", courseName: "Software Engineering", section: "BSIT 3-1" },
    { id: 10, courseCode: "COMP 035", courseName: "Computer Networks", section: "BSIT 3-1" },
  ];

  const totalPages = Math.ceil(allSubjects.length / cardsPerPage);

  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentSubjects = allSubjects.slice(startIndex, endIndex);

  const handleViewDetails = (id) => {
    console.log("View details for subject:", id);
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white pt-32 sm:pt-36 pb-20 px-6 sm:px-8 lg:px-12">
        <div className="max-w-[1500px] mx-auto">
          
          <h1 className="text-5xl sm:text-6xl font-bold text-[#800000] mb-10 sm:mb-14">
            My Subjects
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {currentSubjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                courseCode={subject.courseCode}
                courseName={subject.courseName}
                section={subject.section}
                onClick={() => handleViewDetails(subject.id)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={goToPrevious}
                className={`w-12 h-12 flex items-center justify-center rounded-lg text-white transition-all shadow-sm
                  ${currentPage === 1 
                    ? 'bg-[#b89090] cursor-default' 
                    : 'bg-[#800000] hover:bg-[#600000] cursor-pointer'}`}
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <button
                onClick={goToNext}
                className={`w-12 h-12 flex items-center justify-center rounded-lg text-white transition-all shadow-sm
                  ${currentPage === totalPages 
                    ? 'bg-[#b89090] cursor-default' 
                    : 'bg-[#800000] hover:bg-[#600000] cursor-pointer'}`}
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
