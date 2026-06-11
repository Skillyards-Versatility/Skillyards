"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import BlogCard from "@/components/blog/BlogCard";
import { Search, ChevronDown, Lightbulb, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

const POSTS_PER_PAGE = 6;

const CATEGORY_LABELS = {
    "ojd-program": "OJD Program",
    "ojd-bca": "OJD BCA",
    "ojd-bba": "OJD BBA",
    "full-stack": "Full-Stack",
    "digital-marketing": "Digital Marketing",
    "career-guidance": "Career Guidance",
    "industry-news": "Industry News",
};

const BlogSearch = ({ posts }) => {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const inputRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query), 300);
        return () => clearTimeout(timer);
    }, [query]);

    const categoryOptions = useMemo(() => {
        const counts = {};

        posts?.forEach((post) => {
            if (!post.category) return;
            counts[post.category] = (counts[post.category] || 0) + 1;
        });

        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .map(([value, count]) => ({
                value,
                count,
                label: CATEGORY_LABELS[value] || value.replace(/-/g, " "),
            }));
    }, [posts]);


    const dynamicSuggestions = useMemo(() => {
        const tagCounts = {};

        posts?.forEach(post => {
            const tags = post.tags || post.categories || [];
            tags.forEach(tag => {
                const tagName = typeof tag === 'string' ? tag : tag.title;
                if (tagName) {
                    tagCounts[tagName] = (tagCounts[tagName] || 0) + 1;
                }
            });
        });

        return Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([tag]) => tag);
    }, [posts]);

    const filtered = useMemo(() => {
        const rawQ = debouncedQuery.toLowerCase().trim();
        const safePosts = posts || [];
        const categoryFiltered = activeCategory === "all"
            ? safePosts
            : safePosts.filter((post) => post.category === activeCategory);

        if (!rawQ) return categoryFiltered;
        const tokens = rawQ.split(/\s+/).filter(t => t.length > 0);

        const scorePost = (post) => {
            let totalScore = 0;
            const fields = [
                { value: post.title?.toLowerCase() || "", weight: 10 },
                { value: post.excerpt?.toLowerCase() || "", weight: 5 },
                {
                    value: (post.tags || [])
                        .map(tag => tag.title)
                        .join(" ")
                        .toLowerCase(),
                    weight: 8
                }
            ];

            fields.forEach(({ value, weight }) => {
                if (!value) return;
                let fieldMaxSignal = 0;
                if (value.includes(rawQ)) fieldMaxSignal = 1.0;
                else if (tokens.some(t => value.startsWith(t))) fieldMaxSignal = 0.7;
                else if (tokens.some(t => value.includes(t))) fieldMaxSignal = 0.3;
                totalScore += fieldMaxSignal * weight;
            });
            return totalScore;
        };

        return categoryFiltered
            .map((post) => ({ post, score: scorePost(post) }))
            .filter((item) => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .map((item) => item.post);
    }, [activeCategory, debouncedQuery, posts]);

    const paginated = debouncedQuery
        ? filtered
        : filtered.slice(0, visibleCount);

    const handleKeyDown = (e) => {
        if (paginated.length === 0) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setFocusedIndex(prev => (prev < paginated.length - 1 ? prev + 1 : prev));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setFocusedIndex(prev => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === "Enter" && focusedIndex >= 0) {
            e.preventDefault();
            const getSlug = (post) => typeof post.slug === "string" ? post.slug : post.slug?.current;
            router.push(`/blog/${getSlug(paginated[focusedIndex])}`);
        }
    };

    return (
        <div className="space-y-10" onKeyDown={handleKeyDown}>
            <div className="space-y-4">
                <div className="relative max-w-2xl mx-auto group z-20">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search articles, guides, and tutorials..."
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setVisibleCount(POSTS_PER_PAGE); setFocusedIndex(-1); }}
                        className="w-full pl-14 pr-12 py-4 rounded-full border border-border/50 bg-background/50 backdrop-blur-sm text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                    />
                </div>

                {categoryOptions.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                setActiveCategory("all");
                                setVisibleCount(POSTS_PER_PAGE);
                                setFocusedIndex(-1);
                            }}
                            className={`rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] transition-all ${
                                activeCategory === "all"
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                            }`}
                        >
                            All
                        </button>

                        {categoryOptions.map((category) => (
                            <button
                                key={category.value}
                                type="button"
                                onClick={() => {
                                    setActiveCategory(category.value);
                                    setVisibleCount(POSTS_PER_PAGE);
                                    setFocusedIndex(-1);
                                }}
                                className={`rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] transition-all ${
                                    activeCategory === category.value
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-border bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                                }`}
                            >
                                {category.label}
                                <span className="ml-2 opacity-70">{category.count}</span>
                            </button>
                        ))}
                    </div>
                )}

                {(debouncedQuery || activeCategory !== "all") && (
                    <div className="flex items-center justify-center animate-in fade-in slide-in-from-top-1 duration-300">
                        <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground/80 bg-muted/50 px-3 py-1 rounded-full border border-border/50">
                            {filtered.length === 0
                                ? "No articles found"
                                : `${filtered.length} article${filtered.length === 1 ? "" : "s"} found`}
                        </p>
                    </div>
                )}
            </div>

            {!query && activeCategory === "all" && dynamicSuggestions.length > 0 && (
                <div className="flex flex-wrap justify-center items-center gap-3 -mt-4">
                    <span className="text-[10px] uppercase tracking-wider text-foreground font-bold flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> Trending:
                    </span>
                    {dynamicSuggestions.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => { setQuery(tag); setVisibleCount(POSTS_PER_PAGE); }}
                            className="px-3 py-1 rounded-full bg-muted/50 border border-border text-[11px] font-medium hover:border-foreground transition-all text-foreground"
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            )}

            {/* Results Grid */}
            {paginated.length > 0 ? (
                <div className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {paginated.map((post, index) => (
                            <div
                                key={post._id}
                                className={`transition-all duration-300 rounded-3xl h-full ${focusedIndex === index ? "ring-4 ring-primary ring-offset-4 scale-[1.03] shadow-2xl z-10" : ""
                                    }`}
                            >
                                <BlogCard post={post} searchQuery={debouncedQuery} onTagClick={(tag) => { setQuery(tag); setVisibleCount(POSTS_PER_PAGE); }} />
                            </div>
                        ))}
                    </div>

                    {!debouncedQuery && visibleCount < filtered.length && (
                        <div className="flex justify-center pt-4">
                            <button
                                onClick={() => setVisibleCount(prev => prev + POSTS_PER_PAGE)}
                                className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full border border-border bg-background/80 backdrop-blur-sm px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground shadow-sm transition-all duration-300 hover:border-primary/50 hover:bg-primary/[0.04] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 active:translate-y-0 cursor-pointer"
                            >
                                <span>Load More Articles</span>
                                <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-300 group-hover:translate-y-0.5" />
                            </button>
                        </div>
                    )}
                </div>
            ) : debouncedQuery ? (
                <div className="flex flex-col items-center justify-center py-24 gap-8 border border-border/40 rounded-[2.5rem] bg-background/40 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.02)] text-center relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
                    
                    <div className="space-y-4 relative z-10">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-primary opacity-80" />
                        </div>
                        <h3 className="text-2xl font-bold font-serif text-foreground">No matches for &quot;{debouncedQuery}&quot;</h3>
                        <p className="text-base text-muted-foreground max-w-sm mx-auto">
                            Don&apos;t let the search end here. Try exploring one of our recommended topics:
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 relative z-10 max-w-lg mx-auto mt-2">
                        {dynamicSuggestions.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => { setQuery(tag); setVisibleCount(POSTS_PER_PAGE); }}
                                className="px-6 py-2.5 rounded-full bg-primary/5 border border-primary/20 text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-sm transition-all duration-300 flex items-center gap-2 group text-foreground"
                            >
                                <Lightbulb className="w-4 h-4 text-primary group-hover:text-primary-foreground transition-colors" />
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default BlogSearch;
