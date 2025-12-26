"use client";

import { useState } from "react";
import Header from "../../components/layout/facultyheader";

export default function FacultyPage() {
  const [selectedYear, setSelectedYear] = useState("1st Year");
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [count, setCount] = useState("");
  const [codes, setCodes] = useState([]);

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleGenerate = () => {
    const num = parseInt(count);
    if (!num || num <= 0) return alert("Enter a valid number!");

    const newCodes = Array.from({ length: num }, () => generateCode());
    setCodes(newCodes);
    setStep(2);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(codes.join("\n"));
    alert("Copied all codes!");
  };

  const refresh = () => {
    const num = codes.length;
    const newCodes = Array.from({ length: num }, () => generateCode());
    setCodes(newCodes);
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white pt-24 px-10">
        <div className="mb-6 ml-25 mt-10">
          <h1 className="text-5xl font-bold text-[#800000]">Dashboard</h1>
        </div>

        <div className="flex items-center gap-4 mb-8 ml-25 mt-10">
          <input
            type="text"
            placeholder="Search for Student Code/Program"
            className="
                            w-[90vw]
                            h-[6vh]
                            max-w-7xl
                            px-4
                            py-2
                            text-2xl
                            border
                            border-[#800000]
                            rounded-xl
                            focus:outline-none
                            text-black
                            placeholder:text-black/40
                            "
          />
          <button className="w-[15vw] h-[6vh] max-w-sm bg-[#800000] text-white text-2xl font-bold rounded-xl hover:bg-[#660000] transition-colors ml-14">
            Search
          </button>
        </div>

        <div className="flex items-center gap-4 mb-8 ml-25">
          <div className="flex items-center gap-30 mb-8 ml-10 mt-5">
            <button
              onClick={() => setSelectedYear("1st Year")}
              className={`w-[15vw] px-10 py-4 border border-[#800000] text-xl font-bold rounded-xl transition
                                ${
                                  selectedYear === "1st Year"
                                    ? "bg-[#800000] text-white"
                                    : "text-[#800000] hover:bg-[#800000] hover:text-white"
                                }
                            `}
            >
              1st Year
            </button>

            <button
              onClick={() => setSelectedYear("2nd Year")}
              className={`w-[15vw] px-10 py-4 border border-[#800000] text-xl font-bold rounded-xl transition
                                ${
                                  selectedYear === "2nd Year"
                                    ? "bg-[#800000] text-white"
                                    : "text-[#800000] hover:bg-[#800000] hover:text-white"
                                }
                            `}
            >
              2nd Year
            </button>

            <button
              onClick={() => setSelectedYear("3rd Year")}
              className={`w-[15vw] px-10 py-4 border border-[#800000] text-xl font-bold rounded-xl transition
                                ${
                                  selectedYear === "3rd Year"
                                    ? "bg-[#800000] text-white"
                                    : "text-[#800000] hover:bg-[#800000] hover:text-white"
                                }
                            `}
            >
              3rd Year
            </button>

            <button
              onClick={() => setSelectedYear("4th Year")}
              className={`w-[15vw] px-10 py-4 border border-[#800000] text-xl font-bold rounded-xl transition
                                ${
                                  selectedYear === "4th Year"
                                    ? "bg-[#800000] text-white"
                                    : "text-[#800000] hover:bg-[#800000] hover:text-white"
                                }
                            `}
            >
              4th Year
            </button>
          </div>
        </div>

        <div className="ml-25 mt-6 w-[85vw] max-w-8xl h-[50vh] bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="h-20 bg-[#800000] flex items-center justify-between px-6">
            <h2 className="text-4xl ml-5 font-bold text-white">
              {selectedYear}
            </h2>

            <button
              className="bg-white text-[#000000] text-xl font-bold px-5 py-3 mr-5 rounded-xl hover:bg-gray-200 transition"
              onClick={() => {
                setShowModal(true);
                setStep(1);
                setCount("");
                setCodes([]);
              }}
            >
              Generate Code
            </button>

            {showModal && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white w-[700px] rounded-lg shadow-xl overflow-hidden">
                  <div className="bg-[#800000] text-white flex justify-between items-center px-6 py-4">
                    <h2 className="text-2xl font-bold">Access Codes</h2>

                    {step === 2 && (
                      <div className="flex gap-4 text-sm font-semibold">
                        <button onClick={copyAll} className="hover:underline">
                          COPY ALL
                        </button>
                        <button onClick={refresh} className="hover:underline">
                          REFRESH
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="p-8">
                    {step === 1 && (
                      <div className="flex flex-col gap-4">
                        <label className="text-lg font-semibold text-gray-700">
                          How many codes do you want to generate?
                        </label>
                        <input
                          type="number"
                          value={count}
                          onChange={(e) => setCount(e.target.value)}
                          className="border border-gray-300 rounded-md px-4 py-2 text-lg text-black"
                          placeholder="Enter number"
                        />
                        <button
                          onClick={handleGenerate}
                          className="bg-[#800000] text-white font-bold px-6 py-3 rounded-lg hover:bg-[#660000]"
                        >
                          Generate
                        </button>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="grid grid-cols-5 border border-gray-400">
                        {codes.map((code, index) => (
                          <div
                            key={index}
                            className="border border-gray-400 flex items-center justify-center py-6 text-lg font-medium text-black"
                          >
                            {code}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-8 flex justify-center">
                      <button
                        className="text-gray-500 hover:text-black"
                        onClick={() => setShowModal(false)}
                      >
                        CLOSE
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6"></div>
        </div>
      </main>
    </>
  );
}
