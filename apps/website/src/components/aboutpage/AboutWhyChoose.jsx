"use client";

import { motion } from "framer-motion";
import { Cpu, Book, Users, Briefcase } from "lucide-react";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import data from "@/data/aboutpage/whychoose.json";

const iconMap = {
  Cpu,
  Book,
  Users,
  Briefcase,
};

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

export default function AboutWhyChoose() {
  return (
    <section className="relative py-28 bg-background overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute left-0 top-1/2 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full -translate-y-1/2 z-0" />
      <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-secondary/5 blur-[140px] rounded-full z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-4">
            Values That Define Us
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            Why <span className="text-primary italic">SkillYards</span>
          </h2>

          <p className="mt-6 text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            SkillYards is built around practical learning, mentor support,
            modern workflows, and stronger career preparation for students after
            12th and graduates.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {data.map((item, index) => {
            const Icon = iconMap[item.icon];

            return (
              <CardContainer
                key={index}
                className="inter-var w-full h-full"
                containerClassName="py-0 h-full"
              >
                <CardBody className="group/card relative rounded-4xl border border-primary/10 bg-linear-to-br from-background/90 via-background/50 to-primary/5 backdrop-blur-xl shadow-xl hover:shadow-primary/5 p-8 transition-all duration-300 w-full h-full min-h-[350px] flex flex-col">
                  {/* Decorative Elements */}
                  <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-4xl" />

                  {/* Icon */}
                  <CardItem translateZ="60" className="relative mb-8">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-background shadow-lg border border-primary/10 text-primary transition-transform group-hover/card:scale-110">
                      {Icon && <Icon className="w-7 h-7" />}
                    </div>
                  </CardItem>

                  {/* Title */}
                  <CardItem
                    translateZ="50"
                    className="text-2xl font-bold text-foreground mb-3 tracking-tight"
                  >
                    {item.title}
                  </CardItem>

                  {/* Description */}
                  <CardItem
                    as="p"
                    translateZ="40"
                    className="text-muted-foreground leading-relaxed text-sm font-medium"
                  >
                    {item.description}
                  </CardItem>

                  {/* decoration */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 blur-[80px] rounded-full pointer-events-none group-hover/card:bg-primary/10 transition-colors" />
                </CardBody>
              </CardContainer>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
