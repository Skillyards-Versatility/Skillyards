"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  MapPin,
  Sparkles,
  Camera,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  ShieldCheck,
  ArrowRight,
  Building,
  Laptop,
  Users,
  Award,
  Clock,
  Navigation,
  CheckCircle2,
  MessageCircle,
  Layers,
  Compass,
} from "lucide-react";

// Real Actual Photos of SkillYards Campus, Labs, Sessions & Events
const actualPhotos = [
  {
    id: "lab-workstations",
    src: "/images/life/life-1.webp",
    alt: "SkillYards High-Performance Coding Lab",
    title: "High-Performance Workstation Lab",
    category: "labs",
    tag: "Dev Lab 01",
    location: "Sanjay Place, Agra",
    caption:
      "Fully air-conditioned lab with dual-monitor developer setups and 100 Mbps dedicated fiber for lag-free campaign audits and coding.",
    stats: "30+ Dev Desks · 100 Mbps Fiber",
  },
  {
    id: "classroom-session",
    src: "/images/life/life-2.webp",
    alt: "Digital Marketing Strategy & Classroom Session",
    title: "Live Interactive Strategy Room",
    category: "mentoring",
    tag: "Lecture Hall A",
    location: "Sanjay Place, Agra",
    caption:
      "Mentors dissecting live client ad campaigns on smart projector screens with turn-by-turn breakdown of CTR, CAC, and ROAS.",
    stats: "Smart Projector · Real Ad Accounts",
  },
  {
    id: "mentor-guidance",
    src: "/images/life/life-3.webp",
    alt: "1-on-1 Mentor Guidance & Doubt Solving",
    title: "1-on-1 Personalized Mentoring Hub",
    category: "mentoring",
    tag: "Mentorship Lounge",
    location: "Sanjay Place, Agra",
    caption:
      "Senior agency practitioners sitting right beside students to review code bugs, Google Ads structures, and portfolio case studies.",
    stats: "Zero-Doubt Policy · 1:1 Reviews",
  },
  {
    id: "team-brainstorm",
    src: "/images/life/life-4.webp",
    alt: "Student Collaborative Brainstorming & Agency Sprints",
    title: "Agency Sprint & Team War Room",
    category: "sprints",
    tag: "War Room",
    location: "Sanjay Place, Agra",
    caption:
      "Cross-functional student pods pitching digital marketing strategies, debating ad copy variations, and preparing capstone decks.",
    stats: "4-Person Pods · Client Pitches",
  },
  {
    id: "campus-presentation",
    src: "/images/life/life-5.webp",
    alt: "Main Seminar Hall & Industry Speaker Workshop",
    title: "Main Auditorium & Industry Seminar Hall",
    category: "sprints",
    tag: "Auditorium",
    location: "Sanjay Place, Agra",
    caption:
      "Host to weekend masterclasses by visiting industry leaders from Delhi, Gurugram, and Bengaluru marketing agencies.",
    stats: "100+ Capacity · Industry Guest Talks",
  },
  {
    id: "coding-hackathon",
    src: "/images/life/life-6.webp",
    alt: "Live Hackathon & Ad Campaign Sprint",
    title: "24-Hour Weekend Campaign Hackathon",
    category: "sprints",
    tag: "Hackathon Arena",
    location: "Sanjay Place, Agra",
    caption:
      "High-energy hackathon where students run real-time competitive ad experiments with real ad budgets on live client websites.",
    stats: "₹50k+ Live Budgets · Real-Time ROAS",
  },
  {
    id: "celebration-day",
    src: "/images/life/life-7.webp",
    alt: "SkillYards Placement & Certificate Celebration",
    title: "Offer Letter & Certificate Day",
    category: "celebrations",
    tag: "Graduation Hall",
    location: "Sanjay Place, Agra",
    caption:
      "Celebrating real milestone moments when students receive their verified offer letters from partner tech and marketing firms.",
    stats: "94.2% Placed · Joyful Milestones",
  },
  {
    id: "project-audit",
    src: "/images/life/life-8.webp",
    alt: "Technical SEO & Project Review Session",
    title: "Technical SEO & Screaming Frog Lab",
    category: "labs",
    tag: "Audit Suite",
    location: "Sanjay Place, Agra",
    caption:
      "Deep-dive technical audits analyzing 10,000+ URL crawl files, core web vitals, and indexation fixes for live e-commerce stores.",
    stats: "Ahrefs & Screaming Frog Pro",
  },
  {
    id: "student-networking",
    src: "/images/life/life-10.webp",
    alt: "SkillYards Student Networking & Collaboration Space",
    title: "Student Networking & Chill Zone",
    category: "celebrations",
    tag: "Campus Lounge",
    location: "Sanjay Place, Agra",
    caption:
      "Where friendships form, startup ideas are hatched over coffee, and peers practice mock interviews together before real drives.",
    stats: "Cafeteria · Free Wi-Fi · Coffee Bar",
  },
  {
    id: "faculty-seminar",
    src: "/images/life/life-11.webp",
    alt: "Interactive Faculty Seminar & Live Code Review",
    title: "Architecture & Campaign Dissection",
    category: "mentoring",
    tag: "Studio Lab",
    location: "Sanjay Place, Agra",
    caption:
      "Line-by-line review of campaign funnels, GA4 conversion tracking tags, and server-side pixel implementations.",
    stats: "Hands-on Debugging · Real Accounts",
  },
  {
    id: "dev-workstations-b",
    src: "/images/life/life-12.webp",
    alt: "Quiet Focus Study Desks & Dev Workstations",
    title: "Quiet Focus Workstations",
    category: "labs",
    tag: "Deep Work Zone",
    location: "Sanjay Place, Agra",
    caption:
      "Dedicated silent zones designed for deep work, ad copy drafting, algorithm study, and distraction-free portfolio building.",
    stats: "Ergonomic Chairs · Power Backup",
  },
  {
    id: "admissions-lounge",
    src: "/images/life/life-13.webp",
    alt: "Career Counselling & Admissions Lounge",
    title: "Career Counselling & Admissions Suite",
    category: "labs",
    tag: "Admissions Center",
    location: "Sanjay Place, Agra",
    caption:
      "Where parents and students receive honest, transparent guidance about curriculum, scholarship eligibility, and placement accountability.",
    stats: "Free 1:1 Counselling · Zero Pushiness",
  },
];

