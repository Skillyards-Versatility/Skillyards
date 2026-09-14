"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const whatsappNumber =
  process.env.NEXT_PUBLIC_PHONE?.replace(/\D/g, "") || "917060100561";

export default function OJTPrimaryCTA({
  label = "Book a Free Demo Class",
  size = "lg",
  desktopClassName = "",
  mobileClassName = "",
  whatsappText = "Hi, I'd like to book a free demo class for the SkillYards OJT programs in Agra.",
}) {
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <>
      <Button
        asChild
        size={size}
        className={`hidden md:flex ${desktopClassName}`.trim()}
      >
        <Link href="/contact">
          {label} <ArrowRight size={16} className="ml-2" />
        </Link>
      </Button>

      <Button
        asChild
        size={size}
        className={`flex md:hidden ${mobileClassName}`.trim()}
      >
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <span className="truncate">{label}</span>{" "}
          <MessageCircle size={16} className="ml-2 shrink-0" />
        </a>
      </Button>
    </>
  );
}
