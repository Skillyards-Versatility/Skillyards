"use client";

import * as React from "react";

export default function GtmProvider({ gtmId }) {
  React.useEffect(() => {
    if (!gtmId) return;

    let loaded = false;
    const initGTM = () => {
      if (loaded) return;
      loaded = true;

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        "gtm.start": new Date().getTime(),
        event: "gtm.js",
      });

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
      document.head.appendChild(script);

      removeListeners();
    };

    const removeListeners = () => {
      window.removeEventListener("scroll", initGTM);
      window.removeEventListener("pointerdown", initGTM);
      window.removeEventListener("touchstart", initGTM);
      window.removeEventListener("keydown", initGTM);
    };

    window.addEventListener("scroll", initGTM, { passive: true, once: true });
    window.addEventListener("pointerdown", initGTM, { passive: true, once: true });
    window.addEventListener("touchstart", initGTM, { passive: true, once: true });
    window.addEventListener("keydown", initGTM, { passive: true, once: true });

    // Fallback after 3.5s so non-interactive sessions are still tracked
    const timer = setTimeout(initGTM, 3500);

    return () => {
      clearTimeout(timer);
      removeListeners();
    };
  }, [gtmId]);

  return null;
}
