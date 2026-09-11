"use client";


import { LazyMotion, domAnimation, m } from "framer-motion";
import SuryanshHero from "@/components/suryanshupadhyay/SuryanshHero";
import RahulHero from "@/components/rahulsingh/RahulHero";


export default function LeadersSection() {
   return (
       <LazyMotion features={domAnimation}>
       <section className="relative py-24 overflow-hidden">
           {/* Ambient Background Effects */}
           <div className="absolute inset-0 pointer-events-none -z-10">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full" />
               <div className="absolute bottom-0 right-0 w-[500px] h-[300px] rounded-full" />
           </div>


           {/* Section Header */}
           <div className="max-w-4xl mx-auto px-6 text-center mb-8">
               <m.div
                   initial={{ opacity: 0, y: -20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.6 }}
               >
                   <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
                       Meet Our Leadership Team
                   </h2>
                   <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                       Meet the people helping shape SkillYards into an AI-integrated, career-building institute focused on practical learning, mentorship, and student growth.
                   </p>
               </m.div>
           </div>


           {/* Leader Cards */}
           <div className="max-w-6xl mx-auto">
               <div className="divide-y divide-border/40">
                   <SuryanshHero />
                   <RahulHero />
               </div>
           </div>
       </section>
       </LazyMotion>
   );
}
