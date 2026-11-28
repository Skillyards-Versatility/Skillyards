"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { GoogleMapEmbed } from "@/components/ui/GoogleMapEmbed";
import Logo from "@/components/logo";
import SocialLinks from "@/components/SocialLinks";

export default function CampaignFooter() {
  const [openSection, setOpenSection] = useState(null);
  const year = useMemo(() => new Date().getFullYear(), []);

  const footerSections = [
    {
      title: "All Programs",
      links: [
        { label: "Programs", href: "/programs" },
        {
          label: "Full-Stack Development",
          href: "/full-stack-web-development-training-in-agra",
        },
        {
          label: "Digital Marketing",
          href: "/digital-marketing-course-in-agra",
        },
        { label: "BCA Programs", href: "/bca-training-program-in-agra" },
        { label: "BBA Programs", href: "/bba-training-program-in-agra" },
      ],
    },
    {
      title: "Legal Stuff",
      links: [
        { label: "Privacy Policy", href: "/legal/privacy-policy" },
        { label: "Refund Policy", href: "/legal/refund-policy" },
        { label: "Terms of Service", href: "/legal/terms-of-service" },
        { label: "Sitemap", href: "/sitemap" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Blog", href: "/blog" },
        { label: "FAQs", href: "/faqs" },
        { label: "Support", href: "/support" },
        { label: "10-Minute Skill Test", href: "/10-minutes-test" },
        { label: "Careers", href: "/careers" },
      ],
    },
  ];

  return (
    <footer className="border-t border-gray-200 dark:border-zinc-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md pt-8 text-gray-900 dark:text-gray-100">
      {/* Top */}
      <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-12 sm:gap-6 md:grid-cols-5 desk:gap-x-8 desk:gap-y-5 lg:gap-x-12 lg:gap-y-8 px-6 desk:px-8 lg:px-12 py-10 sm:py-12 lg:py-20 desk:grid-cols-8 lg:grid-cols-7">
        {/* Brand & Address */}
        <div className="flex flex-col md:col-span-2 desk:col-span-2 lg:col-span-2 relative z-20 pr-0 desk:pr-3 lg:pr-2">
          <Link href="/" className="mb-4 lg:mb-6 flex items-center gap-2">
            <Logo />
          </Link>

          <address className="not-italic text-xs lg:text-sm text-gray-600 dark:text-gray-400 mb-4 lg:mb-6 leading-relaxed max-w-[15rem] lg:max-w-xs flex items-start gap-2">
            <span className="shrink-0 mt-0.5 pointer-events-none">📍</span>
            <span>
              A-3, behind Manoj Dhaba, Bhagwan Talkies crossing, Indra Puri, New
              Agra Colony, Agra, Uttar Pradesh 282005
            </span>
          </address>

          {/* Social */}
          <SocialLinks
            showLabel={false}
            className="-ml-1.5 gap-2.5 md:gap-3 lg:gap-4"
          />
        </div>

        {/* Desktop columns */}
        {footerSections.map((section) => (
          <div key={section.title} className="hidden md:block md:col-span-1">
            <div className="footer-heading mb-2 lg:mb-4 text-sm lg:text-lg font-semibold text-gray-500 dark:text-gray-400">
              {section.title}
            </div>

            <ul className="space-y-1.5 lg:space-y-2 text-xs lg:text-sm">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 transition-colors hover:text-[#1E7CBC] dark:hover:text-[#1E7CBC]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Mobile accordion */}
        <div className="md:hidden divide-y divide-gray-200 dark:divide-zinc-800 border-y border-gray-200 dark:border-zinc-800">
          {footerSections.map((section) => {
            const isOpen = openSection === section.title;
            return (
              <div key={section.title} className="py-0.5">
                <button
                  type="button"
                  onClick={() => setOpenSection(isOpen ? null : section.title)}
                  className="flex w-full items-center justify-between py-3.5 text-left font-semibold text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{section.title}</span>
                  <ChevronDown
                    className={`size-4 shrink-0 transition-transform duration-200 text-gray-400 ${
                      isOpen ? "rotate-180 text-[#1E7CBC]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <ul className="space-y-2 pb-3.5 pt-0.5 text-sm animate-in fade-in-0 duration-150">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="transition-colors text-gray-600 dark:text-gray-400 hover:text-[#1E7CBC]"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {/* Map column (Visible on all devices) */}
        <div className="block md:col-span-5 desk:col-span-3 lg:col-span-2 desk:pl-2 lg:pl-4">
          <div className="footer-heading mb-3 lg:mb-4 text-base lg:text-lg font-semibold text-gray-500 dark:text-gray-400">
            Our Location
          </div>
          <div className="w-full h-52 md:h-56 lg:h-56 desk:h-full min-h-[13rem] lg:min-h-[16rem] relative rounded-[1.5rem] overflow-hidden shadow-lg border border-gray-200 dark:border-zinc-800 group">
            <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5 dark:ring-white/10 rounded-[1.5rem] z-10" />
            <GoogleMapEmbed />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-zinc-800 py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-6 text-sm text-gray-500 dark:text-gray-400 sm:flex-row">
          <div className="text-center sm:text-left">
            © {year} SkillYards Versatility
          </div>
        </div>
      </div>
    </footer>
  );
}
