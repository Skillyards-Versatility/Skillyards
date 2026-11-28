"use client";

import React from "react";
import Image from "next/image";
import { Linkedin } from "lucide-react";
import { dgmEducators } from "@/data/teamData";

export default function ExpertsSection({ id = "experts", educators = [] }) {
  const displayEducators =
    Array.isArray(educators) && educators.length > 0 ? educators : dgmEducators;

  return (
    <section
      id={id}
      className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white py-16 md:py-[15vh] scroll-mt-20 lg:scroll-mt-24"
    >
      {/* Subtle background glow */}
      <div className="absolute bottom-0 left-0 w-87.5 md:w-125 h-87.5 md:h-125 bg-blue-100/30 rounded-full blur-[80px] md:blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <span className="text-[#1E7CBC] font-bold tracking-widest uppercase text-xs sm:text-sm mb-3 sm:mb-4 block">
            MEET YOUR MENTORS
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-extrabold mb-4 sm:mb-6 tracking-tight text-gray-900">
            Learn from Those Who <span className="text-[#1E7CBC] italic">Do.</span>
          </h2>
          <p className="text-gray-600 text-sm md:text-base lg:text-lg leading-relaxed">
            Learn from professionals who bring real-world marketing experience
            into the classroom, bridging the gap between learning and industry
            execution.
          </p>
        </div>

        <div className="grid max-w-4xl mx-auto grid-cols-1 justify-center gap-5 md:grid-cols-2 md:gap-8">
          {displayEducators.map((edu, index) => (
            <div
              key={index}
              className="group relative mx-auto w-full max-w-sm"
            >
              <div className="relative mb-5 aspect-[4/5] overflow-hidden rounded-[2rem] border-4 border-gray-200 shadow-2xl transition-all duration-500 group-hover:rounded-[1.75rem] md:mb-8 md:rounded-[3.5rem] md:group-hover:rounded-[2.5rem]">
                <Image
                  src={edu.image}
                  alt={edu.name}
                  fill
                  className={`object-cover group-hover:scale-110 transition-transform duration-700 ${edu.imageClassName || "object-top"}`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-[#1E7CBC]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-3 md:gap-4 backdrop-blur-xs">
                  <a
                    href={edu?.socials?.linkedin || "#"}
                    target={edu?.socials?.linkedin ? "_blank" : "_self"}
                    rel={edu?.socials?.linkedin ? "noopener noreferrer" : ""}
                    className="w-10 h-10 md:w-12 md:h-12 bg-white text-[#1E7CBC] rounded-full flex items-center justify-center shadow-xl hover:bg-[#1E7CBC] hover:text-white transition-all hover:scale-110 active:scale-95"
                  >
                    <Linkedin size={18} />
                  </a>
                </div>
              </div>

              <div className="px-1 text-center md:px-4">
                <h3 className="mb-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-[#1E7CBC] md:text-xl lg:text-2xl">
                  {edu.name}
                </h3>
                <div className="mb-2 inline-block rounded-full bg-[#1E7CBC]/10 px-3 py-1 text-xs font-bold text-[#1E7CBC] md:mb-3 md:px-4 md:text-sm">
                  {edu.role}
                </div>
                <p className="text-gray-600 text-xs md:text-sm font-medium leading-relaxed italic">
                  {edu.specialization || "Marketing Expert"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
