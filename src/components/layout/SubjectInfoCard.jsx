"use client";

export function SubjectInfoCard({
  subjectData,
  facultyList = [],
  isEditing,
  onFieldChange,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-8 sm:p-10 md:p-12">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
          {subjectData.courseCode}
        </h2>
        <span className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-sm font-medium">
          {subjectData.section}
        </span>
      </div>

      <p className="text-gray-600 text-base sm:text-lg mb-8">
        {subjectData.courseName}
      </p>

      <div className="space-y-6">
        <div className="flex gap-4">
          <svg
            className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">Schedule</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              {subjectData.schedule}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <svg
            className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">Faculty</h3>
            {isEditing ? (
              <select
                value={subjectData.facultyNumber || ""}
                onChange={(e) => {
                  const selectedNumber = e.target.value;

                  const selectedFaculty = facultyList.find(
                    (fac) => fac.FacultyNumber === selectedNumber
                  );

                  onFieldChange("facultyNumber", selectedNumber);

                  if (selectedFaculty) {
                    onFieldChange("faculty.name", selectedFaculty.FacultyName);
                    onFieldChange(
                      "faculty.email",
                      selectedFaculty.FacultyEmail
                    );
                  }
                }}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-black"
              >
                <option value="">-- Select Faculty --</option>
                {facultyList.map((fac) => (
                  <option key={fac.FacultyNumber} value={fac.FacultyNumber}>
                    {fac.FacultyName}
                  </option>
                ))}
              </select>
            ) : (
              <>
                <p className="text-gray-900 text-sm sm:text-base">
                  {subjectData.faculty?.name || "No Faculty Assigned"}
                </p>
                <p className="text-gray-600 text-sm sm:text-base">
                  {subjectData.faculty?.email || "No email available"}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <svg
            className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">
              Block Representative
            </h3>
            <p className="text-gray-900 text-sm sm:text-base">
              {subjectData.blockRep.name}
            </p>
            <p className="text-gray-600 text-sm sm:text-base">
              {subjectData.blockRep.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
