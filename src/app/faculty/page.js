"use client";

import Header from "../../components/layout/facultyheader";

export default function FacultyPage() {
    return (
        <>
            <Header />

            <main className="min-h-screen bg-white pt-24 px-10">
                <div className="mb-6 ml-25 mt-10">
                    <h1 className="text-5xl font-bold text-[#800000]">
                        Dashboard
                    </h1>
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
                        <button className="w-[15vw] px-10 py-4 border border-[#800000] text-[#800000] text-xl font-bold rounded-xl hover:bg-[#800000] hover:text-white transition">
                            1st Year
                        </button>

                        <button className="w-[15vw] px-10 py-4 border border-[#800000] text-[#800000] text-xl font-bold rounded-xl hover:bg-[#800000] hover:text-white transition">
                            2nd Year
                        </button>

                        <button className="w-[15vw] px-10 py-4 border border-[#800000] text-[#800000] text-xl font-bold rounded-xl hover:bg-[#800000] hover:text-white transition">
                            3rd Year
                        </button>

                        <button className="w-[15vw] px-10 py-4 border border-[#800000] text-[#800000] text-xl font-bold rounded-xl hover:bg-[#800000] hover:text-white transition">
                            4th Year
                        </button>
                        </div>
                </div>
                
            </main>
        </>
    )
}