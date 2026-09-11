"use client";

import { useState } from "react";

const CATEGORIES = [
  {
    id: "digital-marketing",
    name: "Digital Marketing",
    icon: "📈",
    courses: [
      {
        title: "Digital Marketing Fundamentals",
        duration: "3 Months",
        mode: "Online / Offline",
        price: "₹ 12,999",
      },
      {
        title: "Advanced SEO & SEM",
        duration: "2 Months",
        mode: "Online",
        price: "₹ 8,999",
      },
      {
        title: "Social Media Marketing Pro",
        duration: "2 Months",
        mode: "Offline",
        price: "₹ 9,499",
      },
    ],
  },
  {
    id: "fullstack-development",
    name: "Fullstack Development",
    icon: "💻",
    courses: [
      {
        title: "MERN Stack Development",
        duration: "6 Months",
        mode: "Online / Offline",
        price: "₹ 34,999",
      },
      {
        title: "Java Fullstack Development",
        duration: "6 Months",
        mode: "Offline",
        price: "₹ 36,999",
      },
      {
        title: "Frontend with React & Next.js",
        duration: "3 Months",
        mode: "Online",
        price: "₹ 18,999",
      },
    ],
  },
  {
    id: "bba",
    name: "BBA",
    icon: "🎓",
    courses: [
      {
        title: "BBA General",
        duration: "3 Years",
        mode: "Offline",
        price: "₹ 1,20,000 / yr",
      },
      {
        title: "BBA Finance",
        duration: "3 Years",
        mode: "Offline",
        price: "₹ 1,25,000 / yr",
      },
      {
        title: "BBA International Business",
        duration: "3 Years",
        mode: "Offline",
        price: "₹ 1,30,000 / yr",
      },
    ],
  },
  {
    id: "bca",
    name: "BCA",
    icon: "🖥️",
    courses: [
      {
        title: "BCA General",
        duration: "3 Years",
        mode: "Offline",
        price: "₹ 1,10,000 / yr",
      },
      {
        title: "BCA Data Science",
        duration: "3 Years",
        mode: "Offline",
        price: "₹ 1,20,000 / yr",
      },
      {
        title: "BCA Cloud Computing",
        duration: "3 Years",
        mode: "Offline",
        price: "₹ 1,20,000 / yr",
      },
    ],
  },
];

function CourseCard({ course }) {
  return (
    <div className="bg-white dark:bg-[#1c1a21] border border-gray-200 dark:border-white/10 rounded-2xl shadow-md p-6 sm:p-7 flex flex-col min-h-[220px] transition-all duration-300 hover:shadow-lg">
      <h4 className="font-black text-gray-900 dark:text-white text-base sm:text-lg uppercase leading-snug mb-3 transition-colors duration-300">
        {course.title}
      </h4>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1.5 transition-colors duration-300">Duration: {course.duration}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 transition-colors duration-300">Mode: {course.mode}</p>
      <div className="mt-auto flex items-center justify-between gap-2">
        <span className="font-extrabold text-gray-900 dark:text-white text-base sm:text-lg transition-colors duration-300">
          {course.price}
        </span>
        <button className="bg-[#030e5a] hover:bg-[#030e5a]/90 dark:bg-[#d4c2fc] dark:hover:bg-[#d4c2fc]/90 dark:text-[#28262c] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors duration-300">
          Enroll Now
        </button>
      </div>
    </div>
  );
}

export default function CourseMenu() {
  const [activeId, setActiveId] = useState(CATEGORIES[0].id);
  const activeCategory = CATEGORIES.find((c) => c.id === activeId);

  return (
    <div className="bg-[#f3f3f3] dark:bg-[#28262c] transition-colors duration-300">
    
    <section className="max-w-6xl mx-auto px-6 sm:px-8 py-16 bg-[#f3f3f3] dark:bg-[#28262c] transition-colors duration-300">
      {/* <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white mb-6">

        Our Courses
      </h1> */}
       
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight text-center mb-12">
           Our Courses
    </h2>

      {/* Desktop / tablet layout: sidebar + grid */}
      <div className="hidden md:flex gap-8 items-start">
        <div className="w-72 sm:w-80 flex-shrink-0 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden transition-colors duration-300">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveId(cat.id)}
              className={`w-full flex items-center gap-3.5 px-6 py-4.5 text-left text-base border-b last:border-b-0 border-gray-200 dark:border-white/10 transition-colors ${
                activeId === cat.id
                  ? "bg-[#030e5a]/10 border-l-4 border-l-[#030e5a] font-bold text-[#030e5a] dark:bg-[#d4c2fc]/10 dark:border-l-[#d4c2fc] dark:text-[#d4c2fc]"
                  : "hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300"
              }`}
            >
              <span className="text-xl" aria-hidden="true">
                {cat.icon}
              </span>
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCategory.courses.map((course) => (
            <CourseCard key={course.title} course={course} />
          ))}
        </div>
      </div>

      {/* Mobile layout: accordion */}
      <div className="md:hidden border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden transition-colors duration-300">
        {CATEGORIES.map((cat) => {
          const isOpen = activeId === cat.id;
          return (
            <div key={cat.id} className="border-b last:border-b-0 border-gray-200 dark:border-white/10">
              <button
                onClick={() => setActiveId(isOpen ? null : cat.id)}
                className={`w-full flex items-center justify-between px-6 py-4.5 text-left text-base transition-colors ${
                  isOpen ? "bg-[#030e5a]/10 font-bold text-[#030e5a] dark:bg-[#d4c2fc]/10 dark:text-[#d4c2fc]" : "text-gray-700 dark:text-gray-300"
                }`}
              >
                <span className="flex items-center gap-3.5">
                  <span className="text-xl" aria-hidden="true">
                    {cat.icon}
                  </span>
                  {cat.name}
                </span>
                <span
                  className={`transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  ▾
                </span>
              </button>

              {isOpen && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 bg-gray-50 dark:bg-[#1c1a21] transition-colors duration-300">
                  {cat.courses.map((course) => (
                    <CourseCard key={course.title} course={course} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
    </div>
  );
}