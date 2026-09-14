import { Award, BadgeCheck, Share2, Download } from "lucide-react";

const tiers = [
  {
    range: "85–100%",
    label: "Expert",
    description:
      "You've mastered the fundamentals. Your certificate highlights you as job-ready.",
    cardClass:
      "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800",
    badgeClass:
      "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-700",
    labelClass: "text-yellow-800 dark:text-yellow-300",
    descClass: "text-yellow-700 dark:text-yellow-400/80",
  },
  {
    range: "60–84%",
    label: "Proficient",
    description:
      "Strong foundation with room to grow. Your certificate recommends the next step.",
    cardClass:
      "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800",
    badgeClass:
      "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700",
    labelClass: "text-blue-800 dark:text-blue-300",
    descClass: "text-blue-700 dark:text-blue-400/80",
  },
  {
    range: "Below 60%",
    label: "Beginner",
    description:
      "You're just starting out. Your certificate points to the perfect program to upskill.",
    cardClass:
      "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800",
    badgeClass:
      "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700",
    labelClass: "text-emerald-800 dark:text-emerald-300",
    descClass: "text-emerald-700 dark:text-emerald-400/80",
  },
];

const perks = [
  {
    icon: <Award size={18} />,
    text: "Official SkillYards certificate with your name and score",
  },
  {
    icon: <BadgeCheck size={18} />,
    text: "Personalised program recommendation based on your result",
  },
  { icon: <Share2 size={18} />, text: "Shareable on LinkedIn and WhatsApp" },
  {
    icon: <Download size={18} />,
    text: "PDF download sent directly to your email",
  },
];

export default function CertificateSection() {
  return (
    <section className="bg-background py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
            Your Reward
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
            You Always Leave With a Certificate
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Regardless of your score, you receive a certificate. The level
            reflects your current skill — not a pass or fail.
          </p>
        </div>

        {/* Certificate mockup */}
        <div className="mx-auto max-w-lg mb-14">
          <div className="relative rounded-2xl border-2 border-primary/20 bg-card p-8 text-center shadow-xl overflow-hidden">
            {/* Corner decoration */}
            <div className="absolute top-0 left-0 w-16 h-16 border-r-0 border-b-0 border-4 border-primary/20 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-l-0 border-t-0 border-4 border-primary/20 rounded-br-2xl" />

            <Award size={40} className="mx-auto text-primary mb-4" />
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
              Certificate of Achievement
            </p>
            <h3 className="font-serif text-2xl font-extrabold text-foreground mb-1">
              SkillYards
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              This certifies that
            </p>
            <div className="h-px w-40 bg-border mx-auto mb-2" />
            <p className="text-xs text-muted-foreground italic mb-4">
              Your Name Here
            </p>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              has successfully completed the SkillYards 10-Minute Skill
              Assessment in HTML, CSS, JavaScript & SEO.
            </p>
            <div className="mt-6 inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-4 py-1.5 rounded-full border border-primary/20">
              <BadgeCheck size={13} /> Verified by SkillYards
            </div>
          </div>
        </div>

        {/* 2 column layout — tiers + perks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Score tiers */}
          <div>
            <h3 className="font-bold text-foreground text-base mb-4">
              Certificate levels by score
            </h3>
            <div className="space-y-3">
              {tiers.map((t) => (
                <div
                  key={t.label}
                  className={`flex items-start gap-4 rounded-2xl border p-4 shadow-sm ${t.cardClass}`}
                >
                  <span
                    className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full border ${t.badgeClass}`}
                  >
                    {t.range}
                  </span>
                  <div>
                    <p className={`font-bold text-sm ${t.labelClass}`}>
                      {t.label}
                    </p>
                    <p className={`text-xs mt-0.5 ${t.descClass}`}>
                      {t.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Perks */}
          <div>
            <h3 className="font-bold text-foreground text-base mb-4">
              What comes with your certificate
            </h3>
            <div className="space-y-3">
              {perks.map((p, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm"
                >
                  <span className="shrink-0 mt-0.5 text-primary">{p.icon}</span>
                  <p className="text-sm text-foreground leading-relaxed">
                    {p.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
