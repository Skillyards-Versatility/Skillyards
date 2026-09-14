const timeline = [
  {
    year: "2023",
    title: "SkillYards Takes Shape",
    description:
      "SkillYards was built around a simple idea: students need practical skills, mentorship, and clearer career direction alongside academics.",
  },
  {
    year: "2024",
    title: "Practical Learning Model Strengthened",
    description:
      "Programs evolved around project-based learning, mentor support, portfolio-building, and stronger classroom accountability.",
  },
  {
    year: "2025",
    title: "OJD and OJT Pathways Expanded",
    description:
      "SkillYards sharpened both On-Job Degree and On-Job Training pathways to support students at different career stages.",
  },
  {
    year: "Today",
    title: "AI-Integrated Career Building",
    description:
      "The focus now is on practical AI usage, modern workflows, and career-focused skill development for learners in Agra.",
  },
];

export default function SkillYardsJourney() {
  return (
    <section className="py-20 bg-background overflow-hidden relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
            SkillYards Journey
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            A continuing effort to make learning more practical, more relevant,
            and more supportive for students building career direction.
          </p>
        </div>

        <div className="relative">
          {/* Flawlessly Aligned Vertical Axis */}
          <div className="absolute left-[32px] md:left-1/2 transform -translate-x-1/2 h-full w-1 bg-linear-to-b from-primary via-secondary to-accent rounded" />

          <div className="space-y-12 md:space-y-16 relative z-10">
            {timeline.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={index} className="group relative w-full">
                  {/* Perfectly Centered Target Axis */}
                  <div className="absolute left-[32px] md:left-1/2 top-10 md:top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex justify-center items-center">
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary ring-[5px] ring-background shadow-lg shadow-primary/40 group-hover:scale-125 group-hover:bg-accent transition-all duration-300" />
                  </div>

                  {/* Responsive Card Positioning */}
                  <div
                    className={`w-full md:w-[calc(50%-3rem)] pl-[76px] md:pl-0 ${
                      isEven ? "md:mr-auto" : "md:ml-auto"
                    }`}
                  >
                    {/* Dynamic Content Alignment */}
                    <div className="p-6 md:p-8 bg-card backdrop-blur-sm rounded-2xl shadow-sm border border-border/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group-hover:border-primary/40 flex flex-col items-start text-left">
                      <span className="inline-block px-3 py-1 text-xs md:text-sm font-bold tracking-wider text-primary bg-primary/10 rounded-full mb-3 md:mb-4">
                        {item.year}
                      </span>
                      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2 md:mb-3">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
