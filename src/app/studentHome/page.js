"use client";

import AboutCard from "@/components/layout/AboutCard";
import Header from "../../components/layout/landingheader";

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <section
          id="home"
          className="min-h-screen flex items-center justify-center pt-20 px-6 sm:px-8"
          style={{ backgroundColor: "#800000" }}
        >
          <div className="flex flex-col md:flex-row w-full max-w-[90rem] mx-auto">
            <div className="flex-1 text-white flex flex-col justify-center pr-0 md:pr-10 mb-10 md:mb-0 text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                Welcome to PUP iFinder!
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-snug">
                The official student hub for irregular students.
                <br />
                Find your class information easily, at one tap.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-9 shadow-lg w-full max-w-[90%] sm:max-w-[400px] md:max-w-[500px] mx-auto">
              <h2 className="text-2xl font-bold text-red-900 mb-2 text-center">
                Welcome Back!
              </h2>
              <p className="text-center text-lg sm:text-xl mb-10 text-black">
                Sign in to your account
              </p>

              <form className="flex flex-col gap-6 sm:gap-8">
                <div className="flex flex-col text-left">
                  <label
                    htmlFor="studentNumber"
                    className="text-base sm:text-lg font-medium text-red-900 mb-1"
                  >
                    Student Number
                  </label>
                  <input
                    id="studentNumber"
                    type="text"
                    placeholder="Enter your student number"
                    className="border border-red-900 rounded-lg px-4 py-3 sm:py-4 focus:outline-none focus:ring-2 focus:ring-red-700"
                  />
                </div>

                <div className="flex flex-col text-left">
                  <label
                    htmlFor="password"
                    className="text-base sm:text-lg font-medium text-red-900 mb-1"
                  >
                    Password
                  </label>
                  PinkContainer
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="border border-red-900 rounded-lg px-4 py-3 sm:py-4 focus:outline-none focus:ring-2 focus:ring-red-700"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-red-900 text-white py-3 sm:py-4 rounded-lg font-bold mt-2 text-lg"
                >
                  Log In
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-red-900">
                Don’t have an account?{" "}
                <a href="#" className="text-yellow-400 font-medium">
                  Create one here.
                </a>
              </p>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="bg-gradient-to-b from-[#800000] from-10% to-[#F2C400] to-80% scroll-mt-24 min-h-screen flex flex-col gap-10 sm:gap-12 md:gap-15 items-center justify-between pt-20 pb-20 px-4 sm:px-8"
        >
          <h1 className="font-bold text-[#ffdf00] text-4xl sm:text-6xl lg:text-5xl">
            About iFinder
          </h1>

          <div className="flex flex-col min-[1745px]:flex-row items-center gap-14 min-[1745px]:gap-8">
            <AboutCard
              icon="/bell.png"
              bgColor="#d28f8f"
              fontColor="#371111"
              title="Access your class information easily"
              description="All your essential class details, simplified."
            />
            <AboutCard
              icon="/folder_structure.png"
              bgColor="#ffdf00"
              fontColor="#800000"
              title="Classroom links in one website"
              description="No more searching for the right class link."
            />
            <AboutCard
              icon="/book.png"
              bgColor="#371111"
              fontColor="#ffdf00"
              title="Get notified on subject updates"
              description="Subject information is updated in real time."
            />
          </div>
        </section>

        <section
          id="FAQs"
          className="relative min-h-screen flex items-center justify-center pt-20 px-4 sm:px-8 bg-center bg-cover bg-no-repeat"
          style={{
            backgroundImage: "url('/PUP_thumbnail.jpg')",
            backgroundPosition: "center top",
          }}
        >
          <div className="absolute inset-0 bg-[#E07979]/70"></div>

          <div
            className="relative z-10 bg-[#800000]/95 backdrop-blur-sm rounded-3xl shadow-2xl
               flex flex-col items-center justify-center
               w-[60vw] h-[70vh] max-w-[90vw] max-h-[80vh]
               p-8 sm:p-10 text-white overflow-y-auto"
          >
            <div className="flex flex-col items-center justify-center h-full">
              <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
                Frequently Asked Questions
              </h1>

              <div className="w-[80%] sm:w-[100%] flex flex-col items-center gap-4">
                {[
                  {
                    q: "What's the purpose of iFinder?",
                    a: "iFinder helps students access class information and links in one place.",
                  },
                  {
                    q: "Is iFinder only for Irregulars?",
                    a: "No. It’s designed for all students, regular or irregular.",
                  },
                  {
                    q: "What if there’s no information in the subject yet?",
                    a: "The subject will be updated as soon as new details are provided by professors.",
                  },
                  {
                    q: "Is it updated on the current semester?",
                    a: "Yes. All data reflects the current semester’s subjects and links.",
                  },
                  {
                    q: "Is this only for PUP Students?",
                    a: "Currently yes, it’s tailored for PUP students’ class structures.",
                  },
                ].map(({ q, a }, i) => (
                  <details
                    key={i}
                    className="group border-b border-white/20 w-full cursor-pointer"
                  >
                    <summary className="flex justify-between items-center font-semibold text-lg text-left py-2 select-none">
                      <span className="flex-1">{q}</span>
                      <span
                        className="text-[10px] font-light transition-transform duration-300 group-open:rotate-180"
                        style={{ transformOrigin: "center" }}
                      >
                        ˅
                      </span>
                    </summary>
                    <p className="mt-2 text-white/90 text-base leading-relaxed text-center px-2">
                      {a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer
          id="contact"
          className="scroll-mt-24 bg-red-900 text-white py-12 px-6 sm:px-12 md:px-20"
        >
          <div className="max-w-[90rem] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
            <div>
              <h3 className="text-lg font-bold text-yellow-400 mb-3">
                About PUP
              </h3>
              <p className="text-sm leading-relaxed mb-6">
                The Polytechnic University of the Philippines is committed to
                providing quality education through our innovative online
                subject information finder platform.
              </p>
              <p className="text-sm text-gray-200">
                © 2025 Polytechnic University of the Philippines.
                <br />
                All rights reserved.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-yellow-400 mb-3">
                Contact us
              </h3>
              <p className="text-sm leading-relaxed">
                Phone: (+63 2) 5335-1PUP (5335-1787) or 5335-1777
                <br />
                Email:{" "}
                <a
                  href="mailto:inquire@pup.edu.ph"
                  className="text-yellow-300 hover:underline"
                >
                  inquire@pup.edu.ph
                </a>
                <br />
                Location: A. Mabini Campus, Anonas St., Sta. Mesa, Manila,
                Philippines
              </p>
            </div>
          </div>

          <hr className="border-t border-gray-400 my-8 opacity-50" />

          <div className="text-center">
            <a
              href="#home"
              className="text-white font-semibold hover:text-yellow-300 transition"
            >
              Go back to the top page
            </a>
          </div>
        </footer>
      </main>
    </>
  );
}
