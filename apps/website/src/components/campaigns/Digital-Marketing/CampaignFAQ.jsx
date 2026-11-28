"use client";

import { useState } from "react";
import { HelpCircle, Plus, Minus, CheckCircle2, MapPin, ArrowRight, ChevronDown } from "lucide-react";
import { getFaqAnchorId } from "@/lib/seo/faqUtils";

const campaignFaqs = [
  {
    id: "01",
    question: "01. Do I need any prior experience to join the digital marketing course?",
    answer:
      "No. Our program is designed for beginners as well as individuals looking to upgrade their existing skills. We start with the fundamentals and gradually move towards advanced digital marketing strategies, practical projects and AI-powered tools.",
  },
  {
    id: "02",
    question: "02. Who can join this digital marketing course?",
    answer:
      "Anyone who has completed Class 10 or above can join this program. It is suitable for 10th-pass and 12th-pass students, college students, graduates, working professionals, aspiring freelancers, business owners and individuals looking to switch careers. No prior technical knowledge or digital marketing experience is required.",
  },
  {
    id: "03",
    question: "03. What is the duration of the digital marketing course?",
    answer:
      "The program is structured over six months, combining classroom learning, hands-on training, practical projects, certification preparation and career development.",
  },
  {
    id: "04",
    question: "04. What are the fees for the digital marketing course?",
    answer:
      "Our digital marketing program starts from ₹5,500 per month. Flexible payment options are available to make professional training more accessible. Connect with our admission counsellor for the complete fee structure and payment plans.",
  },
  {
    id: "05",
    question: "05. Does SkillYards provide placement assistance?",
    answer:
      "Yes. We provide 100% placement assistance, including resume development, LinkedIn profile optimization, portfolio building, mock interviews, career counselling and relevant job referrals. Our goal is to help you become industry-ready and confidently pursue career opportunities.",
  },
  {
    id: "06",
    question: "06. What is the 80:20 learning model?",
    answer:
      "Our training follows an 80:20 learning model, where 80% of the focus is on practical execution and 20% on theoretical understanding. Instead of simply studying concepts, you apply them through hands-on assignments, marketing tools and practical projects.",
  },
  {
    id: "07",
    question: "07. Will I work on practical digital marketing projects?",
    answer:
      "Yes. You will work on 15+ practical projects covering graphic design, website development, e-commerce, paid advertising, SEO, social media marketing and marketing automation. These projects will help you develop a professional portfolio.",
  },
  {
    id: "08",
    question: "08. Which certifications can I earn during the program?",
    answer:
      "You will receive preparation guidance for 15+ industry certifications from platforms such as Google, Meta, Microsoft, Semrush and HubSpot, along with the SkillYards program completion certificate. Third-party certifications are subject to the respective platform's assessment and eligibility requirements.",
  },
  {
    id: "09",
    question: "09. How is AI integrated into the digital marketing course?",
    answer:
      "AI is integrated throughout our curriculum rather than taught as just a separate topic. You will explore AI-powered content creation, advertising strategies, SEO optimization, website development, prompt engineering, marketing automation and AI agents.",
  },
  {
    id: "10",
    question: "10. What career opportunities can I pursue after completing the course?",
    answerIntro: "Depending on your skills, portfolio and interests, you can pursue roles such as:",
    roles: [
      "Digital Marketing Executive",
      "SEO Executive",
      "PPC Specialist",
      "Performance Marketing Executive",
      "Social Media Manager",
      "Content Marketing Executive",
      "E-Commerce Executive",
      "Marketing Automation Executive",
    ],
    answerOutro: "You can also explore freelancing, consulting and entrepreneurship.",
  },
  {
    id: "11",
    question: "11. Can I learn digital marketing without coding knowledge?",
    answer:
      "Absolutely. You do not need a programming background to join the program. Website development and marketing automation are introduced through beginner-friendly, no-code and low-code tools.",
  },
  {
    id: "12",
    question: "12. Can I start freelancing or my own business after completing the course?",
    answer:
      "Yes. The program covers skills that can help you pursue freelancing, build an online store, offer digital marketing services or promote your own business. Your results will depend on your expertise, execution and business strategy.",
  },
  {
    id: "13",
    question: "13. Is the digital marketing course online or offline?",
    answer:
      "Our program is conducted through offline classroom training at our Agra campus. With a maximum of 20 students per batch, we focus on direct mentor interaction, personalized guidance and collaborative learning.",
  },
  {
    id: "14",
    question: "14. Where is SkillYards located in Agra?",
    address:
      "SkillYards is located at A-3, behind Manoj Dhaba, Bhagwan Talkies Crossing, Indra Puri, New Agra Colony, Agra, Uttar Pradesh – 282005.",
    visitNote:
      "You can visit our campus to meet the team, explore the learning environment and attend a free demo class.",
  },
  {
    id: "15",
    question: "15. Can I attend a free demo class before enrolling?",
    answer:
      "Yes. We encourage you to experience our teaching methodology, interact with mentors and understand the learning environment before making a decision. Book your free demo class with no payment or admission commitment.",
  },
];

