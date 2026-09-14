"use client";

import { useState, useEffect } from "react";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setVisible(window.scrollY > 200);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    visible && (
      <button
        type="button"
        aria-label="Back to top"
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-70
        rounded-full border border-primary/20
        bg-primary/90 dark:bg-gray-950
        text-white dark:text-gray-200
        p-3 shadow-lg hover:shadow-2xl hover:scale-105
        transition-all duration-300 ease-in-out backdrop-blur-sm
        opacity-70 hover:opacity-100"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <polyline points="7 11 12 6 17 11" />
          <polyline points="7 17 12 12 17 17" />
        </svg>
      </button>
    )
  );
};

export default BackToTop;
