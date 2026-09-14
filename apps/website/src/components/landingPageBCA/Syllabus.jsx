"use client";

import { useState } from "react";
import { ChevronDown, CheckCircle2, BookOpen } from "lucide-react";
import { syllabusData } from "./syllabusData";

const CourseList = ({ courses, color = "primary" }) => (
  <ul className="space-y-2.5">
    {courses.map((course, i) => (
      <li key={i} className="flex items-start gap-2.5 group">
        <div
          className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${color === "primary" ? "bg-primary" : "bg-secondary"}`}
        />
        <span className="text-sm text-muted-foreground dark:text-neutral-400 font-medium">
          {course}
        </span>
      </li>
    ))}
  </ul>
);

const ContentSection = ({ title, courses, color = "primary" }) => (
  <div>
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${color === "primary" ? "bg-primary/15 text-primary" : "bg-secondary/15 text-secondary"}`}
    >
      <BookOpen size={12} />
      {title}
    </div>
    <CourseList courses={courses} color={color} />
  </div>
);

const MobileSection = ({ item, isOpen, onToggle }) => (
  <div
    className={`border rounded-xl overflow-hidden transition-colors ${isOpen ? "border-primary bg-card dark:bg-neutral-900/50" : "border-border dark:border-neutral-800 bg-background"}`}
  >
    <button
      onClick={onToggle}
      className="w-full text-left p-4 flex justify-between items-center"
    >
      <div className="flex flex-col gap-0.5">
        <h3
          className={`text-base font-bold ${isOpen ? "text-primary" : "text-foreground"}`}
        >
          {item.semester}
        </h3>
        {item.special && (
          <span className="text-xs font-bold text-primary uppercase">
            Industry Integrated
          </span>
        )}
      </div>
      <ChevronDown
        className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-primary" : "text-muted-foreground"}`}
      />
    </button>
    {isOpen && (
      <div className="px-4 pb-4 border-t border-border dark:border-neutral-800 pt-4 space-y-5">
        <ContentSection
          title={item.trackFocus.title}
          courses={item.trackFocus.courses}
          color="primary"
        />
        <ContentSection
          title={item.coreSubjects.title}
          courses={item.coreSubjects.courses}
          color="secondary"
        />
        {item.special && (
          <div className="bg-primary/10 border border-primary/20 p-3 rounded-lg flex items-start gap-2.5">
            <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
            <p className="text-foreground dark:text-neutral-100 text-xs font-bold">
              {item.special}
            </p>
          </div>
        )}
      </div>
    )}
  </div>
);

export const BCASyllabus = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const current = syllabusData[activeIndex];

  return (
    <section
      id="syllabus"
      className="py-12 md:py-20 bg-background dark:bg-neutral-950 w-full"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12 max-w-3xl mx-auto">
          <span className="text-primary font-bold tracking-widest uppercase text-xs sm:text-sm mb-3 block">
            Curriculum
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-extrabold tracking-tight dark:text-neutral-50">
            BCA with Full-Stack Development.{" "}
            <span className="text-primary italic">
              Here's Exactly What You Learn
            </span>
          </h2>
          <p className="text-muted-foreground dark:text-neutral-400 text-sm md:text-base leading-relaxed mt-4">
            Each semester combines MERN stack development training with BCA
            academic subjects. This is the actual curriculum students follow.
          </p>
          <p className="text-xs font-bold text-primary mt-2 sm:mt-3">
            Daily Full-Stack Development training alongside BCA academic
            subjects
          </p>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden space-y-3">
          {syllabusData.map((item, i) => (
            <MobileSection
              key={i}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:grid lg:grid-cols-[280px_1fr] gap-6 max-w-5xl mx-auto">
          {/* Sidebar */}
          <div className="bg-card dark:bg-neutral-900/50 p-5 rounded-2xl border border-border dark:border-neutral-800 flex flex-col">
            <h3 className="text-base font-bold mb-4 pb-3 border-b border-border dark:border-neutral-800 flex items-center gap-2.5 text-foreground dark:text-neutral-50">
              <BookOpen size={18} className="text-primary" />
              Full Stack Dev
            </h3>
            <div className="space-y-2 flex-1">
              {syllabusData.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-full p-4 rounded-xl transition-all border flex justify-between items-center text-left ${
                    activeIndex === i
                      ? "bg-primary/15 border-primary/40 shadow-sm"
                      : "bg-transparent border-transparent hover:bg-muted/50 dark:hover:bg-neutral-800/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${activeIndex === i ? "bg-primary" : "bg-border"}`}
                    />
                    <div>
                      <span
                        className={`text-sm font-bold block ${activeIndex === i ? "text-primary" : "text-foreground"}`}
                      >
                        {item.semester}
                      </span>
                      {item.special && (
                        <span className="text-[10px] font-bold text-primary uppercase">
                          Industry Integrated
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="bg-card dark:bg-neutral-900/50 rounded-2xl border border-border dark:border-neutral-800 p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border dark:border-neutral-800">
              <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center text-primary shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <h2 className="text-xl font-serif font-bold text-foreground dark:text-neutral-50">
                {current.semester}
              </h2>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto">
              <ContentSection
                title={current.trackFocus.title}
                courses={current.trackFocus.courses}
                color="primary"
              />
              <div className="border-t border-border dark:border-neutral-800 pt-6">
                <ContentSection
                  title={current.coreSubjects.title}
                  courses={current.coreSubjects.courses}
                  color="secondary"
                />
              </div>
              {current.special && (
                <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="text-primary mt-0.5 shrink-0"
                  />
                  <p className="text-foreground dark:text-neutral-100 text-sm font-bold">
                    {current.special}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
