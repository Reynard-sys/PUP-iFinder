"use client";

import Image from "next/image";
import { CircleUser, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function BlockRepHeader() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [student, setStudent] = useState(null);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  function openLogoutFlow() {
    setOpen(false);
    setShowLogoutConfirm(true);
  }

  async function confirmLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    localStorage.removeItem("student");
    setShowLogoutConfirm(false);
    setShowLogoutSuccess(true);
    setIsLoggingOut(false);
  }

  function handleSwitchToStudent() {
    router.push("/studentCOR");
    setOpen(false);
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm font-poppins">
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999] px-4"
          onClick={() => !isLoggingOut && setShowLogoutConfirm(false)}
        >
          <div
            className="bg-white w-full max-w-[560px] rounded-xl shadow-2xl px-5 sm:px-10 py-8 sm:py-10"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-center text-xl sm:text-3xl font-extrabold text-[#800000]">
              Confirm logout
            </h2>
            <p className="text-center text-gray-700 mt-2 text-sm sm:text-lg">
              Are you sure you want to log out of your account?
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
              <button
                disabled={isLoggingOut}
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full border border-[#800000] text-[#800000] py-3 rounded-2xl font-bold hover:bg-[#800000] hover:text-white transition disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                disabled={isLoggingOut}
                onClick={confirmLogout}
                className="w-full bg-[#800000] text-white py-3 rounded-2xl font-bold hover:bg-[#660000] transition disabled:opacity-60"
              >
                {isLoggingOut ? "Logging out..." : "Yes, log out"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogoutSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999] px-4">
          <div className="bg-white w-full max-w-[560px] rounded-xl shadow-2xl px-5 sm:px-10 py-8 sm:py-10 text-center">
            <div className="flex items-center justify-center">
              <CheckCircle2 className="text-green-600" size={54} />
            </div>

            <h2 className="mt-4 text-xl sm:text-3xl font-extrabold text-[#800000]">
              Logged out
            </h2>
            <p className="mt-2 text-sm sm:text-lg text-gray-700">
              You have been logged out successfully.
            </p>

            <button
              onClick={() => {
                setShowLogoutSuccess(false);
                router.push("/");
              }}
              className="mt-6 w-full bg-[#800000] text-white text-lg sm:text-xl font-bold py-3.5 sm:py-4 rounded-2xl shadow-md hover:bg-[#660000] transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}

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
                  onClick={openLogoutFlow}
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
