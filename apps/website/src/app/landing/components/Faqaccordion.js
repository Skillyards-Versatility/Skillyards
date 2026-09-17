"use client";

import { useState } from "react";
import Link from "next/link";

const FAQS = [
  {
    question: "Which is the best digital marketing institute in Agra?",
    answer:
      "Choosing an institute in Agra comes down to whether you learn on live accounts or only from slides. At SkillYards, digital marketing students work on real SEO, Google Ads, Meta Ads and GA4 campaigns from early in the program. We run a DBRAU-affiliated BBA Digital Marketing On-Job Degree, a shorter On-Job Training program, and free AI bootcamps, so you can choose based on your schedule. Visit our Agra campus near Bhagwan Talkies Crossing and sit in on a session before deciding.",
  },
  {
    question: "Is SkillYards a good institute for BBA and BCA in Agra?",
    answer:
      "Our BBA and BCA programs are affiliated to Dr. Bhimrao Ambedkar University, Agra, so the degree carries the same recognition as any DBRAU-affiliated college. What differs is the structure: the On-Job Degree model puts live project work alongside your semesters from year one. Students in the BBA track run real campaigns; BCA students build and deploy real applications. The best way to judge is to visit: tour the dev lab and talk to our current students.",
  },
  {
    question: "Where is SkillYards located in Agra and how do I reach it?",
    answer:
      "Our campus is at A-3, behind Manoj Dhaba, Bhagwan Talkies crossing, Indra Puri, New Agra Colony, Agra, Uttar Pradesh 282005, near Bhagwan Talkies Crossing. Students commute daily from Sikandra, Kamla Nagar, Shahganj, Tajganj and Bichpuri, and we have on-site parking for two-wheelers and cars. We're open from 9:00 AM - 8:00 PM Monday to Saturday. Call 070601 00562 or get directions on Google Maps.",
  },
  {
    question: "Do you offer full-stack development courses near me in Agra?",
    answer:
      "Yes. We run full-stack training at our Agra campus near Bhagwan Talkies Crossing, covering React, Next.js, Node.js, MongoDB, Git and deployment. You can take it as a 3-year DBRAU-affiliated BCA Full Stack On-Job Degree, or as a shorter 7 to 9 month On-Job Training program if you already have a degree.",
  },

  {
    question: "Can I do BBA with digital marketing in Agra?",
    answer:
      "Yes. Our BBA Digital Marketing On-Job Degree is a 3-year, 6-semester program affiliated to DBRAU, Agra. Alongside your BBA subjects you work on SEO, paid ads, social media and analytics using live accounts, ensuring you graduate with both a degree and a portfolio.",
  },
  {
    question: "Can I do BCA with full-stack development in Agra?",
    answer:
      "Yes. Our BCA Full Stack On-Job Degree is a 3-year, 6-semester DBRAU-affiliated program. You cover the BCA syllabus while building real applications with React, Next.js, Node.js and MongoDB in our dev lab.",
  },
  {
    question: "What is the On Job Degree (OJD) program?",
    answer:
      "The On-Job Degree is a 3-year, DBRAU-affiliated BBA or BCA where classroom learning runs alongside live project work from year one, instead of a single internship at the end. You graduate with a recognised degree from Dr. Bhimrao Ambedkar University, Agra, plus a portfolio of real work.",
  },
  {
    question:
      "What's the difference between an On-Job Degree and a regular BBA or BCA?",
    answer:
      "The university syllabus and the degree are the same. The difference is what happens outside the syllabus. In a regular program, practical exposure usually means one internship in the final year. In an On-Job Degree, you work on live projects through all three years, ensuring you graduate with a verified portfolio rather than just a marksheet. It requires dedication, as coursework and real projects run side by side.",
  },
  {
    question: "What is On Job Training (OJT)?",
    answer:
      "On Job Training is a 7 to 9 month program where you learn full-stack development or digital marketing through live projects and real work experience. No prior degree is required; complete the training, build your portfolio, and get placement support.",
  },
  {
    question: "Should I choose digital marketing or full-stack development?",
    answer:
      "It depends on how you like to work. Digital marketing suits you if you enjoy strategy, writing, analysing numbers and seeing quick results, as campaigns show performance within days. Full-stack development suits you if you like building things, solving logical problems and working on something over weeks. Both have hiring demand in Agra, Noida and Delhi NCR. Our free counselling session exists exactly for this question. Walk in and our mentors will guide you through both tracks.",
  },
  {
    question: "Do I need a degree to join?",
    answer:
      "Not for every program. On-Job Training and our free Quick Skill bootcamps are open to graduates, working professionals and anyone who wants practical skills, with no prior degree required. The On-Job Degree requires 12th pass eligibility.",
  },
  {
    question: "Which technologies and tools do you train in?",
    answer:
      "Full-stack students work with React, Next.js, Node.js, MongoDB, Git and deployment tooling. Digital marketing students work with Google Ads, Meta Ads Manager, Google Analytics 4, Search Console, SEO tools and content platforms. Tools are taught on live projects, not demo accounts.",
  },
  {
    question: "Do you provide placement assistance?",
    answer:
      "We have a dedicated placement cell that supports students with resume building, mock interviews, portfolio reviews and interview opportunities with hiring companies. We do not promise guaranteed jobs; what we commit to is rigorous preparation, portfolio building, and direct hiring access.",
  },
  {
    question: "Do you offer free courses or AI bootcamps in Agra?",
    answer:
      "Yes. Our Quick Skill Programs are free AI-focused bootcamps open to students and working professionals in Agra. They're short, practical, and there's no fee. Seats are limited per batch, so ask about the next one when you call.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="bg-background py-16 sm:py-24 px-4 transition-colors duration-300">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
          Frequently Asked{" "}
          <span className="italic text-primary transition-colors duration-300">
            Questions
          </span>
        </h2>
        <p className="mt-3 text-muted-foreground text-base sm:text-lg transition-colors duration-300">
          Get answers about our programs, placements, fees, and how to get
          started.
        </p>

        <div className="mt-10 flex flex-col gap-4 text-left">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="bg-card border border-border text-card-foreground rounded-2xl px-5 py-4 sm:px-6 sm:py-5 transition-all duration-300 shadow-xs"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-start justify-between gap-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-foreground text-sm sm:text-base leading-snug transition-colors duration-300">
                    {faq.question}
                  </span>
                  <span
                    className={`relative flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                      isOpen
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/10 text-primary"
                    }`}
                    aria-hidden="true"
                  >
                    {/* horizontal bar - stays put, becomes the "minus" */}
                    <span className="absolute w-3 h-0.5 bg-current rounded-full transition-colors duration-300" />
                    {/* vertical bar - rotates 90deg onto the horizontal bar to "become" a minus, and back to reform the plus */}
                    <span
                      className={`absolute w-0.5 h-3 bg-current rounded-full transition-transform duration-300 ease-in-out ${
                        isOpen ? "rotate-90" : "rotate-0"
                      }`}
                    />
                  </span>
                </button>

                {isOpen && (
                  <p className="mt-3 text-muted-foreground text-sm leading-relaxed transition-colors duration-300">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-sm text-muted-foreground transition-colors duration-300">
          Need more answers?{" "}
          <Link
            href="/faqs"
            className="text-primary font-bold underline underline-offset-2 transition-colors duration-300"
          >
            View all FAQs
          </Link>
        </p>
      </div>
    </section>
  );
}
