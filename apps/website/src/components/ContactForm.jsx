"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MessageSquare, Send, Lightbulb } from "lucide-react";

function ContactFormContent() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();
    const { executeRecaptcha } = useGoogleReCaptcha();

    async function handleSubmit(e) {
        e.preventDefault();

        setLoading(true);
        setError("");
        setSuccess("");

        const form = e.currentTarget;
        const formData = new FormData(form);

        const firstName = formData.get("first_name");
        const lastName = formData.get("last_name");
        const email = formData.get("email");
        const phone = formData.get("mobile");
        const message = formData.get("message");

        if (!executeRecaptcha) {
            setError("Captcha not ready. Please try again.");
            setLoading(false);
            return;
        }

        const token = await executeRecaptcha("contact_form");

        const payload = {
            firstName,
            lastName,
            email,
            phone,
            message,
            captchaToken: token
        };

        try {
            const res = await fetch("/api/contact-submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            setSuccess(data.message);
            form.reset();

            if (data.redirectUrl) {
                router.replace(data.redirectUrl);
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2 group">
                    <Label htmlFor="first_name" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 ml-1">First Name</Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-primary transition-colors">
                            <User className="w-5 h-5" />
                        </div>
                        <Input
                            id="first_name"
                            name="first_name"
                            placeholder="John"
                            className="pl-12 h-14 bg-neutral-50/50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 focus-visible:ring-primary focus-visible:border-primary transition-all rounded-2xl text-base shadow-sm"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2 group">
                    <Label htmlFor="last_name" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 ml-1">Last Name</Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-primary transition-colors">
                            <User className="w-5 h-5" />
                        </div>
                        <Input
                            id="last_name"
                            name="last_name"
                            placeholder="Doe"
                            className="pl-12 h-14 bg-neutral-50/50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 focus-visible:ring-primary focus-visible:border-primary transition-all rounded-2xl text-base shadow-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2 group">
                <Label htmlFor="email" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 ml-1">Email Address</Label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-primary transition-colors">
                        <Mail className="w-5 h-5" />
                    </div>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="john@example.com"
                        className="pl-12 h-14 bg-neutral-50/50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 focus-visible:ring-primary focus-visible:border-primary transition-all rounded-2xl text-base shadow-sm"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2 group">
                <Label htmlFor="mobile" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 ml-1">Mobile Number</Label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-primary transition-colors">
                        <Phone className="w-5 h-5" />
                    </div>
                    <Input
                        id="mobile"
                        name="mobile"
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]{10}"
                        maxLength={10}
                        autoComplete="tel"
                        placeholder="10-digit mobile number"
                        className="pl-12 h-14 bg-neutral-50/50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 focus-visible:ring-primary focus-visible:border-primary transition-all rounded-2xl text-base shadow-sm"
                    />
                </div>
            </div>

            <div className="space-y-2 group">
                <Label htmlFor="message" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 ml-1">Your Message</Label>
                <div className="relative">
                    <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none text-neutral-400 group-focus-within:text-primary transition-colors">
                        <MessageSquare className="w-5 h-5" />
                    </div>
                    <Textarea
                        id="message"
                        name="message"
                        placeholder="How can we help you?"
                        rows={5}
                        className="pl-12 py-4 bg-neutral-50/50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 focus-visible:ring-primary focus-visible:border-primary transition-all rounded-2xl text-base shadow-sm resize-none"
                        required
                    />
                </div>
            </div>

            <Button
                type="submit"
                className="w-full h-14 text-base font-semibold rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl hover:shadow-primary/30 transition-all duration-300 mt-6 group"
                disabled={loading}
            >
                {loading ? "Sending Message..." : (
                    <span className="flex items-center justify-center gap-2">
                        Send Message <Send className="w-5 h-5 ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </span>
                )}
            </Button>

            {success && (
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/50 text-center font-medium">
                    {success}
                </div>
            )}

            {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50 text-center font-medium">
                    {error}
                </div>
            )}

            <div className="mt-8 pt-8 border-t border-primary flex flex-col items-center text-center">
                <Lightbulb className="w-6 h-6 text-accent-foreground mb-3" />
                <p className="text-lg sm:text-xl text-primary italic font-bold">
                    &quot;The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.&quot;
                </p>
            </div>
        </form>
    );
}

export default function ContactForm() {
    return <ContactFormContent />;
}
