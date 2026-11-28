"use client";

import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const admissionSteps = [
  {
    number: "01",
    accentColor: "#F5A623",
    borderColor: "border-[#F5A623]",
    title: "Apply on website",
    desc: "Fill up the application form and get your process started.",
    illustration: "/images/campaign-dgm/admission/step-1-apply.png",
  },
  {
    number: "02",
    accentColor: "#00B4D8",
    borderColor: "border-[#00B4D8]",
    title: "Take the Screening Test",
    desc: "Watch marketing concepts that we share and apply them on an Ad. You get 3 attempts.If you give the first attempt within 3 days, you will also be evaluated for the scholarship of ₹30,000.",
    illustration: "/images/campaign-dgm/admission/step-2-test.png",
  },
  {
    number: "03",
    accentColor: "#20B2AA",
    borderColor: "border-[#20B2AA]",
    title: "Talk to your counselor",
    desc: "A counselor will get in touch to understand your goals and help you with your results.",
    illustration: "/images/campaign-dgm/admission/step-3-counselor.png",
  },
  {
    number: "04",
    accentColor: "#E07A5F",
    borderColor: "border-[#E07A5F]",
    title: "Enroll and start your journey",
    desc: "If accepted, you can complete the payment formalities and get started with the program",
    extra: "Welcome to the ride!",
    illustration: "/images/campaign-dgm/admission/step-4-enroll.png",
  },
];

const whoShouldJoin = [
  {
    title: "Education",
    accentColor: "#F5A623",
    borderColor: "border-[#F5A623]",
    desc: "We encourage students from all educational fields to apply",
    illustration: "/images/campaign-dgm/admission/who-1-education.png",
  },
  {
    title: "Experience",
    accentColor: "#00B4D8",
    borderColor: "border-[#00B4D8]",
    desc: "Freshers and working professionals can apply",
    illustration: "/images/campaign-dgm/admission/who-2-experience.png",
  },
  {
    title: "Intent",
    accentColor: "#20B2AA",
    borderColor: "border-[#20B2AA]",
    desc: "Deep interest & intent in building a marketing career",
    illustration: "/images/campaign-dgm/admission/who-3-intent.png",
  },
];

export default function AdmissionProcessSection({ id = "admissions" }) {
  const scrollToApply = () => {
    const el = document.getElementById("application-form") || document.getElementById("hero-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section
      id={id}
      className="relative w-full bg-white py-16 sm:py-24 text-gray-900 overflow-hidden scroll-mt-20 lg:scroll-mt-24 border-t border-gray-100"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ─── PART 1: ADMISSION PROCESS HEADER ─── */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-gray-800">
            Admission Process
          </h2>

          <div className="relative mx-auto mt-2 h-[7px] w-[150px] sm:w-[190px]">
            <img
              src="/bottom-line.png"
              alt="underline"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="mt-5 text-center max-w-3xl mx-auto space-y-1">
            <p className="text-sm sm:text-base text-gray-600 font-normal leading-relaxed">
              The programs help you graduate with a job and not just a certificate.
            </p>
            <p className="text-sm sm:text-base text-gray-600 font-normal leading-relaxed">
              Thus, the screening process is a mandatory step to ensure we enroll folks who can derive value from the program.
            </p>
          </div>
        </div>

        {/* ─── 4 ADMISSION PROCESS CARDS WITH CONNECTING LINE ─── */}
        <div className="relative mt-12 sm:mt-16">
          {/* Dashed Connecting Line behind cards on desktop */}
          <div className="hidden lg:block absolute top-[50%] left-[8%] right-[8%] h-[2px] border-t-2 border-dashed border-gray-300 z-0 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
            {admissionSteps.map((step) => (
              <div
                key={step.number}
                className={`group relative flex flex-col justify-between rounded-[26px] border-2 ${step.borderColor} bg-white p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 min-h-[340px] sm:min-h-[370px]`}
              >
                <div>
                  {/* Top: Title & Stylized Number */}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[17px] sm:text-lg font-bold text-gray-800 leading-snug">
                      {step.title}
                    </h3>
                    <span
                      className="shrink-0 font-serif italic font-bold text-2xl sm:text-3xl select-none"
                      style={{ color: step.accentColor }}
                    >
                      {step.number}
                    </span>
                  </div>

                  {/* Body description */}
                  <div className="mt-3 text-xs sm:text-[13px] text-gray-600 leading-relaxed">
                    <p>{step.desc}</p>
                    {step.extra && (
                      <p className="font-bold text-gray-800 mt-2.5">
                        {step.extra}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Line-Art Sketch Illustration */}
                <div className="mt-6 pt-3 flex items-center justify-center">
                  <img
                    src={step.illustration}
                    alt={step.title}
                    className="h-16 sm:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── PART 2: WHO SHOULD JOIN SKILLYARDS SECTION ─── */}
        <div className="mt-20 sm:mt-28 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-extrabold tracking-tight text-gray-800">
            Who Should Join <span className="text-[#183D71]">Skill</span><span className="text-[#1E7CBC]">Yards</span> Digital Marketing Course in India
          </h2>

          <div className="relative mx-auto mt-2 h-[7px] w-[200px] sm:w-[280px]">
            <img
              src="/bottom-line.png"
              alt="underline"
              className="w-full h-full object-contain"
            />
          </div>

          {/* 3 Centered Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-10 sm:mt-14">
            {whoShouldJoin.map((item) => (
              <div
                key={item.title}
                className={`group relative flex flex-col justify-between items-center text-center rounded-[26px] border-2 ${item.borderColor} bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 min-h-[220px] sm:min-h-[250px]`}
              >
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-800">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-[13px] text-gray-600 leading-relaxed max-w-[220px] mx-auto">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Line-Art Sketch Illustration */}
                <div className="mt-6 flex items-center justify-center">
                  <img
                    src={item.illustration}
                    alt={item.title}
                    className="h-14 sm:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Direct CTA Action Button */}
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={scrollToApply}
              className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-[#1E7CBC] hover:bg-[#183D71] text-white font-bold px-8 py-3.5 text-sm sm:text-base shadow-lg shadow-[#1E7CBC]/25 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
            >
              Start Your Admission Process Now
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
