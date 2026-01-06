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
      const id = parseInt(searchParams.get("id"), 10);
      if (!id) {
        setLoading(false);
        return;
      }

      const result = await getSubjectDetails(Number(subjectSectionID));
      const facResult = await getFacultyList();

      if (result.success) setSubjectData(result.data);
      if (facResult.success) setFacultyList(facResult.data);

      setLoading(false);
    }

    fetchData();
  }, [searchParams]);

  const handleFieldChange = (field, value) => {
    setSubjectData((prev) => {
      const keys = field.split(".");
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      }

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
    <div className="pt-40 text-black text-4xl">
      BLOCKREP SUBJECTDETAILS LOADED ✅
    </div>
  </>
);
}
