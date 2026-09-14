import {
  Code2,
  BriefcaseBusiness,
  ArrowRight,
  CheckCircle2,
  Brain,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";

const pathways = [
  {
    name: "On-Job Degree (OJD)",
    icon: GraduationCap,
    description:
      "For students after 12th who want a university-recognized degree pathway combined with practical industry-focused skill development.",
    points: [
      "BCA + Full-Stack Development",
      "BBA + Digital Marketing",
      "Practical learning alongside academics",
      "Degree + skills positioning",
    ],
    href: "/programs/on-job-degree",
    cta: "Explore OJD Programs",
  },
  {
    name: "On-Job Training (OJT)",
    icon: BriefcaseBusiness,
    description:
      "For college students, graduates, and early-career learners who want focused practical skill training and portfolio-building in 6 months.",
    points: [
      "Full-Stack Web Development OJT",
      "Digital Marketing OJT",
      "Practical projects",
      "AI-integrated workflows",
      "Placement assistance",
    ],
    href: "/programs/on-job-training",
    cta: "Explore OJT Programs",
  },
];

export default function TechnologiesWeTeach() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Two Learning Paths. One Goal - Career Readiness.
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            SkillYards offers structured pathways for students after 12th and
            graduates based on their career goals and learning stage.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {pathways.map(
            ({ name, icon: Icon, description, points, href, cta }) => (
              <div
                key={name}
                className="group rounded-[2rem] border border-border bg-card/70 p-8 text-left shadow-lg backdrop-blur-sm hover:border-primary hover:shadow-xl transition"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-7 w-7" />
                </div>
                <p className="text-2xl font-bold text-foreground">{name}</p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {description}
                </p>
                <ul className="mt-6 space-y-3">
                  {points.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm font-medium text-foreground"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={href}
                  className="mt-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary transition-transform hover:-translate-y-0.5"
                >
                  {cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
