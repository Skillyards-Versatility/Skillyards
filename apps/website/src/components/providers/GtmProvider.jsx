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
      window.removeEventListener("focusin", initGTM);
      window.removeEventListener("keydown", initGTM);
    };

    // User interactions trigger GTM immediately
    window.addEventListener("scroll", initGTM, { passive: true, once: true });
    window.addEventListener("pointerdown", initGTM, { passive: true, once: true });
    window.addEventListener("touchstart", initGTM, { passive: true, once: true });
    window.addEventListener("focusin", initGTM, { passive: true, once: true });
    window.addEventListener("keydown", initGTM, { passive: true, once: true });

    // Fallback after idle / delayed timeout so synthetic audits are not blocked
    const scheduleLoad = () => {
      if (typeof window !== "undefined" && "requestIdleCallback" in window) {
        window.requestIdleCallback(() => initGTM(), { timeout: 3000 });
      } else {
        initGTM();
      }
    };
    const timer = setTimeout(scheduleLoad, 8000);

    return () => {
      clearTimeout(timer);
      removeListeners();
    };
  }, [gtmId]);

  return null;
}
