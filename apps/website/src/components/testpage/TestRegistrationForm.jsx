"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { ArrowRight, Loader2 } from "lucide-react";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export default function TestRegistrationForm() {
    const router = useRouter();

    const [form, setForm] = useState({ name: "", email: "", phone: "" });
    const [status, setStatus] = useState("idle"); 
    const [error, setError] = useState("");
    const [captchaError, setCaptchaError] = useState("");
    const recaptchaRef = useRef(null);

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name || !form.email || !form.phone) {
            setError("Please fill in all fields.");
            console.warn("Validation failed — missing fields:", {
                name: !!form.name,
                email: !!form.email,
                phone: !!form.phone,
            });
            return;
        }

        const token = recaptchaRef.current?.getValue();
        if (RECAPTCHA_SITE_KEY && !token) {
            setCaptchaError("Please verify that you are not a robot.");
            return;
        }
        setCaptchaError("");

        setStatus("loading");

        const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        const apiUrl = `${BASE_URL}/api/test/register`;

        try {
            const res = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    captchaToken: token,
                    website: "",
                }),
            });

            let data;

            try {
                data = await res.json();
            } catch (parseErr) {
                setError("Unexpected server response.");
                setStatus("error");
                return;
            }

            if (!res.ok) {
                if (res.status === 429) {
                    setError("Too many attempts. Please try again later.");
                } else {
                    setError(data?.error || "Something went wrong.");
                }
                setStatus("error");
                recaptchaRef.current?.reset();
                return;
            }


            router.push(`/test/start?leadId=${data.leadId}`);

        } catch (err) {
            setError("Network error. Please try again.");
            setStatus("error");
            recaptchaRef.current?.reset();
        }
    };

    return (
        <section id="register" className="bg-background border-y border-border py-16 px-4 sm:px-6">
            <div className="mx-auto max-w-lg">
                {/* Header */}
                <div className="text-center mb-10">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
                        Get Started
                    </p>
                    <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
                        Take the Free Test
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Fill in your details below — we&apos;ll email your certificate and result report instantly after you finish.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(e);
                }} className="flex flex-col gap-4" noValidate>

                    {/* Honeypot — hidden from humans, irresistible to bots */}
                    <div className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
                        <label htmlFor="website">Website</label>
                        <input
                            id="website"
                            name="website"
                            type="text"
                            tabIndex={-1}
                            autoComplete="off"
                        />
                    </div>

                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Full Name
                        </label>
                        <input
                            name="name"
                            type="text"
                            placeholder="Rahul Sharma"
                            value={form.name}
                            onChange={handleChange}
                            autoComplete="name"
                            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="rahul@example.com"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Phone Number
                        </label>
                        <div className="flex rounded-xl border border-border bg-background overflow-hidden focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                            <span className="flex items-center px-3 text-sm text-muted-foreground border-r border-border bg-muted select-none">
                                +91
                            </span>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="98765 43210"
                                value={form.phone}
                                onChange={handleChange}
                                autoComplete="tel"
                                maxLength={11}
                                className="flex-1 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground bg-transparent focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* reCAPTCHA */}
                    {RECAPTCHA_SITE_KEY && (
                        <div className="flex flex-col items-start gap-1.5">
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={RECAPTCHA_SITE_KEY}
                                onExpired={() =>
                                    setCaptchaError("reCAPTCHA expired. Please verify again.")
                                }
                                onChange={() => setCaptchaError("")}
                            />
                            {captchaError && (
                                <p className="text-xs text-red-500 font-medium">{captchaError}</p>
                            )}
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <p className="text-xs text-red-500 font-medium">{error}</p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className="mt-2 w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold text-sm px-6 py-3.5 rounded-full hover:bg-primary/90 transition-all disabled:opacity-60"
                    >
                        {status === "loading" ? (
                            <>
                                <Loader2 size={15} className="animate-spin" />
                                Registering…
                            </>
                        ) : (
                            <>
                                Start Free Test
                                <ArrowRight size={15} />
                            </>
                        )}
                    </button>

                    <p className="text-center text-xs text-muted-foreground">
                        Your details are only used to send your certificate. We don&apos;t spam.
                    </p>
                </form>
            </div>
        </section>
    );
}
