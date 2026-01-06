"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Header from "../../components/layout/studentheader";
import { SubjectInfoCard } from "../../components/layout/SubjectInfoCard";
import { QuickLinksCard } from "../../components/layout/QuickLinksCard";

export default function SubjectDetails() {
  const searchParams = useSearchParams();
  const courseCode = searchParams.get('courseCode');
  const section = searchParams.get('section');

  const [isBlockRep, setIsBlockRep] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const allSubjectsData = {
    "COMP 015-BSIT 3-1": {
      courseCode: "COMP 015",
      courseName: "Fundamentals of Research",
      section: "BSIT 3-1",
      schedule: "M/M 7:30AM-12:30PM/1:30PM-4:30PM",
      faculty: {
        name: "Niño Escueta",
        email: "ninoescueta@gmail.com"
      },
      blockRep: {
        name: "Seth Oseas M. Evardo",
        email: "seth.oseas.evardo@gmail.com"
      },
      quickLinks: [
        { name: "Messenger Link", url: "link.com/link" },
        { name: "Google Classroom Link", url: "link.com/link" },
        { name: "MS Teams Link", url: "" },
        { name: "Canvas Link", url: "link.com/link" },
        { name: "Google Drive Link", url: "" },
        { name: "Other Links", url: "link.com/link" }
      ]
    },
    "COMP 020-BSIT 3-1": {
      courseCode: "COMP 020",
      courseName: "Web Development",
      section: "BSIT 3-1",
      schedule: "T/Th 8:00AM-10:00AM/2:00PM-5:00PM",
      faculty: {
        name: "Maria Santos",
        email: "maria.santos@gmail.com"
      },
      blockRep: {
        name: "Seth Oseas M. Evardo",
        email: "seth.oseas.evardo@gmail.com"
      },
      quickLinks: [
        { name: "Messenger Link", url: "#" },
        { name: "Canvas Link", url: "#" },
        { name: "GitHub Classroom Link", url: "#" },
        { name: "Discord Server Link", url: "#" }
      ]
    },
    "COMP 025-BSIT 3-1": {
      courseCode: "COMP 025",
      courseName: "Database Systems",
      section: "BSIT 3-1",
      schedule: "W/F 9:00AM-11:00AM/1:00PM-3:00PM",
      faculty: {
        name: "Juan Dela Cruz",
        email: "juan.delacruz@gmail.com"
      },
      blockRep: {
        name: "Seth Oseas M. Evardo",
        email: "seth.oseas.evardo@gmail.com"
      },
      quickLinks: [
        { name: "Messenger Link", url: "#" },
        { name: "MySQL Workbench Guide", url: "#" },
        { name: "Microsoft Teams Link", url: "#" },
        { name: "Google Classroom Link", url: "#" }
      ]
    }
  };

  const subjectKey = `${courseCode}-${section}`;
  const initialData = allSubjectsData[subjectKey];
  
  const [subjectData, setSubjectData] = useState(initialData);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setSubjectData(initialData);
    setIsEditing(false);
  };

  const handleSave = () => {
    console.log("Saving changes:", subjectData);
    setIsEditing(false);
  };

  const handleFieldChange = (field, value) => {
    const fieldParts = field.split('.');
    if (fieldParts.length === 2) {
      setSubjectData(prev => ({
        ...prev,
        [fieldParts[0]]: {
          ...prev[fieldParts[0]],
          [fieldParts[1]]: value
        }
      }));
    }
  };

  const handleLinkChange = (index, value) => {
    setSubjectData(prev => ({
      ...prev,
      quickLinks: prev.quickLinks.map((link, i) => 
        i === index ? { ...link, url: value } : link
      )
    }));
  };

  if (!subjectData) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white pt-36 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-12">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-center gap-3 sm:gap-4 mb-10">
              <button
                onClick={() => window.history.back()}
                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg bg-[#b89090] text-white hover:bg-[#a07878] transition-colors flex-shrink-0"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#800000]">
                Subject Not Found
              </h1>
            </div>
            <p className="text-gray-600">The subject you're looking for doesn't exist.</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white pt-36 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          
          <div className="flex items-center justify-between mb-10 sm:mb-12">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => window.history.back()}
                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg bg-[#b89090] text-white hover:bg-[#a07878] transition-colors flex-shrink-0"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#800000]">
                My Subjects
              </h1>
            </div>

            {isBlockRep && (
              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="bg-[#800000] text-white px-6 sm:px-10 py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base hover:bg-[#600000] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="bg-green-600 text-white px-6 sm:px-10 py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base hover:bg-green-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="bg-[#FFD700] text-black px-6 sm:px-10 py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base hover:bg-[#FFC700] transition-colors"
                  >
                    Edit
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-6 lg:gap-8">
            <SubjectInfoCard 
              subjectData={subjectData} 
              isEditing={isEditing}
              onFieldChange={handleFieldChange}
            />
            <QuickLinksCard 
              links={subjectData.quickLinks}
              isEditing={isEditing}
              onLinkChange={handleLinkChange}
            />
          </div>
        </div>
      </main>
    </>
  );
}
