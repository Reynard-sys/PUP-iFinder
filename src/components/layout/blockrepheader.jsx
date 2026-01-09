"use client";

import Image from "next/image";
import { CircleUser } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function BlockRepHeader() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (storedStudent) setStudent(JSON.parse(storedStudent));
  }, []);

  function handleLogout() {
    localStorage.removeItem("student");
    alert("Logged out!");
    router.push("/");
  }

  function handleSwitchToStudent() {
    router.push("/studentCOR");
    setOpen(false);
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm font-poppins">
      <div className="h-20 md:h-24">
        <div className="h-full flex items-center justify-between px-[7%]">
          <div className="flex items-center gap-3 sm:gap-5 min-w-0 select-none">
            <Image
              src="/PUPLogo.png"
              alt="PUP Logo"
              width={70}
              height={70}
              priority
              className="object-contain shrink-0"
            />
            <span className="text-xl sm:text-3xl md:text-4xl font-bold text-[#800000] leading-none tracking-wide truncate">
              PUP iFinder
            </span>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="p-1 sm:p-2 rounded-full hover:bg-gray-100 transition"
              aria-label="Profile"
            >
              <CircleUser strokeWidth={0.75} size={56} className="text-black" />
            </button>

            {open && student && (
              <div className="absolute right-0 top-[72px] sm:top-[78px] w-[92vw] max-w-[500px] bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 z-50 max-h-[70vh] overflow-auto">
                <p className="font-bold text-black text-base sm:text-lg break-all leading-snug">
                  {student?.email}
                </p>
                <p className="text-gray-700 text-xs sm:text-sm mt-0.5">
                  {student?.studentNumber}
                </p>

                <hr className="my-3 sm:my-5 border-gray-200 border-t" />

                <p className="text-gray-900 text-sm sm:text-base font-normal leading-snug">
                  Switch to Student Dashboard?{" "}
                  <button
                    onClick={handleSwitchToStudent}
                    className="text-[#DAA520] font-normal underline underline-offset-2 hover:text-yellow-600 transition"
                  >
                    Click here.
                  </button>
                </p>

                <button
                  onClick={handleLogout}
                  className="mt-4 sm:mt-6 border border-[#800000] text-[#800000] px-4 py-2 rounded-lg font-semibold text-sm sm:text-base hover:bg-[#800000] hover:text-white transition"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
