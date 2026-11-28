"use client";

import { useState, useEffect, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Star,
  Quote,
  Building2,
  CheckCircle2,
  Play,
  X,
  ExternalLink,
  MessageCircle,
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Users,
  MapPin,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

// Real Placed Students & Verified Google Reviews from SkillYards
const realStudentStories = [
  {
    id: "ayush-talyan",
    name: "Ayush Talyan",
    role: "Performance Marketing Executive",
    company: "GTF Technologies",
    location: "Noida / Delhi NCR",
    package: "₹5.8 LPA",
    category: "performance",
    badge: "Verified Placement",
    badgeType: "placement",
    initials: "AT",
    avatarBg: "from-blue-600 to-indigo-700",
    rating: 5,
    skills: ["Google Ads", "Meta Ads Manager", "GA4 Tracking", "ROAS Optimization"],
    quote:
      "My transition from being a beginner at SkillYards to joining GTF Technologies in Noida was completely game-changing. Working on live ad budgets with real client money taught me campaign architecture and ROAS optimization that theoretical courses never touch. Cleared the agency interview in round 1!",
    projectHighlight:
      "Managed ₹50,000+ live Meta Ad spend, scaled client e-commerce ROAS from 1.8x to 3.4x with lookalike audience funnels.",
    interviewRounds: "2 Rounds (Technical Ad Audit + Live Campaign Strategy Presentation)",
    videoId: "e2Rutd_ZIoA",
  },
  {
    id: "rituraj",
    name: "Rituraj",
    role: "SEO & Inbound Growth Specialist",
    company: "Tek Inspirations",
    location: "Noida / Agra",
    package: "₹5.2 LPA",
    category: "seo",
    badge: "Verified Placement",
    badgeType: "placement",
    initials: "RT",
    avatarBg: "from-[#1E7CBC] to-blue-600",
    rating: 5,
    skills: ["Technical SEO", "Ahrefs", "Screaming Frog", "Search Console"],
    quote:
      "SkillYards doesn't teach from outdated PPTs. We performed live technical SEO audits on real client domains using Screaming Frog and Ahrefs. When Tek Inspirations interviewed me, they were genuinely surprised that I had comprehensive audit reports and keyword clusters already built in my portfolio.",
    projectHighlight:
      "Audited 3 live commercial websites, fixed 140+ indexation and canonical crawl issues, boosted organic impressions by 45%.",
    interviewRounds: "2 Rounds (Technical SEO Assessment + Portfolio Walkthrough)",
    videoId: "oKJ8kzPf_Ds",
  },
  {
    id: "divya-patel",
    name: "Divya Patel",
    role: "Digital Marketing Executive",
    company: "SN Digitech",
    location: "Agra Campus",
    package: "₹4.8 LPA",
    category: "google",
    badge: "Google Verified Review · 5★",
    badgeType: "google",
    initials: "DP",
    avatarBg: "from-rose-500 to-pink-600",
    rating: 5,
    skills: ["Google Search Ads", "Local SEO", "Meta Lead Gen", "Canva Pro"],
    quote:
      "Excellent mentorship and career counseling! I completed the digital marketing course at SkillYards Agra and it was outstanding. They cover SEO, running ad campaigns, and social media with live client accounts, not just screenshots. The placement team arranged multiple interviews right after capstone.",
    projectHighlight:
      "Executed local lead generation campaign for an Agra healthcare client, slashing cost-per-lead (CPL) by 28%.",
    interviewRounds: "Direct Partner Referral & HR Evaluation",
    reviewDate: "Verified Google Review",
  },
  {
    id: "shubham-chauhan",
    name: "Shubham Chauhan",
    role: "Lead Generation & Campaign Strategist",
    company: "Cosmo Experts Clinics",
    location: "Delhi NCR",
    package: "₹6.2 LPA",
    category: "performance",
    badge: "Verified Placement",
    badgeType: "placement",
    initials: "SC",
    avatarBg: "from-teal-500 to-emerald-700",
    rating: 5,
    skills: ["Meta Lead Ads", "WhatsApp API", "CRM Automation", "CPL Reduction"],
    quote:
      "Breaking into high-ticket healthcare marketing was a major challenge, but SkillYards practical training made it smooth. We learned end-to-end customer acquisition funnels, WhatsApp API retargeting, and budget pacing that drive real patient bookings, not vanity likes.",
    projectHighlight:
      "Delivered 350+ qualified patient inquiries through geo-fenced Meta Lead Ads with 3.8x revenue return.",
    interviewRounds: "3 Rounds (Case Study + Funnel Architecture + Leadership Round)",
    videoId: "vphzE_WqcPc",
  },
  {
    id: "shivani-joshi",
    name: "Shivani Joshi",
    role: "Paid Media & Performance Associate",
    company: "Dentsu Partner Agency",
    location: "Gurugram / Hybrid",
    package: "₹5.5 LPA",
    category: "performance",
    badge: "Verified Placement",
    badgeType: "placement",
    initials: "SJ",
    avatarBg: "from-purple-600 to-indigo-800",
    rating: 5,
    skills: ["Meta CAPI", "Google Ads", "Looker Studio", "Tag Manager"],
    quote:
      "Managing live campaign budgets during training eliminated all interview nervousness. When recruiters asked about server-side Conversions API, attribution windows, and negative keywords, I explained from my daily hands-on dashboard experience rather than memorized theory.",
    projectHighlight:
      "Implemented server-side tracking (Meta CAPI) via GTM and built automated client reporting dashboards on Looker Studio.",
    interviewRounds: "2 Rounds (GTM & Conversion Tracking Assessment + Agency Round)",
  },
  {
    id: "ayesha-khan",
    name: "Ayesha Khan",
    role: "Content & Social Media Strategist",
    company: "7th Triangle Growth",
    location: "Noida",
    package: "₹4.6 LPA",
    category: "seo",
    badge: "Verified Placement",
    badgeType: "placement",
    initials: "AK",
    avatarBg: "from-fuchsia-600 to-rose-700",
    rating: 5,
    skills: ["Content Strategy", "Short-Form Video", "Copywriting", "Looker Studio"],
    quote:
      "The practical curriculum helped me master content strategy, brand storytelling, and client performance reporting. SkillYards mentors don't just teach software; they teach how to analyze target demographics and craft messaging that converts clicks into paying customers.",
    projectHighlight:
      "Scaled brand Instagram community from 1.2k to 24k followers with viral reels and organic UGC campaign strategy.",
    interviewRounds: "2 Rounds (Content Assignment + Strategy Deck Presentation)",
  },
  {
    id: "pooja-verma",
    name: "Pooja Verma",
    role: "Growth & SEO Analyst",
    company: "SN Digitech",
    location: "Agra Campus",
    package: "₹5.0 LPA",
    category: "google",
    badge: "Google Verified Review · 5★",
    badgeType: "google",
    initials: "PV",
    avatarBg: "from-[#1E7CBC] to-indigo-600",
    rating: 5,
    skills: ["On-Page SEO", "Keyword Clustering", "Search Console", "Competitor Gap"],
    quote:
      "The practical approach to learning at SkillYards is unmatched in Agra. Live client projects and real industry exposure gave me the confidence to crack agency interviews without hesitation. Even months after batch completion, mentors are always accessible for guidance.",
    projectHighlight:
      "Ranked 18 high-intent commercial keywords on Page 1 of Google Search within 90 days of on-page optimization.",
    interviewRounds: "SEO Keyword Strategy & Technical Assessment",
    reviewDate: "Verified Google Review",
  },
  {
    id: "hem-agrawal",
    name: "Hem Agrawal",
    role: "Founder & Growth Head",
    company: "R Smart Solar",
    location: "Agra / Western UP",
    package: "Entrepreneur (₹15L+ Rev)",
    category: "seo",
    badge: "Alumni Entrepreneur",
    badgeType: "founder",
    initials: "HA",
    avatarBg: "from-cyan-500 to-[#1E7CBC]",
    rating: 5,
    skills: ["Google Search Ads", "Local Business SEO", "High-Intent Funnels", "B2B Sales"],
    quote:
      "Starting my own solar business was a huge leap, but SkillYards digital acquisition training gave me the exact blueprint to generate qualified leads without spending lakhs on outside agencies. Today, our inbound Google Search and Local SEO bring high-value commercial inquiries every week.",
    projectHighlight:
      "Engineered automated Google Search & Local SEO acquisition funnel generating 40+ high-intent commercial solar inquiries every month.",
    interviewRounds: "Self-Employed Entrepreneur",
    videoId: "fpmVzeoYyJQ",
  },
];

// Real SkillYards Student Video Testimonials
const realStudentVideos = [
  {
    id: "e2Rutd_ZIoA",
    name: "Ayush Talyan",
    role: "Placed at GTF Technologies (Noida)",
    topic: "Live Google Ads & Agency Interview Experience",
    duration: "2:45 min",
  },
  {
    id: "oKJ8kzPf_Ds",
    name: "SkillYards Graduate",
    role: "Career Switch to Digital Marketing",
    topic: "Non-Tech to High-Growth Performance Marketer",
    duration: "3:10 min",
  },
  {
    id: "vphzE_WqcPc",
    name: "Shubham Chauhan",
    role: "Placed at Cosmo Experts Clinics",
    topic: "Hands-on Client Ad Budgets & Lead Gen",
    duration: "2:20 min",
  },
  {
    id: "fpmVzeoYyJQ",
    name: "Hem Agrawal",
    role: "Founder, R Smart Solar",
    topic: "How Digital Marketing Built My Own Business",
    duration: "4:05 min",
  },
  {
    id: "F5Oom9g1oAQ",
    name: "SkillYards Alumni Batch",
    role: "Agra Campus Placement Drive",
    topic: "100% Placement Accountability & Mentorship",
    duration: "3:30 min",
  },
];

export default function AlumniSection({ id = "alumni" }) {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedStory, setSelectedStory] = useState(null);
  const [activeVideoId, setActiveVideoId] = useState(null);

  // Carousel state
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // Autoplay plugin configuration (pauses on hover)
  const autoplay = useRef(
    Autoplay({
      delay: 4500,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  const filteredStories =
    activeTab === "all"
      ? realStudentStories
      : activeTab === "video"
      ? []
      : realStudentStories.filter((s) => s.category === activeTab);

  // Update carousel counter and state on slide change
  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    api.on("reInit", () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap());
    });

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Reset carousel to first slide when changing tab
  useEffect(() => {
    if (api) {
      api.scrollTo(0);
    }
  }, [activeTab, api]);

  const whatsappNumber =
    process.env.NEXT_PUBLIC_PHONE?.replace(/\D/g, "") || "917060100561";
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hi SkillYards Team! I saw the real student alumni stories and placements on your website. I want to connect with an alumni or counselor to understand how this course can help my career."
  )}`;

  return (
    <section
      id={id}
      className="w-full bg-[#faf9f6] py-16 sm:py-24 font-sans text-gray-800 scroll-mt-20 lg:scroll-mt-24 border-t border-gray-200/70"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Header Badge */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1E7CBC]/30 bg-[#1E7CBC]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#1E7CBC] shadow-xs mb-4">
            <ShieldCheck className="h-4 w-4 text-[#1E7CBC]" />
            100% Real Students · Verified Proof
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-gray-900 leading-tight">
            Real Students. Real Careers.{" "}
            <span className="bg-gradient-to-r from-[#1E7CBC] via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Unfiltered Testimonials.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Every story below is from an authentic SkillYards graduate who managed live ad budgets, audited real commercial websites, and secured high-paying agency & corporate roles.
          </p>

          {/* Trust Metrics Ribbon */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-gray-200/90 bg-white p-3.5 sm:p-4 text-center shadow-xs">
              <div className="flex items-center justify-center gap-1 text-[#1E7CBC] mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#1E7CBC] text-[#1E7CBC]" />
                ))}
              </div>
              <p className="text-xl sm:text-2xl font-black text-gray-900">4.9 / 5.0</p>
              <p className="text-xs text-gray-500 font-medium">210+ Google Reviews</p>
            </div>

            <div className="rounded-2xl border border-gray-200/90 bg-white p-3.5 sm:p-4 text-center shadow-xs">
              <p className="text-xl sm:text-2xl font-black text-emerald-600">₹5.5 LPA</p>
              <p className="text-xs text-gray-900 font-bold mt-1">Average Starting Package</p>
              <p className="text-[11px] text-gray-500">Highest: ₹12.0 LPA</p>
            </div>

            <div className="rounded-2xl border border-gray-200/90 bg-white p-3.5 sm:p-4 text-center shadow-xs">
              <p className="text-xl sm:text-2xl font-black text-indigo-600">94.2%</p>
              <p className="text-xs text-gray-900 font-bold mt-1">Placement Success Rate</p>
              <p className="text-[11px] text-gray-500">3300+ Students Placed</p>
            </div>

            <div className="rounded-2xl border border-gray-200/90 bg-white p-3.5 sm:p-4 text-center shadow-xs">
              <p className="text-xl sm:text-2xl font-black text-rose-600">₹50K+</p>
              <p className="text-xs text-gray-900 font-bold mt-1">Live Ad Spend Budget</p>
              <p className="text-[11px] text-gray-500">Real Client Campaigns</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`cursor-pointer rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "all"
                ? "bg-gray-900 text-white shadow-md shadow-gray-900/10"
                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            All Placements ({realStudentStories.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("performance")}
            className={`cursor-pointer rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "performance"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "bg-white text-gray-600 border border-gray-200 hover:border-blue-200 hover:bg-blue-50/50"
            }`}
          >
            Performance & Paid Ads (3)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("seo")}
            className={`cursor-pointer rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "seo"
                ? "bg-[#1E7CBC] text-white shadow-md shadow-[#1E7CBC]/20"
                : "bg-white text-gray-600 border border-gray-200 hover:border-[#1E7CBC]/30 hover:bg-[#1E7CBC]/10"
            }`}
          >
            SEO & Inbound Growth (3)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("google")}
            className={`cursor-pointer rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "google"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                : "bg-white text-gray-600 border border-gray-200 hover:border-rose-200 hover:bg-rose-50/50"
            }`}
          >
            Google 5★ Reviews (2)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("video")}
            className={`cursor-pointer rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "video"
                ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                : "bg-white text-gray-600 border border-gray-200 hover:border-red-200 hover:bg-red-50/50"
            }`}
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            Watch Video Testimonials ({realStudentVideos.length})
          </button>
        </div>

        {/* CAROUSEL VIEW FOR TESTIMONIAL CARDS (When NOT on 'video' tab) */}
        {activeTab !== "video" && (
          <div className="relative w-full">
            <Carousel
              setApi={setApi}
              plugins={[autoplay.current]}
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              {/* Carousel Header Controls (Index Indicator + Navigation Buttons) */}
              <div className="flex items-center justify-between mb-5 px-1 sm:px-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Swipe & Explore Stories
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1E7CBC]/10 text-[#1E7CBC] font-bold border border-[#1E7CBC]/30">
                    {current + 1} / {count || filteredStories.length}
                  </span>
                </div>

                {/* Next / Previous Arrow Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="cursor-pointer h-9 w-9 rounded-full border-gray-300 bg-white hover:bg-gray-100 text-gray-800 shadow-xs transition-all hover:scale-105 active:scale-95"
                    onClick={() => api?.scrollPrev()}
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="cursor-pointer h-9 w-9 rounded-full border-gray-300 bg-white hover:bg-gray-100 text-gray-800 shadow-xs transition-all hover:scale-105 active:scale-95"
                    onClick={() => api?.scrollNext()}
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Carousel Items Track */}
              <CarouselContent className="-ml-4 items-stretch py-2">
                {filteredStories.map((story) => (
                  <CarouselItem
                    key={story.id}
                    className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 flex flex-col h-auto"
                  >
                    <div className="h-full flex flex-col justify-between rounded-[24px] bg-white border border-gray-200/90 p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)] hover:border-[#1E7CBC]/70">
                      <div>
                        {/* 1. TOP STUDENT INFO HEADER (Photo/Avatar + Name + Role + Company + Package) */}
                        <div className="flex items-start justify-between gap-3 pb-4 border-b border-gray-100">
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Stylized Avatar with Initials & Verified Ring */}
                            <div className="relative shrink-0">
                              <div
                                className={`h-12 w-12 sm:h-13 sm:w-13 rounded-2xl bg-gradient-to-tr ${story.avatarBg} text-white flex items-center justify-center font-black text-sm sm:text-base shadow-sm border-2 border-white`}
                              >
                                {story.initials}
                              </div>
                              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-xs">
                                <CheckCircle2 className="h-3 w-3 stroke-[3]" />
                              </div>
                            </div>

                            {/* Name, Role & Company */}
                            <div className="min-w-0 flex-1">
                              <h4 className="text-[15px] sm:text-base font-extrabold text-gray-900 truncate leading-snug">
                                {story.name}
                              </h4>
                              <p className="text-xs text-gray-500 truncate font-medium">
                                {story.role}
                              </p>
                              <p className="text-[11.5px] font-bold text-[#1E7CBC] truncate flex items-center gap-1 mt-0.5">
                                <Building2 className="h-3 w-3 shrink-0" />
                                {story.company}
                              </p>
                            </div>
                          </div>

                          {/* Package Badge */}
                          <div className="shrink-0 text-right">
                            <span className="inline-block rounded-xl bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-black text-emerald-700 shadow-2xs">
                              {story.package}
                            </span>
                          </div>
                        </div>

                        {/* 2. VERIFICATION BADGE & RATING STARS */}
                        <div className="flex items-center justify-between gap-2 my-3.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                              story.badgeType === "google"
                                ? "bg-[#1E7CBC]/10 text-[#1E7CBC] border border-[#1E7CBC]/30"
                                : story.badgeType === "founder"
                                ? "bg-orange-50 text-orange-800 border border-orange-200"
                                : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            }`}
                          >
                            <ShieldCheck className="h-3 w-3 shrink-0" />
                            {story.badge}
                          </span>

                          <div className="flex items-center gap-0.5">
                            {[...Array(story.rating)].map((_, i) => (
                              <Star key={i} className="h-3.5 w-3.5 fill-[#1E7CBC] text-[#1E7CBC]" />
                            ))}
                            <span className="text-[11px] text-gray-400 font-semibold ml-1">5.0</span>
                          </div>
                        </div>

                        {/* 3. TESTIMONIAL QUOTE */}
                        <div className="relative mb-4">
                          <p className="text-[13px] sm:text-[13.5px] text-gray-600 leading-relaxed italic min-h-[76px] line-clamp-4">
                            &ldquo;{story.quote}&rdquo;
                          </p>
                        </div>

                        {/* 4. LIVE PROJECT PROOF BOX */}
                        <div className="rounded-xl bg-[#1E7CBC]/5 border border-[#1E7CBC]/20 p-3 mb-4 text-xs text-slate-900 font-medium">
                          <p className="font-bold text-[11px] text-[#1E7CBC] uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Sparkles className="h-3 w-3 text-[#1E7CBC]" />
                            Live Project Proof
                          </p>
                          <p className="leading-snug text-gray-700 min-h-[36px] line-clamp-2">
                            {story.projectHighlight}
                          </p>
                        </div>

                        {/* 5. SKILLS TAGS */}
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {story.skills.slice(0, 3).map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600"
                            >
                              {skill}
                            </span>
                          ))}
                          {story.skills.length > 3 && (
                            <span className="rounded-md bg-gray-50 px-1.5 py-0.5 text-[10px] font-bold text-gray-400">
                              +{story.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 6. BOTTOM ACTION BUTTONS */}
                      <div className="pt-4 border-t border-gray-100 mt-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedStory(story)}
                            className="cursor-pointer w-full rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/80 py-2 text-xs font-bold text-gray-700 transition-colors flex items-center justify-center gap-1.5"
                          >
                            View Project Details
                            <ArrowRight className="h-3 w-3" />
                          </button>

                          {story.videoId && (
                            <button
                              type="button"
                              onClick={() => setActiveVideoId(story.videoId)}
                              title="Watch Student Video"
                              className="cursor-pointer shrink-0 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-3 py-2 text-xs font-bold transition-colors flex items-center gap-1"
                            >
                              <Play className="h-3.5 w-3.5 fill-current" />
                              <span className="hidden sm:inline">Watch</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Bottom Carousel Pagination Dots */}
              {count > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  {Array.from({ length: count }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => api?.scrollTo(i)}
                      className={`cursor-pointer transition-all duration-300 rounded-full ${
                        current === i
                          ? "w-8 h-2.5 bg-[#1E7CBC]"
                          : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </Carousel>
          </div>
        )}

        {/* Video Testimonials Showcase (When 'video' tab is active) */}
        {activeTab === "video" && (
          <div className="space-y-8">
            <div className="rounded-[28px] border border-red-200 bg-linear-to-b from-red-50/50 via-white to-white p-6 sm:p-10 shadow-sm text-center">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
                Watch <span className="text-[#183D71]">Skill</span><span className="text-[#1E7CBC]">Yards</span> Students in Their Own Words
              </h3>
              <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto mb-8">
                Click any video to listen to real students sharing their raw experience, interview rounds, live client projects, and life after placement.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                {realStudentVideos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => setActiveVideoId(video.id)}
                    className="group cursor-pointer rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-red-400 transition-all duration-300"
                  >
                    {/* Thumbnail with Play Overlay */}
                    <div className="relative aspect-video w-full bg-gray-900 overflow-hidden">
                      <img
                        src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                        alt={video.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="h-12 w-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-red-700 transition-all">
                          <Play className="h-5 w-5 fill-current ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 rounded-md bg-black/80 text-white text-[10px] font-bold px-2 py-0.5">
                        {video.duration}
                      </span>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between text-xs text-red-600 font-bold mb-1">
                        <span>Video Testimonial</span>
                        <span className="text-gray-400 font-normal">SkillYards Verified</span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1">{video.name}</h4>
                      <p className="text-xs text-gray-500 mb-2">{video.role}</p>
                      <p className="text-xs text-gray-700 bg-gray-50 rounded-lg p-2 font-medium line-clamp-2">
                        {video.topic}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Banner: Real Alumni Talk & Verification */}
        <div className="mt-14 rounded-3xl bg-linear-to-r from-gray-900 via-gray-800 to-[#0a334f] p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#1E7CBC]/20 border border-[#1E7CBC]/40 px-3 py-1 text-xs font-bold text-cyan-200">
              <Users className="h-3.5 w-3.5" />
              1-on-1 Alumni Connect Available
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Want to speak with an alumni who works in an agency?
            </h3>
            <p className="text-sm text-gray-300 max-w-xl">
              We connect prospective students with placed alumni so you can ask unfiltered questions about the faculty, workload, live client ad budgets, and placement rounds.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer w-full sm:w-auto rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3.5 text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
            >
              <MessageCircle className="h-4 w-4" />
              Chat with Alumni on WhatsApp
            </a>

            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer w-full sm:w-auto rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-5 py-3.5 text-sm transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Star className="h-4 w-4 fill-[#1E7CBC] text-[#1E7CBC]" />
              Verify on Google (4.9★)
              <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Modal 1: Detailed Story & Live Project Breakdown */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedStory(null)}
              className="cursor-pointer absolute top-5 right-5 rounded-full p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header Profile */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className={`h-14 w-14 rounded-2xl bg-gradient-to-tr ${selectedStory.avatarBg} text-white flex items-center justify-center font-bold text-xl shadow-md`}
              >
                {selectedStory.initials}
              </div>
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-800 mb-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {selectedStory.badge}
                </span>
                <h3 className="text-xl font-bold text-gray-900">{selectedStory.name}</h3>
                <p className="text-xs text-gray-500">
                  {selectedStory.role} · <strong className="text-[#1E7CBC]">{selectedStory.company}</strong>
                </p>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="rounded-xl bg-gray-50 border border-gray-200/80 p-3">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                  Package / CTC
                </span>
                <span className="text-lg font-black text-emerald-600">{selectedStory.package}</span>
              </div>
              <div className="rounded-xl bg-gray-50 border border-gray-200/80 p-3">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                  Location / Mode
                </span>
                <span className="text-sm font-bold text-gray-800 flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  {selectedStory.location}
                </span>
              </div>
            </div>

            {/* Full Quote */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Quote className="h-3.5 w-3.5 text-[#1E7CBC]" />
                Student Experience & Review
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed bg-[#1E7CBC]/5 border border-[#1E7CBC]/20 rounded-2xl p-4 italic">
                &ldquo;{selectedStory.quote}&rdquo;
              </p>
            </div>

            {/* Live Project Case Study */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                Portfolio Project & Ad Spend Work
              </h4>
              <div className="rounded-2xl bg-indigo-50/50 border border-indigo-200/70 p-4 text-xs text-indigo-950">
                <p className="leading-relaxed font-medium">{selectedStory.projectHighlight}</p>
                {selectedStory.interviewRounds && (
                  <div className="mt-3 pt-3 border-t border-indigo-200/60 flex items-center gap-1.5 text-[11px] text-indigo-800">
                    <Briefcase className="h-3 w-3" />
                    <strong>Interview Format:</strong> {selectedStory.interviewRounds}
                  </div>
                )}
              </div>
            </div>

            {/* Skills Pills */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                Tools & Skills Evaluated by Recruiter
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedStory.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="rounded-lg bg-gray-100 border border-gray-200 px-2.5 py-1 text-xs font-bold text-gray-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal CTAs */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer flex-1 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 text-xs sm:text-sm text-center transition-colors flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
              >
                <MessageCircle className="h-4 w-4" />
                Ask a Doubt About This Story
              </a>

              {selectedStory.videoId && (
                <button
                  type="button"
                  onClick={() => {
                    const vid = selectedStory.videoId;
                    setSelectedStory(null);
                    setActiveVideoId(vid);
                  }}
                  className="cursor-pointer rounded-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold px-4 py-2.5 text-xs transition-colors flex items-center gap-1.5"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Watch Video
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: YouTube Video Player Dialog */}
      {activeVideoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-3xl rounded-3xl bg-black border border-gray-800 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveVideoId(null)}
              className="cursor-pointer absolute top-3 right-3 z-10 rounded-full bg-black/60 text-white p-2 hover:bg-black transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* YouTube IFrame Embed */}
            <div className="relative aspect-video w-full">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=1&rel=0`}
                title="SkillYards Real Student Testimonial"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
