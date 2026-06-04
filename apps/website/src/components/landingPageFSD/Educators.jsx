"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";

export const FSDEducators = ({ educators = [] }) => {
  if (!educators.length) return null;

  return (
        <section className="py-[10vh] md:py-[15vh] bg-linear-to-b from-background to-background/50 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-87.5 md:w-125 h-87.5 md:h-125 bg-secondary/5 rounded-full blur-[80px] md:blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />

          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-primary font-bold tracking-widest uppercase text-xs sm:text-sm mb-3 sm:mb-4 block"
              >
                Engineering Team
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-extrabold mb-4 sm:mb-6 tracking-tight text-foreground"
              >
                Built by <span className="text-primary italic">Industry Engineers.</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground text-sm md:text-base lg:text-lg leading-relaxed"
              >
                Our engineers are full-stack developers and system designers who have built and shipped real production systems.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:gap-10 max-w-4xl mx-auto">
              {educators.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="relative aspect-[4/5] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden mb-6 md:mb-8 shadow-2xl border-4 border-border transition-all duration-500 group-hover:rounded-[2rem] md:group-hover:rounded-[2.5rem]">
                    <Image
                      src={edu.image}
                      alt={edu.name}
                      fill
                      className={`object-cover group-hover:scale-110 transition-transform duration-700 ${edu.imageClassName || "object-top"}`}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-3 md:gap-4 backdrop-blur-xs">
                      <motion.a
                        href={edu?.socials?.linkedin || "#"}
                        target={edu?.socials?.linkedin ? "_blank" : "_self"}
                        rel={edu?.socials?.linkedin ? "noopener noreferrer" : ""}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 md:w-12 md:h-12 bg-background text-primary rounded-full flex items-center justify-center shadow-xl hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Linkedin size={18} />
                      </motion.a>
                    </div>
                  </div>

                  <div className="text-center px-2 md:px-4">
                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-2 group-hover:text-primary transition-colors text-foreground">
                      {edu.name}
                    </h3>
                    <div className="inline-block px-3 md:px-4 py-1 rounded-full bg-secondary/10 text-primary text-xs md:text-sm font-bold mb-2 md:mb-3">
                      {edu.role}
                    </div>
                    <p className="text-muted-foreground text-xs md:text-sm font-medium leading-relaxed italic">
                      {edu.specialization}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
  );
};
