"use client";

import Link from "next/link";
import Image from "next/image";
import { CircleUser, Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { verifyCode } from "../../app/actions/verifycode";
import { hasUsedCode } from "../../app/actions/hasUsedCode";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [student, setStudent] = useState(null);

  const [showBlockModal, setShowBlockModal] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [codeError, setCodeError] = useState("");

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

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  function handleLogout() {
    localStorage.removeItem("student");
    alert("Logged out!");
    router.push("/");
  }

  async function handleEnterCode() {
    setCodeError("");

    if (!accessCode.trim()) {
      setCodeError("Please enter an access code.");
      return;
    }

    const storedStudent = localStorage.getItem("student");
    if (!storedStudent) {
      setCodeError("You must be logged in.");
      return;
    }

    const studentObj = JSON.parse(storedStudent);
    const studentNumber = studentObj.studentNumber;

    const result = await verifyCode(accessCode.trim(), studentNumber);

    if (result.success) {
      setShowBlockModal(false);
      router.push("/blockrep");
    } else {
      setCodeError(result.error);
    }
  }

  const linkClass = (href) =>
    `transition whitespace-nowrap ${
      pathname === href
        ? "text-[#800000] underline underline-offset-4"
        : "text-black hover:text-red-900"
    }`;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm font-poppins">
      {showBlockModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={() => setShowBlockModal(false)}
        >
          <div
            className="bg-white w-full max-w-[620px] rounded-xl shadow-2xl px-5 sm:px-10 py-8 sm:py-12 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-center text-xl sm:text-3xl font-extrabold text-[#800000]">
              Block Representative
            </h2>
            <p className="text-center text-gray-700 mt-1 sm:mt-2 text-sm sm:text-lg">
              Enter your access code here
            </p>

            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="mt-6 sm:mt-10 w-full border-2 border-[#C4666B] rounded-2xl px-5 sm:px-6 py-3 sm:py-4 text-base sm:text-lg text-black focus:outline-none focus:ring-2 focus:ring-[#800000]"
            />

            {codeError && (
              <p className="mt-2 text-center text-red-700 font-semibold text-sm">
                {codeError}
              </p>
            )}

            <button
              onClick={handleEnterCode}
              className="mt-5 sm:mt-6 w-full bg-[#800000] text-white text-lg sm:text-xl font-bold py-3.5 sm:py-4 rounded-2xl shadow-md hover:bg-[#660000] transition"
            >
              Enter
            </button>

            <button
              onClick={() => setShowBlockModal(false)}
              className="mt-4 sm:mt-6 w-full text-center text-[#800000] font-semibold hover:underline"
            >
              Go back
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

          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="hidden md:flex items-center gap-10 text-black font-semibold text-lg">
              <Link href="/studentCOR" className={linkClass("/studentCOR")}>
                COR
              </Link>
              <Link href="/studentSubject" className={linkClass("/studentSubject")}>
                Subject
              </Link>
            </nav>

            <button
              type="button"
              className="md:hidden p-2 rounded-lg bg-white hover:bg-gray-200 transition"
              aria-label="Menu"
              onClick={() => {
                setMobileNavOpen((v) => !v);
                setOpen(false);
              }}
            >
              {mobileNavOpen ? (
                <X size={30} className="text-[#800000]" />
              ) : (
                <Menu size={30} className="text-[#800000]" />
              )}
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setOpen((v) => !v);
                  setMobileNavOpen(false);
                }}
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
                    Block Representative?{" "}
                    <button
                      onClick={async () => {
                        const storedStudent = localStorage.getItem("student");
                        if (!storedStudent) return;

                        const studentObj = JSON.parse(storedStudent);
                        const studentNumber = studentObj.studentNumber;

                        const result = await hasUsedCode(studentNumber);

                        if (result.success && result.used) {
                          router.push("/blockrep");
                          setOpen(false);
                          return;
                        }

                        setShowBlockModal(true);
                        setOpen(false);
                        setAccessCode("");
                        setCodeError("");
                      }}
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
      </div>

      {mobileNavOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-[7%] pt-4 pb-6 shadow-sm">
          <div className="flex items-center gap-8 font-semibold">
            <Link href="/studentCOR" className={linkClass("/studentCOR")}>
              COR
            </Link>
            <Link href="/studentSubject" className={linkClass("/studentSubject")}>
              Subject
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