export default function CampaignFAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const visibleFaqs = showAllFaqs ? campaignFaqs : campaignFaqs.slice(0, 5);

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24 font-sans text-gray-900 border-t border-gray-100">
      {/* Background Soft Glow */}
      <div className="pointer-events-none absolute right-0 top-0 h-[450px] w-[450px] -translate-y-1/2 translate-x-1/2 rounded-full bg-[#1E7CBC]/5 blur-[120px]" />
      <div className="pointer-events-none absolute left-0 bottom-0 h-[450px] w-[450px] translate-y-1/2 -translate-x-1/2 rounded-full bg-blue-500/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 sm:mb-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1E7CBC]/30 bg-[#1E7CBC]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#1E7CBC] mb-4">
            <HelpCircle className="h-3.5 w-3.5 text-[#1E7CBC]" />
            <span>STILL HAVE QUESTIONS?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-gray-900 leading-tight">
            Frequently Asked Questions
          </h2>

          <p className="mt-3.5 sm:mt-4 text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know before starting your digital marketing journey with SkillYards.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="relative">
          <div className="space-y-3 sm:space-y-3.5">
            {visibleFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              const anchorId = getFaqAnchorId({ question: faq.question });

              return (
                <div
                  key={faq.id}
                  id={anchorId}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "border-[#1E7CBC]/40 bg-[#f7faff] shadow-md shadow-[#1E7CBC]/5"
                      : "border-gray-200/80 bg-white hover:border-gray-300 hover:bg-gray-50/50 shadow-2xs"
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`campaign-faq-panel-${idx}`}
                      id={`campaign-faq-trigger-${idx}`}
                      onClick={() => toggleAccordion(idx)}
                      className="flex w-full items-center justify-between gap-4 p-4.5 sm:p-5 text-left transition-colors cursor-pointer select-none"
                    >
                      <span
                        className={`text-sm sm:text-base font-bold leading-snug transition-colors pr-2 ${
                          isOpen ? "text-[#1E7CBC]" : "text-gray-900"
                        }`}
                      >
                        {faq.question}
                      </span>
                      <span
                        className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
                          isOpen
                            ? "bg-[#1E7CBC] text-white rotate-180"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {isOpen ? (
                          <Minus className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </span>
                    </button>
                  </h3>

                  <div
                    id={`campaign-faq-panel-${idx}`}
                    role="region"
                    aria-labelledby={`campaign-faq-trigger-${idx}`}
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-4.5 pb-5 sm:px-5 sm:pb-6 text-sm sm:text-[15px] leading-relaxed text-gray-600 border-t border-gray-100/90 pt-3.5">
                        {/* Special format for Q10 (Career opportunities list) */}
                        {faq.roles ? (
                          <div className="space-y-3">
                            <p>{faq.answerIntro}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2 py-1">
                              {faq.roles.map((role, rIdx) => (
                                <div
                                  key={rIdx}
                                  className="flex items-center gap-2 rounded-lg bg-white border border-gray-200/80 px-3 py-2 text-xs sm:text-sm font-semibold text-gray-800 shadow-2xs"
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1E7CBC] shrink-0" />
                                  <span>{role}</span>
                                </div>
                              ))}
                            </div>
                            <p>{faq.answerOutro}</p>
                          </div>
                        ) : faq.address ? (
                          /* Special format for Q14 (Address & Visit Note) */
                          <div className="space-y-2.5">
                            <div className="flex items-start gap-2.5 rounded-xl bg-white border border-gray-200/80 p-3.5 shadow-2xs">
                              <MapPin className="h-5 w-5 text-[#1E7CBC] shrink-0 mt-0.5" />
                              <p className="font-medium text-gray-800">{faq.address}</p>
                            </div>
                            <p>{faq.visitNote}</p>
                          </div>
                        ) : (
                          /* Standard Answer */
                          <p>{faq.answer}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subtle Gradient Fade Overlay when collapsed */}
          {!showAllFaqs && (
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent" />
          )}
        </div>

        {/* Show More / View All Button */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAllFaqs(!showAllFaqs)}
            className="inline-flex items-center gap-2.5 rounded-full border border-[#1E7CBC] bg-white px-7 py-3 text-sm sm:text-base font-bold text-[#1E7CBC] shadow-sm transition-all duration-200 hover:bg-[#1E7CBC] hover:text-white hover:shadow-md active:scale-98 cursor-pointer"
          >
            <span>
              {showAllFaqs
                ? "Show Less"
                : `Click to view all (${campaignFaqs.length} FAQs)`}
            </span>
            <ChevronDown
              className={`h-4.5 w-4.5 transition-transform duration-300 ${
                showAllFaqs ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Bottom Call to Action Card */}
        <div className="mt-12 sm:mt-16 rounded-3xl border border-[#1E7CBC]/20 bg-gradient-to-br from-[#f0f7fd] to-white p-6 sm:p-8 text-center shadow-xs">
          <h4 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
            Still Have Questions About the Program?
          </h4>
          <p className="mt-2 text-sm text-gray-600 max-w-xl mx-auto">
            Speak directly with our academic mentors or visit our campus for a personalized counselling session.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#application-form"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1E7CBC] hover:bg-[#166091] text-white font-bold px-6 py-3 text-xs sm:text-sm shadow-md shadow-[#1E7CBC]/25 transition duration-200 hover:-translate-y-0.5"
            >
              <span>Book Your Free Demo Class</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <p className="mt-3 text-xs text-gray-500 font-medium">
            No Payment. No Admission Commitment.
          </p>
        </div>
      </div>
    </section>
  );
}
