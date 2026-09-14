"use client";

import { useEffect, useRef, useState } from "react";

const STUDENTS = [
  {
    id: 1,
    name: "Ananya Sharma",
    course: "Fullstack Development",
    avatar: "👩🏻‍🎓",
    quote:
      "The MERN stack course gave me real project experience. I landed my first developer job within a month of finishing.",
  },
  {
    id: 2,
    name: "Rohit Verma",
    course: "Digital Marketing",
    avatar: "👨🏽‍🎓",
    quote:
      "Hands-on SEO and ad campaigns, not just theory. I now run marketing for a local startup.",
  },
  {
    id: 3,
    name: "Priya Nair",
    course: "BCA",
    avatar: "👩🏾‍🎓",
    quote:
      "Faculty support was excellent. The data science electives really set my resume apart.",
  },
  {
    id: 4,
    name: "Karan Mehta",
    course: "BBA",
    avatar: "👨🏻‍🎓",
    quote:
      "Case studies felt close to real business problems. I interned with a finance firm during my final year.",
  },
  {
    id: 5,
    name: "Simran Kaur",
    course: "Fullstack Development",
    avatar: "👩🏼‍🎓",
    quote:
      "Went from zero coding knowledge to building full projects in six months. Best decision I made.",
  },
];

const AUTOPLAY_INTERVAL = 3500; // ms

export default function StudentCarousel() {
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const intervalRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const scrollToIndex = (index) => {
    const track = trackRef.current;
    const card = cardRefs.current[index];
    if (!track || !card) return;
    track.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
    setActiveIndex(index);
  };

  const goNext = () => {
    const nextIndex = (activeIndex + 1) % STUDENTS.length;
    scrollToIndex(nextIndex);
  };

  const goPrev = () => {
    const prevIndex = (activeIndex - 1 + STUDENTS.length) % STUDENTS.length;
    scrollToIndex(prevIndex);
  };

  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(goNext, AUTOPLAY_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [activeIndex, isPaused]);

  return (
    <section
      className="max-w-6xl mx-auto px-6 sm:px-8 py-16 sm:py-20 transition-all duration-300"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight text-center mb-10 sm:mb-14">
        What our students say
      </h2>

      <div className="relative">
        {/* Track */}
        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-hidden scroll-smooth snap-x snap-mandatory"
        >
          {STUDENTS.map((student, i) => (
            <div
              key={student.id}
              ref={(el) => (cardRefs.current[i] = el)}
              className="snap-start shrink-0 w-full sm:w-1/2 lg:w-1/3 px-1"
            >
              <div className="bg-white dark:bg-[#1c1a21] border border-gray-200 dark:border-white/10 rounded-2xl shadow-md p-8 sm:p-10 flex flex-col items-center text-center h-full transition-all duration-300 min-h-[320px] hover:shadow-lg">
                <div className="w-24 h-24 rounded-full bg-[#030e5a]/10 dark:bg-[#d4c2fc]/10 flex items-center justify-center text-5xl mb-6 transition-colors duration-300">
                  <span aria-hidden="true">{student.avatar}</span>
                </div>
                <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-6 transition-colors duration-300">
                  &ldquo;{student.quote}&rdquo;
                </p>
                <div className="mt-auto">
                  <p className="font-black text-gray-900 dark:text-white text-base transition-colors duration-300">
                    {student.name}
                  </p>
                  <p className="text-xs sm:text-sm text-[#030e5a] dark:text-[#d4c2fc] font-bold uppercase tracking-wider transition-colors duration-300">
                    {student.course}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={goPrev}
          aria-label="Previous"
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-12 h-12 rounded-full bg-white dark:bg-[#1c1a21] border border-gray-200 dark:border-white/10 shadow-lg items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300"
        >
          ‹
        </button>
        <button
          onClick={goNext}
          aria-label="Next"
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-12 h-12 rounded-full bg-white dark:bg-[#1c1a21] border border-gray-200 dark:border-white/10 shadow-lg items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300"
        >
          ›
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-10">
        {STUDENTS.map((student, i) => (
          <button
            key={student.id}
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2.5 rounded-full transition-all ${
              activeIndex === i
                ? "w-8 bg-[#030e5a] dark:bg-[#d4c2fc]"
                : "w-2.5 bg-gray-300 dark:bg-gray-600"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
