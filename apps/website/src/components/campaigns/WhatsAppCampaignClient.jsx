"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageCircle, ArrowRight, CheckCircle2, Shield, GraduationCap, ArrowUpRight } from "lucide-react";

export default function WhatsAppCampaignClient({ whatsappNumber }) {
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hi, I want to know more about SkillYards career programs and OJT pathways."
  )}`;

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center bg-zinc-50 text-zinc-800 px-4 py-6 md:py-12 overflow-hidden select-none">
      {/* Decorative light background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[350px] bg-gradient-to-b from-emerald-500/5 via-teal-500/3 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e760_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e760_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Logo Header */}
      <header className="w-full max-w-md flex justify-center py-4 z-10">
        <Link
          href="/"
          id="whatsapp-campaign-logo-link"
          className="group block transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
        >
          <Image
            src="/images/logo-light.svg"
            alt="SkillYards Logo"
            width={160}
            height={40}
            className="object-contain"
          />
        </Link>
      </header>

      {/* Content Area */}
      <main className="w-full max-w-md flex-1 flex flex-col justify-center items-center z-10 py-6">
        <div className="w-full bg-white border border-zinc-200/70 backdrop-blur-xl rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-xl shadow-zinc-200/55 flex flex-col items-center text-center relative overflow-hidden">
          
          {/* Subtle green ambient accent glow in card */}
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Interactive animated icon badge */}
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6 relative group">
            <MessageCircle className="w-7 h-7 text-[#25D366] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[15deg]" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 mb-8 leading-normal px-1">
            If you want to know more about SkillYards, click the button below
          </h1>

          {/* CTA Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="whatsapp-campaign-cta-button"
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20b857] hover:to-[#0e7569] text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#25D366]/15 hover:shadow-[#25D366]/30 text-sm sm:text-base mb-0 outline-none group"
          >
            <MessageCircle className="w-5 h-5 shrink-0 group-hover:rotate-12 transition-transform duration-300" />
            <span>Chat on WhatsApp</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 z-10 flex flex-col gap-2">
        <Link 
          href="/" 
          id="whatsapp-campaign-footer-link"
          className="text-xs text-emerald-600 hover:text-emerald-700 font-bold hover:underline inline-flex items-center justify-center gap-1 mx-auto"
        >
          <span>Visit Main Website</span>
          <ArrowUpRight className="w-3 h-3" />
        </Link>
        <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1 font-medium">
          © {new Date().getFullYear()} SkillYards Versatility. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
