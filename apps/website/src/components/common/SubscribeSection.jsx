"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function NewsletterSection() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess("");
        setError("");

        try {
            setSuccess("You have been subscribed! (Demo mode)");
            setEmail("");
        } catch (err) {
            setError(err.message || "Subscription failed.");
        } finally {
            setLoading(false);
        }
    };



    return (
        <section className="py-12 bg-background relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"></div>
            <div className="absolute bottom-0 inset-x-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="bg-primary/5 border border-primary/10 rounded-3xl p-8 lg:p-12 shadow-xs backdrop-blur-xl relative overflow-hidden">
                    {/* Inner Decor */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

                    <div className="grid lg:grid-cols-2 gap-10 items-center relative z-10">
                        {/* Left Side: Text */}
                        <div className="space-y-4 text-center lg:text-left">
                            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                                Stay Updated with SkillYards
                            </h2>
                            <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto lg:mx-0">
                                Subscribe to our newsletter and get <span className="font-semibold text-primary">exclusive freebies</span>, updates on new programs, and insider tips straight to your inbox.
                            </p>
                            <p className="text-sm font-medium text-foreground/70 justify-center lg:justify-start flex items-center gap-2 pt-2">
                                <span className="flex h-5 w-5 rounded-full bg-green-500/10 items-center justify-center text-green-600">✓</span> Free e-book & exclusive course discounts
                            </p>
                        </div>

                        {/* Right Side: Form */}
                        <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
                            <form
                                onSubmit={handleSubmit}
                                className="relative flex flex-col sm:flex-row gap-3"
                            >
                                <Label htmlFor="email" className="sr-only">
                                    Email Address
                                </Label>

                                <div className="relative flex-1">
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full bg-background/80 backdrop-blur-sm border-border h-12 rounded-xl focus-visible:ring-primary shadow-xs"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="h-12 px-6 rounded-xl bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90 hover:-translate-y-0.5 transition-all w-full sm:w-auto shrink-0"
                                >
                                    {loading ? "Subscribing..." : "Subscribe"}
                                </Button>
                            </form>

                            {/* Feedback Messages */}
                            {success && <p className="text-green-600 font-medium mt-3 text-center lg:text-right animate-in fade-in">{success}</p>}
                            {error && <p className="text-red-500 font-medium mt-3 text-center lg:text-right animate-in fade-in">{error}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
