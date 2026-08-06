"use client";

import { useState } from "react";
import { Upload, CheckCircle } from "lucide-react";

export default function ApplyForm({ job }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB


    function validate(form) {
        const newErrors = {};

        if (!form.first_name.value)
            newErrors.first_name = "First name is required";

        if (!form.email.value)
            newErrors.email = "Email is required";

        if (!form.phone.value)
            newErrors.phone = "Phone number is required";

        if (!form.experience.value)
            newErrors.experience = "Select experience level";

        const file = form.resume.files[0];

        if (!file) {
            newErrors.resume = "Resume is required";
        } else {
            if (file.type !== "application/pdf") {
                newErrors.resume = "Only PDF files are allowed";
            } else if (file.size > MAX_FILE_SIZE) {
                newErrors.resume = "Resume must be 3 MB or smaller";
            }
        }

        return newErrors;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const form = e.currentTarget;

        const validationErrors = validate(form);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            const formData = new FormData(form);
            formData.append("job_role_id", job.id);
            setSuccess(true);
            form.reset();
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }


    const Field = ({ name, label, type = "text", ...props }) => (
        <div className="relative">
            <input
                name={name}
                type={type}
                placeholder=" "
                className={`peer w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2
                ${errors[name] ? "border-red-500 focus:ring-red-200" : "focus:ring-neutral-300"}
                dark:bg-neutral-900`}
                {...props}
            />
            <label
                className="pointer-events-none absolute left-4 top-3 text-sm text-neutral-500 transition-all
                peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm
                peer-focus:-top-2 peer-focus:text-xs peer-focus:text-neutral-700
                peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs
                bg-white px-1 dark:bg-neutral-950"
            >
                {label}
            </label>
            {errors[name] && (
                <p className="mt-1 text-xs text-red-500">{errors[name]}</p>
            )}
        </div>
    );

    return (
        <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-4 sm:p-6 md:p-8 shadow-sm dark:bg-neutral-950">
            {!success ? (
                <>
                    {/* Header */}
                    <div className="mb-6 text-center sm:text-left">
                        <h3 className="text-xl sm:text-2xl font-semibold">
                            Apply for {job.title}
                        </h3>
                        <p className="mt-1 text-sm text-neutral-500">
                            We carefully review every application.
                        </p>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 gap-4 sm:grid-cols-2 pb-24 sm:pb-0"
                    >
                        <Field name="first_name" label="First Name" />
                        <Field name="last_name" label="Last Name" />
                        <Field name="email" type="email" label="Email Address" />
                        <Field name="phone" type="tel" label="Phone Number" />
                        <Field name="location" label="Current Location" />

                        {/* Experience */}
                        <div className="relative">
                            <select
                                name="experience"
                                className={`peer w-full rounded-lg border px-4 py-3 text-sm dark:bg-neutral-900
                                ${errors.experience ? "border-red-500" : ""}`}
                                defaultValue=""
                            >
                                <option value="" disabled />
                                <option>Fresher / Student</option>
                                <option>0–2 years</option>
                                <option>2–5 years</option>
                                <option>5+ years</option>
                            </select>
                            <label className="absolute left-4 -top-2 bg-white px-1 text-xs text-neutral-500 dark:bg-neutral-950">
                                Experience Level
                            </label>
                            {errors.experience && (
                                <p className="mt-1 text-xs text-red-500">{errors.experience}</p>
                            )}
                        </div>

                        {/* Portfolio */}
                        <Field
                            name="portfolio"
                            label="Portfolio / GitHub / LinkedIn"
                            className="sm:col-span-2"
                        />

                        {/* Resume */}
                        <label
                            className={`sm:col-span-2 flex items-center justify-between gap-2 rounded-lg border border-dashed px-4 py-4 text-sm cursor-pointer
    ${errors.resume ? "border-red-500" : "border-neutral-300"}
    dark:border-neutral-700`}
                        >
    <span className="flex items-center gap-2">
        <Upload className="h-4 w-4" />
        {errors.resume ? "Upload Resume (PDF, max 3 MB)" : "Upload Resume (PDF, max 3 MB)"}
    </span>
                            <input
                                type="file"
                                name="resume"
                                accept="application/pdf"
                                className="hidden"
                            />
                        </label>
                        {errors.resume && (
                            <p className="sm:col-span-2 text-xs text-red-500">
                                {errors.resume}
                            </p>
                        )}

                        {/* Motivation */}
                        <textarea
                            name="motivation"
                            rows="4"
                            placeholder="Why do you want to join SkillYards?"
                            className="sm:col-span-2 rounded-lg border px-4 py-3 text-sm dark:bg-neutral-900"
                        />

                        {/* Sticky Submit */}
                        <div className="fixed bottom-0 left-0 right-0 sm:static sm:col-span-2 bg-white dark:bg-neutral-950 p-4 sm:p-0 border-t sm:border-0">
                            <button
                                disabled={loading}
                                className="w-full rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-60 dark:bg-white dark:text-black"
                            >
                                {loading ? "Submitting..." : "Submit Application"}
                            </button>
                        </div>
                    </form>
                </>
            ) : (
                /* Animated Success */
                <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in duration-500">
                    <CheckCircle className="mb-4 h-12 w-12 text-green-500" />
                    <h3 className="text-2xl font-semibold">
                        Application Received
                    </h3>
                    <p className="mt-3 text-sm text-neutral-500 max-w-md">
                        Thank you for applying to SkillYards.
                        If your profile matches, we’ll reach out personally.
                    </p>
                </div>
            )}
        </div>
    );
}
