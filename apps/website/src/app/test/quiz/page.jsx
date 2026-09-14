"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Loader2,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const leadId = searchParams.get("leadId");
  const topics = searchParams.get("topics");

  const [questions, setQuestions] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600);

  const timerRef = useRef(null);
  const isSubmitted = useRef(false);
  const answersRef = useRef({}); // Prevents dependency array exploits

  const submitTest = async (finalAnswers) => {
    // Must grab from state if not passed from closure
    const currentSessionId =
      sessionId || JSON.parse(localStorage.getItem("currentTestSessionId"));
    if (isSubmitted.current || !currentSessionId) return;

    isSubmitted.current = true;
    setSubmitting(true);
    clearInterval(timerRef.current);

    const answersToSubmit = finalAnswers || answersRef.current;
    const payload = Object.entries(answersToSubmit).map(
      ([questionId, selectedOptionId]) => ({
        questionId,
        selectedOptionId,
      }),
    );

    try {
      const BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

      const res = await fetch(`${BASE_URL}/api/test/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: currentSessionId,
          answers: payload,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Secure server-side validation takes over. No local storage payload.
        router.push(`/test/result?sessionId=${currentSessionId}`);
      } else {
        setError(data.error || "Failed to submit test.");
        setSubmitting(false);
        isSubmitted.current = false;
      }
    } catch (err) {
      console.error(err);
      setError("Network error while submitting.");
      setSubmitting(false);
      isSubmitted.current = false;
    }
  };

  // Start test
  useEffect(() => {
    if (!leadId) {
      router.push("/10-minutes-test");
      return;
    }

    async function startTest() {
      try {
        const BASE_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const topicsArr = topics ? topics.split(",") : [];

        const res = await fetch(`${BASE_URL}/api/test/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            leadId,
            topics: topicsArr,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to start or resume test.");
          setLoading(false);
          return;
        }

        if (data.alreadyCompleted) {
          router.push(`/test/result?sessionId=${data.sessionId}`);
          return;
        }

        setSessionId(data.sessionId);
        localStorage.setItem("currentTestSessionId", data.sessionId);
        setQuestions(data.questions);

        // Initialize Clock Delta (Secured natively by the server's truth)
        const parsedStart = new Date(data.startedAt).getTime();
        const startedAtTime = isNaN(parsedStart) ? Date.now() : parsedStart;
        const DURATION_SEC = 10 * 60;

        timerRef.current = setInterval(() => {
          const elapsed = Math.floor((Date.now() - startedAtTime) / 1000);
          const remaining = DURATION_SEC - elapsed;

          if (remaining <= 0) {
            clearInterval(timerRef.current);
            setTimeLeft(0);
            if (!isSubmitted.current) {
              submitTest(answersRef.current);
            }
          } else {
            setTimeLeft(remaining);
          }
        }, 1000);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load test. Please try again.");
        setLoading(false);
      }
    }

    startTest();

    return () => clearInterval(timerRef.current);
  }, [leadId, topics, router]);

  const formatTime = (seconds) => {
    const m = Math.floor(Math.max(0, seconds) / 60);
    const s = Math.max(0, seconds) % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleOptionSelect = (qId, option) => {
    const next = { ...answers, [qId]: option };
    setAnswers(next);
    answersRef.current = next;
  };

  // Loading status
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/20">
        <Loader2 className="animate-spin text-primary mb-4 w-8 h-8" />
        <p className="text-muted-foreground font-medium animate-pulse">
          Loading your test...
        </p>
      </div>
    );
  }

  // Error status
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20 p-6">
        <div className="bg-destructive/10 text-destructive px-6 py-5 rounded-xl border border-destructive/20 max-w-md text-center">
          <p className="font-semibold mb-1">Something went wrong</p>
          <p className="text-sm opacity-80">{error}</p>
        </div>
      </div>
    );
  }

  // Submitting status
  if (submitting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/20 gap-3">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
        <h2 className="text-xl font-semibold">Submitting your answers...</h2>
        <p className="text-muted-foreground text-sm">
          Please wait while we evaluate your score.
        </p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;
  const isLast = currentIndex === totalQuestions - 1;

  // Timer status
  const timerStatus =
    timeLeft < 60 ? "critical" : timeLeft < 180 ? "warning" : "normal";
  const timerColors = {
    normal:
      "text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20",
    warning:
      "text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20",
    critical:
      "text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-500/10 border-red-200 dark:border-red-500/20",
  };
  const timerDotColors = {
    normal: "bg-emerald-500 dark:bg-emerald-400",
    warning: "bg-amber-500 dark:bg-amber-400",
    critical: "bg-red-500 animate-pulse dark:bg-red-400",
  };

  const optionLabels = ["A", "B", "C", "D", "E"];

  return (
    <div className="min-h-screen bg-muted/30 dark:bg-background/95 flex flex-col items-center justify-center p-4 py-10 transition-colors duration-300">
      <div className="w-full max-w-3xl bg-background border border-border/80 dark:border-border/40 rounded-3xl shadow-lg dark:shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-border/60 dark:border-border/40 bg-card">
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground/90">
            Skill Assessment
          </h1>
          <div
            className={`flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-lg border transition-colors ${timerColors[timerStatus]}`}
          >
            <span
              className={`w-2 h-2 rounded-full ${timerDotColors[timerStatus]}`}
            />
            <span className="tabular-nums tracking-widest">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="h-1 bg-muted dark:bg-muted/40 w-full relative">
          <div
            className="h-full bg-emerald-500 dark:bg-emerald-400 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="px-6 sm:px-8 py-8 bg-card">
          <div className="flex flex-wrap gap-2 mb-8">
            {questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ${
                  answers[q.id]
                    ? "bg-emerald-500 dark:bg-emerald-400"
                    : i === currentIndex
                      ? "bg-foreground ring-2 ring-emerald-500/50 dark:ring-emerald-400/50 ring-offset-2 ring-offset-background scale-110"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/60 dark:bg-muted-foreground/20 dark:hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to question ${i + 1}`}
              />
            ))}
          </div>

          <p className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3">
            Question {currentIndex + 1}{" "}
            <span className="text-muted-foreground/50">
              of {totalQuestions}
            </span>
          </p>
          <h2 className="text-lg sm:text-xl font-semibold leading-relaxed text-foreground mb-8">
            {currentQuestion.question}
          </h2>

          <div className="flex flex-col gap-3.5 mb-10">
            {currentQuestion.options.map((opt, idx) => {
              const selected = answers[currentQuestion.id] === opt;
              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(currentQuestion.id, opt)}
                  className={`group flex items-start gap-4 w-full px-5 py-4 rounded-2xl border text-left text-sm sm:text-base font-medium transition-all duration-200
                    ${
                      selected
                        ? "border-emerald-500/70 dark:border-emerald-400/50 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-100 shadow-sm"
                        : "border-border hover:border-foreground/30 dark:hover:border-foreground/50 hover:bg-muted/50 dark:hover:bg-muted/20 text-foreground/80 hover:text-foreground"
                    }`}
                >
                  <span
                    className={`shrink-0 w-6 h-6 mt-0.5 flex items-center justify-center rounded-full text-[11px] font-bold border transition-colors
                      ${
                        selected
                          ? "bg-emerald-500 border-emerald-500 text-white dark:bg-emerald-500 dark:border-emerald-500 dark:text-emerald-50"
                          : "border-muted-foreground/40 text-muted-foreground/60 group-hover:border-muted-foreground/60 group-hover:text-muted-foreground/80 dark:border-muted-foreground/50"
                      }`}
                  >
                    {selected ? "✓" : optionLabels[idx]}
                  </span>
                  <span className="leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/50 dark:border-border/30">
            <button
              onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
              disabled={currentIndex === 0}
              className="px-5 py-2.5 text-sm font-bold rounded-xl border border-border text-foreground hover:bg-muted/80 dark:hover:bg-muted/30 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              ← Previous
            </button>

            <span className="text-xs sm:text-sm font-medium text-muted-foreground bg-muted/50 dark:bg-muted/30 px-3 py-1.5 rounded-full">
              {answeredCount} / {totalQuestions}
            </span>

            {isLast ? (
              <button
                onClick={() => submitTest()}
                className="px-6 py-2.5 text-sm font-bold rounded-xl bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500 text-white shadow hover:shadow-md transition-all active:scale-95"
              >
                Submit Test
              </button>
            ) : (
              <button
                onClick={() =>
                  setCurrentIndex((p) => Math.min(totalQuestions - 1, p + 1))
                }
                className="px-6 py-2.5 text-sm font-bold rounded-xl bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow hover:shadow-md transition-all active:scale-95"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function TestPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin w-8 h-8 text-primary" />
        </div>
      }
    >
      <QuizContent />
    </Suspense>
  );
}
