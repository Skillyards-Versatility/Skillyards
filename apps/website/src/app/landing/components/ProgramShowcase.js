"use client";


import { Code2, GraduationCap, BarChart2, Megaphone, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";


const ProgramsShowcase = () => {
   const [isMobile, setIsMobile] = useState(false);
   const [hovered, setHovered] = useState(-1);


   // Detect mobile
   useEffect(() => {
       const checkIsMobile = () => {
           setIsMobile(window.innerWidth <= 768);
       };


       checkIsMobile();
       window.addEventListener("resize", checkIsMobile);


       return () => window.removeEventListener("resize", checkIsMobile);
   }, []);


   const trainingPrograms = [
       {
           title: "Full-Stack Web Development",
           description: "Learn HTML, CSS, JavaScript, React, Node.js, MongoDB, GitHub, deployment, and AI-assisted coding workflows through offline classroom training in Agra.",
           link: "/full-stack-web-development-training-in-agra",
           icon: <Code2 className="w-6 h-6 md:w-8 md:h-8 text-teal-400" />,
           bg: "/images/programmes/full-stack.jpg",
           ctaLabel: "Explore Full-Stack Development",
       },
       {
           title: "Digital Marketing Course",
           description: "Learn SEO, Google Ads, Meta Ads, social media, analytics, reporting, and practical AI-integrated workflows in 6 months.",
           link: "/digital-marketing-course-in-agra",
           icon: <Megaphone className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />,
           bg: "/images/programmes/uiux.jpg",
           ctaLabel: "Explore Digital Marketing",
       },
       {
           title: "BCA Program With IT Training",
           description: "3-year UGC-recognized degree with full-stack training, live projects, and 100% placement support.",
           link: "/bca-training-program-in-agra",
           icon: <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-orange-400" />,
           bg: "/images/programmes/bca.jpg",
           ctaLabel: "Explore BCA Program",
       },
       {
           title: "BBA Program With Digital Marketing",
           description: "3-year UGC-recognized degree with digital marketing training, live projects, and guaranteed placement.",
           link: "/bba-training-program-in-agra",
           icon: <BarChart2 className="w-6 h-6 md:w-8 md:h-8 text-red-400" />,
           bg: "/images/programmes/mca.jpg",
           ctaLabel: "Explore BBA Program",
       },
   ];


   return (
       <section className="relative bg-[#f3f3f3] dark:bg-[#1c1a21] transition-colors duration-300">
           <div className="mx-auto py-16 px-8 max-w-7xl">
               <div className="flex flex-col md:flex-row gap-20 justify-around items-center">
                   {/* Header */}
                   <div className="w-full md:w-[20%] xl:w-[10%] text-center md:text-left mb-8 md:mb-0 mr-2">
                       <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#030e5a] dark:text-[#d4c2fc] transition-colors duration-300">
                           IT Courses
                           <br className="hidden md:block" />
                           We Offer
                           <br className="hidden md:block" />
                           in Agra
                       </h2>
                       <p className="text-lg md:text-xl text-primary">
                           Find your passion
                       </p>
                   </div>


                   {/* Programs */}
                   <div className="w-full md:overflow-x-auto">
                       <div
                           className={`
               flex
               ${isMobile ? "flex-col" : "flex-row"}
               gap-4
               w-full
               p-4
             `}
                       >
                           {trainingPrograms.map((program, index) => (
                               <div
                                   key={program.title}
                                   onMouseEnter={() => !isMobile && setHovered(index)}
                                   onMouseLeave={() => !isMobile && setHovered(-1)}
                                   onClick={() =>
                                       isMobile && setHovered(hovered === index ? -1 : index)
                                   }
                                   className={`
                   rounded-3xl
                   transition-all
                   duration-500
                   ease-in-out
                   cursor-pointer
                   relative
                   overflow-hidden
                   ${isMobile
                                           ? "w-full h-[220px] md:h-[350px]"
                                           : `h-[350px] ${hovered === index ? "w-[400px]" : "w-[250px]"}`
                                       }
                   ${isMobile && hovered === index ? "scale-105" : "scale-100"}
                 `}
                               >
                                   {/* Optimized Background Image */}
                                   <Image
                                       src={program.bg}
                                       alt={program.title}
                                       fill
                                       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                                       className="object-cover transition-transform duration-500"
                                   />
                                   {/* Overlay */}
                                   <div className="absolute inset-0 bg-linear-to-r from-black/70 to-black/40" />


                                  
                                   <div
                                       className={`
                     flex items-center justify-center w-full h-full
                     transition-all duration-500 relative
                     ${hovered === index
                                               ? "opacity-0 scale-0"
                                               : "opacity-100 scale-100"
                                           }
                   `}
                                   >
                                       <span
                                           className={`
                       text-gray-400 font-semibold text-lg whitespace-nowrap
                       ${!isMobile && "-rotate-90"}
                     `}
                                       >
                                           {program.title}
                                       </span>
                                   </div>


                                   {/* Hover / Active */}
                                   <div
                                       className={`
                     absolute inset-0
                     flex flex-col justify-between
                     p-4 md:p-6
                     transition-all duration-500
                     ${hovered === index
                                               ? "opacity-100 scale-100 translate-y-0"
                                               : "opacity-0 scale-95 translate-y-full"
                                           }
                   `}
                                   >
                                       <div className="flex flex-col gap-4">
                                           <div className="flex items-center gap-3">
                                               {program.icon}
                                               <h3 className="text-xl md:text-2xl font-bold text-white">
                                                   {program.title}
                                               </h3>
                                           </div>
                                           <p className="text-gray-200 text-sm md:text-base">
                                               {program.description}
                                           </p>
                                       </div>


                                       <div className="flex justify-between items-center mt-4">
                                           <Link
                                               href={program.link}
                                               aria-label={`Explore ${program.title}`}
                                               title={`Explore ${program.title}`}
                                               className="inline-flex items-center gap-2 bg-white text-[#030e5a] font-bold text-sm px-5 py-2.5 rounded-full hover:bg-white/90 hover:gap-3 transition-all duration-200 group"
                                           >
                                               {program.ctaLabel}
                                               <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                                           </Link>
                                       </div>
                                   </div>
                               </div>
                           ))}
                       </div>
                   </div>
               </div>
           </div>
       </section>
   );
};


export default ProgramsShowcase;



