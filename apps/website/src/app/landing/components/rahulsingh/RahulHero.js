"use client";
import Link from "next/link";
import Image from "next/image";
import { LazyMotion, domAnimation, m } from "framer-motion";
// import { Linkedin, Twitter, Instagram, ArrowUpRight } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { FaLinkedinIn, FaXTwitter, FaInstagram } from "react-icons/fa6";

// const socials = [
//    { icon: Linkedin, url: "https://www.linkedin.com/in/rahul-singh-a90ab630/", label: "LinkedIn" },
//    { icon: Twitter, url: "https://x.com/rsrsrahul444?s=11", label: "Twitter" },
//    { icon: Instagram, url: "https://www.instagram.com/rahul_rs0310?igsh=bmpqejlqZXdsbHN5&utm_source=qr", label: "Instagram" },
// ];


const socials = [
   { icon: FaLinkedinIn, url: "https://www.linkedin.com/in/rahul-singh-a90ab630/", label: "LinkedIn" },
   { icon: FaXTwitter, url: "https://x.com/rsrsrahul444?s=11", label: "X" },
   { icon: FaInstagram, url: "https://www.instagram.com/rahul_rs0310?igsh=bmpqejlqZXdsbHN5&utm_source=qr", label: "Instagram" },
];


export default function RahulHero() {
   return (
       <LazyMotion features={domAnimation}>
       <m.div
           initial={false}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.7, ease: "easeOut" }}
           className="relative flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16 px-6 py-16 md:py-20"
       >
           {/* Image */}
           <Link
               href="/rahulsingh"
               aria-label="View Rahul Singh profile"
               className="relative z-10 group shrink-0 w-52 h-52 md:w-64 md:h-64 mt-6 md:mt-10 block"
           >
               {/* Glow ring */}
               <div className="absolute -inset-3 rounded-full bg-linear-to-br from-secondary/30 via-primary/20 to-transparent blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" />


               {/* Strict Circle Frame */}
               <div className="relative w-full h-full rounded-full overflow-hidden ring-4 ring-secondary/20 shadow-2xl bg-secondary/10">
                   <Image
                       src="/images/team/rahul-singh.webp"
                       alt="Rahul Singh"
                       fill
                       sizes="(max-width: 768px) 208px, 256px"
                       className="object-cover object-top scale-[1.15] group-hover:scale-[1.25] transition-transform duration-700"
                   />
               </div>
           </Link>


           {/* Content */}
           <div className="flex-1 text-center md:text-right max-w-xl">
               <m.p
                   initial={false}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.2, duration: 0.5 }}
                   className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary bg-primary/10 px-3 py-1 rounded-full mb-4"
               >
                   Chief Operating Officer
               </m.p>


               <m.h3
                   initial={false}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.3, duration: 0.5 }}
                   className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight"
               >
                   Rahul Singh - COO
               </m.h3>


               <m.p
                   initial={false}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.4, duration: 0.5 }}
                   className="mt-4 text-muted-foreground leading-relaxed"
               >
                   Rahul Singh focuses on operations, curriculum coordination, student support, and creating smoother learning experiences that help students stay consistent, supported, and career-focused throughout their time at SkillYards.
               </m.p>


               <m.div
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.45, duration: 0.5 }}
                   className="mt-6"
               >
                   <Link
                       href="/rahulsingh"
                       className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-transform duration-300 hover:-translate-y-0.5"
                   >
                       View Profile
                       <ArrowUpRight className="h-4 w-4" />
                   </Link>
               </m.div>


               {/* Social Links */}
               {socials.length > 0 && (
               <m.div
                   initial={false}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.5, duration: 0.5 }}
                   className="relative z-20 mt-6 flex justify-center md:justify-end gap-3"
               >
                   {socials.map(({ icon: Icon, url, label }) => (
                       <a
                           key={label}
                           href={url}
                           target="_blank"
                           rel="noreferrer"
                           aria-label={label}
                           className="group/icon p-2.5 rounded-xl bg-primary/5 border border-primary/10 text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5"
                       >
                           <Icon className="w-4 h-4" />
                       </a>
                   ))}
               </m.div>
               )}
           </div>
       </m.div>
       </LazyMotion>
   );
}


