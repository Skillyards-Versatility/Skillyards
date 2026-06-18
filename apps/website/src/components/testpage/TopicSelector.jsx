"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Clock, FileText, ArrowRight } from "lucide-react";

const TOPICS = [
    { id: "html", label: "HTML" },
    { id: "css", label: "CSS" },
    { id: "javascript", label: "JavaScript" },
    { id: "react", label: "React" },
    { id: "node", label: "Node.js" },
    { id: "mongodb", label: "MongoDB" },
    { id: "aws", label: "AWS" },
    { id: "devops", label: "DevOps" },
    { id: "seo", label: "SEO" },
    { id: "ppc", label: "PPC" },
    { id: "hindi", label: "Hindi" },
    { id: "english", label: "English" },
    { id: "math", label: "Math" },
    { id: "physics", label: "Physics" },
    { id: "chemistry", label: "Chemistry" },
    { id: "biology", label: "Biology" },
    { id: "accountancy", label: "Accountancy" },
    { id: "business", label: "Business Std" },
    { id: "economics", label: "Economics" },
];

export default function TopicSelector({ leadId }) {
    const [selectedTopics, setSelectedTopics] = useState([]);

    const toggleTopic = (id) => {
        setSelectedTopics((prev) =>
            prev.includes(id)
                ? prev.filter((t) => t !== id)
                : [...prev, id]
        );
    };

    const selectAll = () => {
        if (selectedTopics.length === TOPICS.length) {
            setSelectedTopics([]);
        } else {
            setSelectedTopics(TOPICS.map((t) => t.id));
        }
    };

    const isReady = selectedTopics.length >= 2;
    const remaining = Math.max(0, 2 - selectedTopics.length);

    return (
        <div className="bg-card rounded-3xl border border-border shadow-lg overflow-hidden">
            {/* Card header */}
            <div className="px-6 pt-6 pb-4 border-b border-border/60">
                <div className="flex items-center justify-between mb-1">
                    <h2 className="text-lg font-bold text-foreground">Pick Your Topics</h2>
                    <button
                        onClick={selectAll}
                        className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                        {selectedTopics.length === TOPICS.length ? "Deselect All" : "Select All"}
                    </button>
                </div>
                <p className="text-xs text-muted-foreground">
                    Choose <strong>at least 2</strong> topics • {selectedTopics.length} of {TOPICS.length} selected
                </p>
            </div>

            {/* Topics grid */}
            <div className="px-6 py-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {TOPICS.map((topic) => {
                        const isSelected = selectedTopics.includes(topic.id);
                        return (
                            <button
                                key={topic.id}
                                onClick={() => toggleTopic(topic.id)}
                                className={`
                                    relative flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all duration-200
                                    ${isSelected
                                        ? "border-primary bg-primary/5 shadow-sm"
                                        : "border-border/50 bg-background hover:border-border hover:bg-muted/30"
                                    }
                                `}
                            >
                                {/* Checkbox */}
                                <div
                                    className={`
                                        w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all duration-200 border
                                        ${isSelected
                                            ? "bg-primary border-primary text-primary-foreground scale-105"
                                            : "bg-background border-muted-foreground/25"
                                        }
                                    `}
                                >
                                    {isSelected && <Check size={12} strokeWidth={3} />}
                                </div>

                                <div className="min-w-0">
                                    <span
                                        className={`text-sm font-semibold truncate ${
                                            isSelected ? "text-primary" : "text-foreground"
                                        }`}
                                    >
                                        {topic.label}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Footer with stats + CTA */}
            <div className="px-6 pb-6">
                {/* Quick stats */}
                <div className="flex items-center justify-center gap-6 py-4 mb-4 rounded-2xl bg-background border border-border/60">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock size={15} className="text-primary" />
                        <span className="font-semibold text-foreground">10 min</span>
                    </div>
                    <div className="w-px h-5 bg-border" />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText size={15} className="text-primary" />
                        <span className="font-semibold text-foreground">30 Qs</span>
                    </div>
                    <div className="w-px h-5 bg-border" />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{selectedTopics.length}</span>
                        <span>selected</span>
                    </div>
                </div>

                {/* CTA Button */}
                {isReady ? (
                    <Link
                        href={`/test/quiz?leadId=${leadId}&topics=${selectedTopics.join(",")}`}
                        className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-sm font-bold text-primary-foreground shadow-md transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
                    >
                        Start Your Test
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                    </Link>
                ) : (
                    <button
                        disabled
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-muted px-8 py-4 text-sm font-semibold text-muted-foreground cursor-not-allowed"
                    >
                        Select {remaining} more topic{remaining !== 1 ? "s" : ""} to start
                    </button>
                )}
            </div>
        </div>
    );
}
