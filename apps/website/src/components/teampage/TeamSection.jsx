"use client";

import { motion } from "framer-motion";
import TeamMemberCard from "./TeamMemberCard";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 15 },
  },
};

export default function TeamSection({
  title,
  subtitle,
  members = [],
  featured = false,
}) {
  if (!members.length) return null;

  const gridClass = featured
    ? "grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 max-w-4xl mx-auto"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8";

  return (
    <section className="mb-24 md:mb-32">
      {/* Section Header */}
      <div className={`mb-12 ${featured ? "text-center" : "text-left"}`}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className={`inline-flex items-center gap-3 mb-4 ${featured ? "mx-auto" : ""}`}
        >
          <div className="w-8 h-[2px] bg-primary" />
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-primary">
            {title}
          </h2>
          <div className="w-8 h-[2px] bg-primary" />
        </motion.div>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1 }}
            className={`text-2xl sm:text-3xl font-serif font-bold text-foreground max-w-2xl ${featured ? "mx-auto" : ""}`}
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Members Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className={gridClass}
      >
        {members.map((member, index) => (
          <motion.div
            key={member.name}
            variants={itemVariants}
            className="w-full h-full"
          >
            <TeamMemberCard {...member} priority={featured && index < 2} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
