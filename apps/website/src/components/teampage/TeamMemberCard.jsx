"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Linkedin,
  Twitter,
  Globe,
  ArrowUpRight,
  Instagram,
} from "lucide-react";

export default function TeamMemberCard({
  name,
  role,
  bio,
  image,
  imageClassName,
  badge,
  socials = {},
  priority = false,
  slug,
}) {
  const mainContent = (
    <div className="flex flex-col gap-4 w-full h-full">
      {/* Image Container */}
      <div className="relative w-full aspect-[4/5] sm:aspect-square md:aspect-[4/5] rounded-[2rem] overflow-hidden bg-muted cursor-pointer isolate">
        {/* Base Image */}
        <Image
          src={image}
          alt={name}
          fill
          priority={priority}
          className={`object-cover transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] md:group-hover:scale-105 ${imageClassName || "object-top"}`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Top Badge */}
        {badge && (
          <div className="absolute top-4 left-4 z-20">
            <span className="inline-block bg-primary/90 backdrop-blur-sm shadow-xl text-primary-foreground text-[10px] font-black uppercase px-3 py-1.5 rounded-full tracking-widest border border-primary/20">
              {badge}
            </span>
          </div>
        )}
      </div>

      {/* Description Info Below the Image */}
      <div className="flex flex-col px-2 pt-1">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-primary font-bold text-xs uppercase tracking-widest mb-1.5">
              {role}
            </p>
            <h3 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
              {name}
            </h3>
          </div>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed font-medium">
          {bio}
        </p>
      </div>
    </div>
  );

  return (
    <div className="group flex flex-col h-full relative">
      {slug ? (
        /* Card Link - wraps only identity info */
        <Link href={`/team/${slug}`} className="block h-full">
          {mainContent}
        </Link>
      ) : (
        mainContent
      )}

      {/* Socials - Outside Link to avoid nesting <a> tags */}
      {(socials.linkedin ||
        socials.twitter ||
        socials.instagram ||
        socials.website) && (
        <div className="flex gap-2 mt-4 pt-4 px-2 border-t border-border">
          {socials.linkedin && (
            <a
              href={socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors p-2 -ml-2 rounded-full hover:bg-muted"
              aria-label={`${name}'s LinkedIn`}
            >
              <Linkedin size={18} />
            </a>
          )}
          {socials.instagram && (
            <a
              href={socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-muted"
              aria-label={`${name}'s Instagram`}
            >
              <Instagram size={18} />
            </a>
          )}
          {socials.twitter && (
            <a
              href={socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-muted"
              aria-label={`${name}'s Twitter`}
            >
              <Twitter size={18} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
