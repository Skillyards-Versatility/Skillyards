"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoogleMapEmbed } from "@/components/ui/GoogleMapEmbed";
import Logo from "@/components/logo";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import SocialLinks from "@/components/SocialLinks";

export default function Footer() {
  const year = useMemo(() => new Date().getFullYear(), []);
  const pathname = usePathname();

  if (pathname?.startsWith("/campaigns")) {
    return null;
  }

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
    <footer className="border-t border-border bg-background/90 backdrop-blur-md pt-8">
      {/* Top */}
      <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-12 sm:gap-6 md:grid-cols-5 desk:gap-x-8 desk:gap-y-5 lg:gap-x-12 lg:gap-y-8 px-6 desk:px-8 lg:px-12 py-10 sm:py-12 lg:py-20 desk:grid-cols-8 lg:grid-cols-7">
        {/* Brand & Address */}
        <div className="flex flex-col md:col-span-2 desk:col-span-2 lg:col-span-2 relative z-20 pr-0 desk:pr-3 lg:pr-2">
          <Link href="/" className="mb-4 lg:mb-6 flex items-center gap-2">
            <Logo />
          </Link>

          <address className="not-italic text-xs lg:text-sm text-muted-foreground mb-4 lg:mb-6 leading-relaxed max-w-[15rem] lg:max-w-xs flex items-start gap-2">
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
            <div className="footer-heading mb-2 lg:mb-4 text-sm lg:text-lg font-semibold text-muted-foreground">
              {section.title}
            </div>

            <ul className="space-y-1.5 lg:space-y-2 text-xs lg:text-sm">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors  hover:text-primary "
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Mobile accordion */}
        <div className="md:hidden">
          <Accordion type="single" collapsible>
            {footerSections.map((section) => (
              <AccordionItem key={section.title} value={section.title}>
                <AccordionTrigger className="text-muted-foreground font-semibold">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-sm text-background">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="transition-colors text-accent-foreground"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Map column (Visible on all devices) */}
        <div className="block md:col-span-5 desk:col-span-3 lg:col-span-2 desk:pl-2 lg:pl-4">
          <div className="footer-heading mb-3 lg:mb-4 text-base lg:text-lg font-semibold text-muted-foreground">
            Our Location
          </div>
          <div className="w-full h-52 md:h-56 lg:h-56 desk:h-full min-h-[13rem] lg:min-h-[16rem] relative rounded-[1.5rem] overflow-hidden shadow-lg border border-border group">
            <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5 dark:ring-white/10 rounded-[1.5rem] z-10" />
            <GoogleMapEmbed />
          </div>
        </div>
      </div>

      <div className="border-t border-border py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-6 text-sm text-muted-foreground sm:flex-row">
          {/* Left Content */}
          <div className="text-center sm:text-left">
            © {year} SkillYards Versatility
          </div>
        </div>
      </div>
    </footer>
  );
}
