"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../../../components/layout/studentheader";
import { SubjectInfoCard } from "../../../components/layout/SubjectInfoCard";
import { QuickLinksCard } from "../../../components/layout/QuickLinksCard";

import { getSubjectDetails } from "../../actions/getSubjectDetails";
import { getFacultyList } from "../../actions/getFacultyList";
import { updateSubjectDetails } from "../../actions/updateSubjectDetails";

export default function SubjectDetails() {
  const searchParams = useSearchParams();
  const subjectSectionID = parseInt(searchParams.get("id"), 10);

  const [subjectData, setSubjectData] = useState(null);
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!subjectSectionID) {
        setLoading(false);
        return;
      }

      const result = await getSubjectDetails(subjectSectionID);
      const facResult = await getFacultyList();

      if (result.success) setSubjectData(result.data);
      if (facResult.success) setFacultyList(facResult.data);

      setLoading(false);
    }

    fetchData();
  }, [subjectSectionID]);

  const handleFieldChange = (field, value) => {
    setSubjectData((prev) => {
      const keys = field.split(".");
      if (keys.length === 1) return { ...prev, [field]: value };

      return {
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: value,
        },
      };
    });
  };

  const handleLinkChange = (index, value) => {
    setSubjectData((prev) => ({
      ...prev,
      quickLinks: prev.quickLinks.map((link, i) =>
        i === index ? { ...link, url: value } : link
      ),
    }));
  };

  async function handleSave() {
    const result = await updateSubjectDetails(
      subjectSectionID,
      subjectData.facultyNumber,
      subjectData.quickLinks
    );

    if (result.success) {
      alert("Changes saved!");
      setIsEditing(false);
    } else {
      alert("Error saving: " + result.error);
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white pt-40 flex justify-center items-center">
          <p className="text-gray-600 text-xl">Loading subject details...</p>
        </main>
      </>
    );
  }

  if (!subjectData) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white pt-40 flex justify-center items-center">
          <p className="text-red-600 text-xl font-bold">Subject not found.</p>
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
                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg bg-[#b89090] text-white hover:bg-[#a07878]"
              >
                ◀
              </button>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#800000]">
                Subject Details
              </h1>
            </div>

            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-[#800000] text-white px-6 py-3 rounded-lg font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold"
                  >
                    Save
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-[#FFD700] text-black px-6 py-3 rounded-lg font-bold"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-6 lg:gap-8">
            <SubjectInfoCard
              subjectData={subjectData}
              facultyList={facultyList}
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
