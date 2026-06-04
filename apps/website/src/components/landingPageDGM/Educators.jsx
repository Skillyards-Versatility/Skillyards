"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Linkedin, Twitter, ExternalLink } from "lucide-react";

export const DGMEducators = ({ educators = [] }) => {
  if (!educators.length) return null;

  return (
        <section className="relative overflow-hidden bg-linear-to-b from-background to-background/50 py-16 dark:from-neutral-950 dark:to-neutral-900 md:py-[15vh]">
          {/* Subtle background glow */}
          <div className="absolute bottom-0 left-0 w-87.5 md:w-125 h-87.5 md:h-125 bg-secondary/5 dark:bg-secondary/15 rounded-full blur-[80px] md:blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />

          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-primary font-bold tracking-widest uppercase text-xs sm:text-sm mb-3 sm:mb-4 block"
              >
                Elite Faculty
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-extrabold mb-4 sm:mb-6 tracking-tight text-foreground dark:text-neutral-50"
              >
                Learn from the <span className="text-primary italic">Best.</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground dark:text-neutral-400 text-sm md:text-base lg:text-lg leading-relaxed"
              >
                Our educators aren&apos;t just academics; they are industry leaders, founders, and experts who have shaped the digital marketing landscape.
              </motion.p>
            </div>

            <div className="grid max-w-4xl mx-auto grid-cols-1 justify-center gap-5 md:grid-cols-2 md:gap-8">
              {educators.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative mx-auto w-full max-w-sm"
                >
                  <div className="relative mb-5 aspect-[4/5] overflow-hidden rounded-[2rem] border-4 border-border shadow-2xl transition-all duration-500 group-hover:rounded-[1.75rem] dark:border-neutral-700 md:mb-8 md:rounded-[3.5rem] md:group-hover:rounded-[2.5rem]">
                    <Image
                      src={edu.image}
                      alt={edu.name}
                      fill
                      className={`object-cover group-hover:scale-110 transition-transform duration-700 ${edu.imageClassName || "object-top"}`}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-primary/20 dark:bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-3 md:gap-4 backdrop-blur-xs">
                      <motion.a
                        href={edu?.socials?.linkedin || "#"}
                        target={edu?.socials?.linkedin ? "_blank" : "_self"}
                        rel={edu?.socials?.linkedin ? "noopener noreferrer" : ""}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 md:w-12 md:h-12 bg-background dark:bg-neutral-800 text-primary rounded-full flex items-center justify-center shadow-xl hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Linkedin size={18} />
                      </motion.a>
                    </div>
                  </div>

                  <div className="px-1 text-center md:px-4">
                    <h3 className="mb-2 text-lg font-bold text-foreground transition-colors group-hover:text-primary dark:text-neutral-50 md:text-xl lg:text-2xl">
                      {edu.name}
                    </h3>
                    <div className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary md:mb-3 md:px-4 md:text-sm dark:bg-primary/25 dark:text-white">
                      {edu.role}
                    </div>
                    <p className="text-muted-foreground dark:text-neutral-400 text-xs md:text-sm font-medium leading-relaxed italic">
                      {edu.specialization || "Marketing Expert"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
  );
};
