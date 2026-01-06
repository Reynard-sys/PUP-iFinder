"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../../components/layout/studentheader";
import { SubjectInfoCard } from "../../components/layout/SubjectInfoCard";
import { QuickLinksCard } from "../../components/layout/QuickLinksCard";
import { getSubjectDetails } from "../actions/getSubjectDetails";

export default function SubjectDetails() {
  const searchParams = useSearchParams();
  const subjectSectionID = searchParams.get("id");

  const [subjectData, setSubjectData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubject() {
      if (!subjectSectionID) return;

      const result = await getSubjectDetails(subjectSectionID);

      if (result.success) {
        setSubjectData(result.data);
      } else {
        setSubjectData(null);
      }

      setLoading(false);
    }

    fetchSubject();
  }, [subjectSectionID]);

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
                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg bg-[#b89090] text-white hover:bg-[#a07878] transition-colors"
              >
                ◀
              </button>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#800000]">
                My Subjects
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-6 lg:gap-8">
            <SubjectInfoCard
              subjectData={subjectData}
              isEditing={false}
              onFieldChange={() => {}}
            />
            <QuickLinksCard
              links={subjectData.quickLinks}
              isEditing={false}
              onLinkChange={() => {}}
            />
          </div>
        </div>
      </main>
    </>
  );
}
