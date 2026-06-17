import { Code2, Palette, Braces, Search, Book, BookOpen, Calculator, Landmark, Briefcase, TrendingUp } from "lucide-react";

const topics = [
    {
        icon: <Code2 size={22} />,
        title: "HTML",
        color: "bg-orange-100 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400",
        border: "border-orange-200 dark:border-orange-900/50",
        subtopics: [
            "Semantic elements",
            "Forms & inputs",
            "Accessibility basics",
            "Meta tags & SEO structure",
        ],
    },
    {
        icon: <Palette size={22} />,
        title: "CSS",
        color: "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-900/50",
        subtopics: [
            "Box model & layout",
            "Flexbox & Grid",
            "Responsive design",
            "Specificity & selectors",
        ],
    },
    {
        icon: <Braces size={22} />,
        title: "JavaScript",
        color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-950/50 dark:text-yellow-400",
        border: "border-yellow-200 dark:border-yellow-900/50",
        subtopics: [
            "Variables & data types",
            "DOM manipulation",
            "Functions & scope",
            "ES6+ fundamentals",
        ],
    },
    {
        icon: <Search size={22} />,
        title: "SEO",
        color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
        border: "border-emerald-200 dark:border-emerald-900/50",
        subtopics: [
            "On-page optimisation",
            "Keywords & intent",
            "Technical SEO basics",
            "Backlinks & authority",
        ],
    },
    {
        icon: <Book size={22} />,
        title: "Hindi",
        color: "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400",
        border: "border-red-200 dark:border-red-900/50",
        subtopics: [
            "संधि एवं समास",
            "अलंकार एवं व्याकरण",
            "मुहावरे एवं लोकोक्तियाँ",
            "तत्सम-तद्भव शब्द",
        ],
    },
    {
        icon: <BookOpen size={22} />,
        title: "English",
        color: "bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400",
        border: "border-purple-200 dark:border-purple-900/50",
        subtopics: [
            "Tenses & grammar",
            "Active & passive voice",
            "Prepositions & articles",
            "Vocabulary & comprehension",
        ],
    },
    {
        icon: <Calculator size={22} />,
        title: "Math",
        color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400",
        border: "border-cyan-200 dark:border-cyan-900/50",
        subtopics: [
            "Percentage & profit/loss",
            "Ratio & proportion",
            "Simple & compound interest",
            "Average & statistics",
        ],
    },
    {
        icon: <Landmark size={22} />,
        title: "Accountancy",
        color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
        border: "border-emerald-200 dark:border-emerald-900/50",
        subtopics: [
            "Journal & ledger entries",
            "Trial balance & final accounts",
            "Partnership & company accounts",
            "Financial statement analysis",
        ],
    },
    {
        icon: <Briefcase size={22} />,
        title: "Business Std",
        color: "bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400",
        border: "border-violet-200 dark:border-violet-900/50",
        subtopics: [
            "Principles of management",
            "Marketing & finance",
            "Business environment",
            "Forms of business organisations",
        ],
    },
    {
        icon: <TrendingUp size={22} />,
        title: "Economics",
        color: "bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400",
        border: "border-rose-200 dark:border-rose-900/50",
        subtopics: [
            "Micro & macroeconomics",
            "Demand, supply & market structures",
            "National income & GDP",
            "Money, banking & fiscal policy",
        ],
    },
];

export default function TestTopics() {
    return (
        <section className="bg-background py-16 px-4 sm:px-6">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
                        What We Test
                    </p>
                    <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-foreground">
                        10 Skills. 10 Minutes. 1 Certificate.
                    </h2>
                    <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
                        Choose from IT skills or Commerce subjects — pick what you know and test yourself in just 10 minutes.
                    </p>
                </div>

                {/* Topic cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {topics.map((topic) => (
                        <div
                            key={topic.title}
                            className={`flex flex-col gap-4 rounded-2xl border bg-card p-6 ${topic.border}`}
                        >
                            {/* Icon + title */}
                            <div className="flex items-center gap-3">
                                <div className={`rounded-xl p-2.5 ${topic.color}`}>
                                    {topic.icon}
                                </div>
                                <h3 className="font-extrabold text-lg text-foreground">
                                    {topic.title}
                                </h3>
                            </div>

                            {/* Subtopics */}
                            <ul className="space-y-2">
                                {topic.subtopics.map((s) => (
                                    <li key={s} className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
