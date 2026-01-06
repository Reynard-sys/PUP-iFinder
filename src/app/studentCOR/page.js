"use client";

import { useState } from "react";
import Header from "../../components/layout/studentheader";

export default function StudentCOR() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files?.[0];
    
    if (selectedFile) {
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
    }
  };

  const handleUpload = () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }
    alert("File ready: " + file.name);
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white flex items-center justify-center pt-20 sm:pt-24 px-4 sm:px-6 py-8">
        <div className="w-full max-w-[1400px] h-[75vh] sm:h-[80vh] lg:h-[83vh] border-[3px] border-black rounded-3xl flex flex-col items-center justify-center p-6 sm:p-8 md:p-12">
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#800000] mb-8 text-center">
            Certificate of Registration
          </h1>

          {!previewUrl ? (
            <>
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

              <p className="text-xs sm:text-sm md:text-base text-gray-500 italic mb-5 sm:mb-6 text-center">
                Accepted file format: .pdf
              </p>

              {error && (
                <p className="text-red-600 text-sm mb-3 text-center">{error}</p>
              )}

              <button
                onClick={() => document.getElementById("file-upload")?.click()}
                className="bg-[#800000] text-white px-10 sm:px-12 md:px-16 py-3 sm:py-3.5 md:py-4 rounded-lg font-bold text-base sm:text-lg md:text-xl transition-all hover:bg-[#600000] active:bg-[#400000] active:scale-95 shadow-md hover:shadow-lg"
              >
                Upload
              </button>
            </>
          ) : (
            <div className="w-full flex flex-col items-center">
              <div className="w-full max-w-2xl bg-gray-100 rounded-lg p-4 shadow-lg border-2 border-gray-200">
                <iframe 
                  src={`${previewUrl}#page=1&view=FitH`}
                  type="application/pdf" 
                  width="100%" 
                  height="350px"
                  className="rounded"
                  title="PDF Preview"
                />
              </div>

              <p className="text-base text-gray-700 mt-4 font-medium">
                Uploaded file: {file?.name}
              </p>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => {
                    setFile(null);
                    setPreviewUrl(null);
                    setError(null);
                  }}
                  className="bg-gray-500 text-white px-8 py-3 rounded-lg font-bold text-base transition-all hover:bg-gray-600 active:scale-95 shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  className="bg-[#800000] text-white px-8 py-3 rounded-lg font-bold text-base transition-all hover:bg-[#600000] active:bg-[#400000] active:scale-95 shadow-md hover:shadow-lg"
                >
                  Confirm Upload
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