export default function CampusPhotosSection({ id = "campus" }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isMarqueeHovered, setIsMarqueeHovered] = useState(false);

  // Keyboard navigation for Lightbox
  const handleKeyDown = useCallback(
    (e) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev === 0 ? actualPhotos.length - 1 : prev - 1
        );
      }
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev === actualPhotos.length - 1 ? 0 : prev + 1
        );
      }
    },
    [lightboxIndex]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const whatsappNumber =
    process.env.NEXT_PUBLIC_PHONE?.replace(/\D/g, "") || "917060100561";
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hi SkillYards Team! I saw the real campus photos on your website. I would like to schedule a free in-person campus visit and trial class at your Sanjay Place Agra center."
  )}`;

  return (
    <section
      id={id}
      className="relative w-full bg-[#faf9f6] py-16 sm:py-24 text-gray-900 overflow-hidden scroll-mt-20 lg:scroll-mt-24 border-t border-gray-200/80"
    >
      {/* Subtle Background Radial Glow */}
      <div className="absolute top-0 left-1/3 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-br from-[#1E7CBC]/5 to-transparent blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1E7CBC]/30 bg-[#1E7CBC]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#1E7CBC] mb-4">
            <MapPin className="h-3.5 w-3.5 text-[#1E7CBC]" />
            <span>Sanjay Place, Agra · 100% Real Campus Shots</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-gray-900 leading-tight">
            <span className="bg-gradient-to-r from-[#1E7CBC] to-blue-600 bg-clip-text text-transparent">
              Where Marketers & Techies Train
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            No stock imagery. No synthetic 3D mockups. Take an unfiltered look inside our Sanjay Place tech campus — from daily hands-on ad spend sprints to 1:1 mentor debriefs and real placement celebrations.
          </p>

          {/* Infrastructure Quick Facts Pill Ribbon */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-[13px] font-medium text-gray-700">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-gray-200/90 px-3.5 py-1.5 shadow-xs">
              <Building className="h-3.5 w-3.5 text-[#1E7CBC]" />
              10,000+ sq.ft. Air-Conditioned Campus
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-gray-200/90 px-3.5 py-1.5 shadow-xs">
              <Laptop className="h-3.5 w-3.5 text-indigo-500" />
              100 Mbps Dedicated Fiber & Power Backup
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-gray-200/90 px-3.5 py-1.5 shadow-xs">
              <Users className="h-3.5 w-3.5 text-emerald-600" />
              Personalized 1:1 Desk Mentorship
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-gray-200/90 px-3.5 py-1.5 shadow-xs">
              <Compass className="h-3.5 w-3.5 text-rose-500" />
              Prime Location: Sanjay Place, Agra
            </span>
          </div>
        </div>

        {/* ─── CINEMATIC DUAL-ROW CONTINUOUS CAMPUS STREAM (MARQUEE) ─── */}
        <div
          className="relative w-full overflow-hidden rounded-[28px] border border-gray-200/80 bg-white/70 py-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)]"
          onMouseEnter={() => setIsMarqueeHovered(true)}
          onMouseLeave={() => setIsMarqueeHovered(false)}
        >
          {/* Keyframe styles for continuous infinite glide */}
          <style>{`
            @keyframes campusMarqueeLeft {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
            @keyframes campusMarqueeRight {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(0%); }
            }
          `}</style>

          {/* Gradient Edges for Smooth Infinite Fade */}
          <div className="absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-[#faf9f6] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[#faf9f6] to-transparent z-10 pointer-events-none" />

          {/* Row 1: Leftward Scrolling Filmstrip */}
          <div
            className="flex gap-4 w-max mb-4 transition-transform"
            style={{
              animation: "campusMarqueeLeft 35s linear infinite",
              animationPlayState: isMarqueeHovered ? "paused" : "running",
            }}
          >
            {[...actualPhotos, ...actualPhotos].map((photo, i) => (
              <div
                key={`row1-${photo.id}-${i}`}
                onClick={() => setLightboxIndex(i % actualPhotos.length)}
                className="group relative h-48 sm:h-56 w-72 sm:w-80 shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 transition-all duration-300 hover:scale-[1.03] hover:border-[#1E7CBC]/80 hover:shadow-xl hover:shadow-[#1E7CBC]/10"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  width={320}
                  height={224}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="rounded-md bg-black/70 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-cyan-200 border border-white/10">
                      {photo.tag}
                    </span>
                    <span className="rounded-full bg-white/20 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="h-3.5 w-3.5 text-white" />
                    </span>
                  </div>

                  <div>
                    <h5 className="text-sm font-bold text-white truncate leading-snug">
                      {photo.title}
                    </h5>
                    <p className="text-[11px] text-gray-300 truncate mt-0.5">
                      {photo.stats}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: Rightward Scrolling Filmstrip */}
          <div
            className="flex gap-4 w-max transition-transform"
            style={{
              animation: "campusMarqueeRight 40s linear infinite",
              animationPlayState: isMarqueeHovered ? "paused" : "running",
            }}
          >
            {[...actualPhotos.slice().reverse(), ...actualPhotos.slice().reverse()].map(
              (photo, i) => (
                <div
                  key={`row2-${photo.id}-${i}`}
                  onClick={() => setLightboxIndex(i % actualPhotos.length)}
                  className="group relative h-48 sm:h-56 w-72 sm:w-80 shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 transition-all duration-300 hover:scale-[1.03] hover:border-[#1E7CBC]/80 hover:shadow-xl hover:shadow-[#1E7CBC]/10"
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    decoding="async"
                    width={320}
                    height={224}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="rounded-md bg-black/70 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-cyan-200 border border-white/10">
                        {photo.tag}
                      </span>
                      <span className="rounded-full bg-white/20 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="h-3.5 w-3.5 text-white" />
                      </span>
                    </div>

                    <div>
                      <h5 className="text-sm font-bold text-white truncate leading-snug">
                        {photo.title}
                      </h5>
                      <p className="text-[11px] text-gray-300 truncate mt-0.5">
                        {photo.stats}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* ─── PART 4: CAMPUS INVITATION & IN-PERSON WALKTHROUGH BANNER ─── */}
        <div className="mt-14 rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-[#092b45] border border-[#1E7CBC]/30 p-6 sm:p-10 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#1E7CBC]/20 border border-[#1E7CBC]/30 px-3.5 py-1 text-xs font-bold text-cyan-200">
              <Compass className="h-3.5 w-3.5 text-[#1E7CBC]" />
              Visit In Person Before Enrolling
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Curious how our Sanjay Place campus feels in real life?
            </h3>
            <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
              We welcome prospective students and parents for a walk-in campus tour. Sit in an ongoing live class, interact with students who are currently doing ad budgets, and inspect our infrastructure yourself.
            </p>
            <p className="text-xs text-cyan-200/80 font-medium flex items-center justify-center lg:justify-start gap-1.5 pt-1">
              <MapPin className="h-3.5 w-3.5 text-[#1E7CBC] shrink-0" />
              SkillYards Versatility, Block 51, Sanjay Place, Civil Lines, Agra, UP 282002
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer w-full sm:w-auto rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3.5 text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
            >
              <MessageCircle className="h-4 w-4" />
              Book Campus Tour on WhatsApp
            </a>

            <a
              href="https://maps.google.com/?q=Skillyards+Versatility+Pvt+Ltd+Agra"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer w-full sm:w-auto rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-5 py-3.5 text-sm transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Navigation className="h-4 w-4 text-[#1E7CBC]" />
              Directions in Google Maps
            </a>
          </div>
        </div>
      </div>

      {/* ─── FULLSCREEN LIGHTBOX MODAL ─── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="cursor-pointer absolute top-4 right-4 z-20 rounded-full bg-white/10 hover:bg-white/20 text-white p-2.5 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) =>
                prev === 0 ? actualPhotos.length - 1 : prev - 1
              );
            }}
            className="cursor-pointer absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white p-3 transition-all hover:scale-110"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) =>
                prev === actualPhotos.length - 1 ? 0 : prev + 1
              );
            }}
            className="cursor-pointer absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white p-3 transition-all hover:scale-110"
            aria-label="Next photo"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Image & Caption Container */}
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-h-[70vh] aspect-[16/10] overflow-hidden rounded-2xl border border-white/20 shadow-2xl">
              <img
                src={actualPhotos[lightboxIndex].src}
                alt={actualPhotos[lightboxIndex].alt}
                className="w-full h-full object-contain bg-black/80"
              />
            </div>

            {/* Photo Metadata Footer */}
            <div className="w-full mt-4 rounded-2xl bg-white/10 border border-white/15 p-4 sm:p-5 backdrop-blur-xl text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="rounded-full bg-[#1E7CBC] text-white px-2.5 py-0.5 text-xs font-black">
                    {actualPhotos[lightboxIndex].tag}
                  </span>
                  <span className="text-xs text-cyan-200 font-semibold">
                    {actualPhotos[lightboxIndex].stats}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white truncate">
                  {actualPhotos[lightboxIndex].title}
                </h4>
                <p className="text-xs text-gray-300 mt-0.5 line-clamp-2">
                  {actualPhotos[lightboxIndex].caption}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2 text-xs flex items-center gap-1.5 transition-all shadow-md"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Schedule Visit
                </a>
                <span className="text-xs text-gray-400 font-mono">
                  {lightboxIndex + 1} / {actualPhotos.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
