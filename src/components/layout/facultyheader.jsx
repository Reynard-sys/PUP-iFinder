"use client";

import Image from "next/image";
import { CircleUser } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const [faculty, setFaculty] = useState(null);

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
    const storedFaculty = localStorage.getItem("faculty");
    if (storedFaculty) {
      setFaculty(JSON.parse(storedFaculty));
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("faculty");
    alert("Logged out!");
    router.push("/");
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm h-20 md:h-24 font-poppins">
      <div className="flex items-center h-full w-full pl-[7%]">
        {/* Not clickable anymore */}
        <div className="flex items-center gap-3 sm:gap-5 select-none">
          <Image
            src="/PUPLogo.png"
            alt="PUP Logo"
            width={70}
            height={70}
            priority
            className="object-contain"
          />
          <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#800000] leading-none tracking-wide">
            PUP iFinder
          </span>
        </div>

        <div className="ml-auto flex items-center mr-[7%] relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
            aria-label="Profile"
          >
            <CircleUser strokeWidth={0.75} size={70} className="text-black" />
          </button>

          {open && (
            <div className="absolute right-0 top-[90px] w-lg l-2xl bg-white rounded-2xl shadow-xl border border-gray-200 p-6 z-50">
              <p className="font-bold text-black text-lg">{faculty?.email}</p>
              <p className="text-gray-700 text-sm">{faculty?.facultyNumber}</p>

              <button
                onClick={handleLogout}
                className="mt-6 border border-[#800000] text-[#800000] px-4 py-2 rounded-lg font-semibold hover:bg-[#800000] hover:text-white transition"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
