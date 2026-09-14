"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { getWebPageSchema } from "@/lib/seo/schema/webPageSchema";

// Emoji-based rating component
function EmojiRating({ value, onChange, emojis, labels }) {
  return (
    <div className="flex items-center gap-2">
      {emojis.map((emoji, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onChange(idx + 1)}
          className={`text-3xl focus:outline-none ${
            value >= idx + 1 ? "scale-125" : ""
          } transition-transform`}
          title={`${labels[idx].en} / ${labels[idx].hi}`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

export default function FeedbackContent() {
  const { uuid } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const steps = [
    {
      key: "infrastructure",
      label: { en: "Infrastructure", hi: "सुविधाएँ" },
      description: {
        en: "Classrooms, labs, and other facilities",
        hi: "क्लासरूम, लैब और अन्य सुविधाएँ",
      },
    },
    {
      key: "course",
      label: { en: "Course Structure", hi: "कोर्स संरचना" },
      description: {
        en: "Curriculum and content quality",
        hi: "पाठ्यक्रम और सामग्री की गुणवत्ता",
      },
    },
    {
      key: "counselling",
      label: { en: "Counselling", hi: "परामर्श अनुभव" },
      description: {
        en: "Interaction with our staff",
        hi: "हमारी टीम के साथ बातचीत",
      },
    },
    {
      key: "facilities",
      label: { en: "Other Facilities", hi: "अन्य सुविधाएँ" },
      description: {
        en: "Library, Wi-Fi, amenities",
        hi: "लाइब्रेरी, वाई-फाई, अन्य सुविधाएँ",
      },
    },
  ];

  const emojis = ["😞", "😐", "🙂", "😊", "😃"];
  const emojiLabels = [
    { en: "Poor", hi: "खराब" },
    { en: "Fair", hi: "संतोषजनक" },
    { en: "Good", hi: "अच्छा" },
    { en: "Very Good", hi: "बहुत अच्छा" },
    { en: "Excellent", hi: "उत्कृष्ट" },
  ];

  const [ratings, setRatings] = useState(
    steps.reduce((acc, step) => ({ ...acc, [step.key]: 0 }), {}),
  );

  const [suggestions, setSuggestions] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  // Demo mode: set data immediately
  useEffect(() => {
    setData({ name: "Demo User", programme: "Demo Programme" });
    setLoading(false);
  }, []);

  const handleNext = () => {
    if (ratings[steps[currentStep].key] === 0) {
      setError(
        "Please select a rating before continuing / कृपया रेटिंग चुनें।",
      );
      return;
    }
    setError("");
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const submitFeedback = async () => {
    if (Object.values(ratings).some((r) => r === 0)) {
      setError("Please rate all sections / कृपया सभी सेक्शन को रेट करें।");
      return;
    }
    setSubmitted(true);
  };

  if (loading)
    return (
      <p className="text-center py-10">Loading feedback… / लोड हो रहा है…</p>
    );
  if (error) return <p className="text-center text-red-600 py-10">{error}</p>;
  if (submitted)
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold">Thank you / धन्यवाद!</h2>
        <p className="text-gray-600 mt-2">
          Your feedback has been successfully submitted / आपकी प्रतिक्रिया
          सफलतापूर्वक जमा हो गई है।
        </p>
      </div>
    );

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const webPageSchema = getWebPageSchema({
    url: `/feedback/${uuid}`,
    name: "Give Your Feedback | SkillYards",
    description:
      "Help us improve SkillYards by sharing your learning experience.",
  });

  return (
    <>
      <JsonLd data={webPageSchema} id="feedback-webpage-schema" />
      {/* HERO SECTION */}
      <section className="bg-indigo-600 text-white py-14">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Help Us Improve / हमें सुधारने में मदद करें
          </h1>
          <p className="text-indigo-100">
            Your feedback helps SkillYards deliver a better learning experience
            / आपकी प्रतिक्रिया SkillYards को बेहतर सीखने का अनुभव प्रदान करने
            में मदद करती है।
          </p>
        </div>
      </section>

      {/* FORM SECTION */}
      <div className="max-w-xl mx-auto py-10 px-4">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <h2 className="text-xl font-semibold mb-2">
          {step.label.en} / {step.label.hi}
        </h2>
        <p className="text-gray-600 mb-4">
          {step.description.en} / {step.description.hi}
        </p>

        <EmojiRating
          value={ratings[step.key]}
          onChange={(value) =>
            setRatings((prev) => ({ ...prev, [step.key]: value }))
          }
          emojis={emojis}
          labels={emojiLabels}
        />

        <div className="mt-6 flex justify-between">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            >
              ← Previous / पिछला
            </button>
          )}

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Next / अगला →
            </button>
          ) : (
            <button
              type="button"
              onClick={submitFeedback}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Submit / सबमिट करें
            </button>
          )}
        </div>

        {/* Suggestions */}
        {currentStep === steps.length - 1 && (
          <div className="mt-6">
            <label className="block font-medium mb-2">
              Suggestions (optional) / सुझाव (वैकल्पिक)
            </label>
            <textarea
              className="w-full border rounded p-3"
              rows={4}
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
              placeholder="Tell us how we can improve… / हमें कैसे सुधार सकते हैं…"
            />
          </div>
        )}
      </div>
    </>
  );
}
