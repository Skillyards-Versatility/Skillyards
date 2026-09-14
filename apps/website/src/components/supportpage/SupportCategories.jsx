import {
  BookOpen,
  CreditCard,
  Briefcase,
  FileText,
  Laptop,
  MessageCircle,
} from "lucide-react";

const categories = [
  {
    id: "admissions",
    icon: <BookOpen size={20} />,
    title: "Admissions & Enrollment",
    description:
      "Eligibility, how to apply, seat availability, and joining formalities.",
    iconClass:
      "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
  },
  {
    id: "fees",
    icon: <CreditCard size={20} />,
    title: "Fees & Payments",
    description: "Fee structure, EMI options, payment modes, and receipts.",
    iconClass:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
  },
  {
    id: "placement",
    icon: <Briefcase size={20} />,
    title: "Placement & Careers",
    description:
      "Placement process, hiring partners, interview prep, and job referrals.",
    iconClass:
      "bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400",
  },
  {
    id: "certificates",
    icon: <FileText size={20} />,
    title: "Certificates & Documents",
    description:
      "Completion certificates, marksheets, experience letters, and verification.",
    iconClass:
      "bg-orange-100 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400",
  },
  {
    id: "technical",
    icon: <Laptop size={20} />,
    title: "Technical Support",
    description:
      "LMS access, portal login issues, recorded sessions, and software setup.",
    iconClass:
      "bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400",
  },
  {
    id: "general",
    icon: <MessageCircle size={20} />,
    title: "General Queries",
    description:
      "Schedule changes, holidays, batch timings, and any other questions.",
    iconClass:
      "bg-teal-100 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400",
  },
];

export default function SupportCategories() {
  return (
    <section className="bg-background py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
            Browse by Topic
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-foreground">
            What do you need help with?
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <a
              key={cat.id}
              id={cat.id}
              href={`#${cat.id}`}
              className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5"
            >
              <div className={`shrink-0 rounded-xl p-3 ${cat.iconClass}`}>
                {cat.icon}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-foreground text-sm sm:text-base mb-1 group-hover:text-primary transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
