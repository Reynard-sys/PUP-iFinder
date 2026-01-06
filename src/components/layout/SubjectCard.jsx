"use client";

import { useRouter } from "next/navigation";

export default function SubjectCard({
  courseCode,
  courseName,
  section,
  subjectSectionID,
  basePath = "/subjectDetails", // default for students
}) {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`${basePath}?id=${subjectSectionID}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 flex flex-col gap-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {courseCode}
        </h2>

        <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
          {section}
        </span>
      </div>

      <p className="text-gray-600 text-sm sm:text-base">
        {courseName}
      </p>

      <button
        onClick={handleViewDetails}
        className="bg-[#800000] text-white py-3 px-6 rounded-lg font-bold text-sm sm:text-base transition-all hover:bg-[#600000] active:bg-[#400000] active:scale-95 cursor-pointer"
      >
        View Details
      </button>
    </div>
  );
}
