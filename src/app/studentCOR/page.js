"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/layout/studentheader";

export default function StudentCOR() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [storedCORUrl, setStoredCORUrl] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (!storedStudent) return;

    const studentObj = JSON.parse(storedStudent);
    const corUrl = `/cor_uploads/${studentObj.studentNumber}.pdf`;

    fetch(corUrl, { method: "HEAD" }).then((res) => {
      if (res.ok) {
        setStoredCORUrl(corUrl);
        setPreviewUrl(corUrl);
        setSubmitted(true);
      }
    });
  }, []);

  const processFile = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF file");
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setFile(selectedFile);
    setPreviewUrl(url);
    setError(null);
    setSubmitted(false);
    setVerified(false);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    processFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    processFile(droppedFile);
  };

  const handleUpload = async () => {
    if (!file) return setError("Please select a file first.");

    const storedStudent = localStorage.getItem("student");
    if (!storedStudent) return setError("You must be logged in");

    const studentObj = JSON.parse(storedStudent);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("studentNumber", studentObj.studentNumber);

    setVerifying(true);

    const res = await fetch("/api/cor-upload", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();

    if (result.success) {
      setVerified(true);
      
      setTimeout(() => {
        router.push("/studentSubject");
      }, 1500);
    } else {
      setVerifying(false);
      setError(result.error);
    }
  };

  const handleDelete = async () => {
    const storedStudent = localStorage.getItem("student");
    if (!storedStudent) return setError("You must be logged in");

    const studentObj = JSON.parse(storedStudent);

    const res = await fetch("/api/cor-delete", {
      method: "POST",
      body: JSON.stringify({ studentNumber: studentObj.studentNumber }),
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();

    if (result.success) {
      alert("✅ COR deleted successfully!");

      setFile(null);
      setPreviewUrl(null);
      setStoredCORUrl(null);
      setSubmitted(false);
      setError(null);
    } else {
      setError(result.error);
    }
  };

  return (
    <>
      <Header />

      {error && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-red-800 mb-3 text-center">
              Error
            </h2>

            <p className="text-gray-700 text-center text-sm">{error}</p>

            <button
              onClick={() => setError(null)}
              className="mt-6 w-full bg-red-800 text-white py-2 rounded-xl font-bold hover:bg-red-900 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <main className="min-h-screen bg-white flex items-center justify-center pt-20 sm:pt-24 px-4 sm:px-6 py-8">
        <div
          className={`w-full max-w-[1400px] h-[75vh] sm:h-[80vh] lg:h-[83vh] border-[3px] rounded-3xl flex flex-col items-center justify-center p-6 sm:p-8 md:p-12 transition
          ${dragActive ? "border-[#800000] bg-red-50" : "border-black bg-white"}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#800000] mb-8 text-center">
            Certificate of Registration
          </h1>

          {!previewUrl ? (
            <>
              <p className="text-gray-500 italic mb-4 text-center">
                Drag & drop your COR PDF here or click Upload
              </p>

              <label
                htmlFor="file-upload"
                className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 flex items-center justify-center rounded-2xl bg-gray-100 border-2 border-red-300 mb-5 sm:mb-6 cursor-pointer hover:bg-gray-200 transition-colors"
              >
                <svg
                  className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 text-[#800000]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                  <path d="M14 2v6h6" />
                  <circle cx="12" cy="15" r="3" fill="white" />
                  <path d="M12 13v4m-2-2h4" stroke="white" strokeWidth="1.5" />
                </svg>
              </label>

              <input
                id="file-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                onClick={() => document.getElementById("file-upload")?.click()}
                className="bg-[#800000] text-white px-10 py-3 rounded-lg font-bold hover:bg-[#600000]"
              >
                Upload
              </button>
            </>
          ) : (
            <div className="w-full flex flex-col items-center relative">
              {verifying && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                  <div className="flex flex-col items-center">
                    {!verified ? (
                      <>
                        <div className="w-20 h-20 border-4 border-[#800000] border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-[#800000] font-semibold text-lg">Verifying...</p>
                        <p className="text-gray-500 text-sm mt-2">Check "SUBJECTS" tab.</p>
                      </>
                    ) : (
                      <>
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                          <svg
                            className="w-12 h-12 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <p className="text-green-600 font-bold text-lg mt-4">Verified!</p>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className={`w-full max-w-2xl bg-gray-100 rounded-lg p-4 shadow-lg border-2 ${verifying ? 'border-[#800000]' : 'border-gray-200'} transition-colors`}>
                <iframe
                  src={`${previewUrl}#page=1&view=FitH`}
                  width="100%"
                  height="350px"
                  className="rounded"
                  title="PDF Preview"
                />
              </div>

              <p className="text-sm text-gray-600 mt-3">
                Uploaded file: {file?.name || storedCORUrl?.split('/').pop()}
              </p>

              <div className="flex gap-4 mt-6">
                {!submitted ? (
                  <button
                    onClick={handleUpload}
                    disabled={verifying}
                    className="bg-[#800000] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#600000] disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                  >
                    Confirm Upload
                  </button>
                ) : (
                  <button
                    onClick={handleDelete}
                    className="bg-red-700 text-white px-10 py-3 rounded-lg font-bold hover:bg-red-800"
                  >
                    Delete COR
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
