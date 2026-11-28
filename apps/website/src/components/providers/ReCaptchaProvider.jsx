"use client";

import * as React from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export default function ReCaptchaProvider({ children }) {
  const [loadCaptcha, setLoadCaptcha] = React.useState(false);

  React.useEffect(() => {
    let triggered = false;
    const handleTrigger = () => {
      if (triggered) return;
      triggered = true;
      setLoadCaptcha(true);
      removeListeners();
    };

    const removeListeners = () => {
      window.removeEventListener("scroll", handleTrigger);
      window.removeEventListener("pointerdown", handleTrigger);
      window.removeEventListener("touchstart", handleTrigger);
      window.removeEventListener("focusin", handleTrigger);
      window.removeEventListener("keydown", handleTrigger);
    };

    // Load immediately if user scrolls, taps, clicks into any input, or types
    window.addEventListener("scroll", handleTrigger, { passive: true, once: true });
    window.addEventListener("pointerdown", handleTrigger, { passive: true, once: true });
    window.addEventListener("touchstart", handleTrigger, { passive: true, once: true });
    window.addEventListener("focusin", handleTrigger, { passive: true, once: true });
    window.addEventListener("keydown", handleTrigger, { passive: true, once: true });

    // Fallback: load after idle / delayed timer so forms are always ready
    const scheduleLoad = () => {
      if (typeof window !== "undefined" && "requestIdleCallback" in window) {
        window.requestIdleCallback(() => handleTrigger(), { timeout: 3000 });
      } else {
        handleTrigger();
      }
    };
    const timer = setTimeout(scheduleLoad, 9000);

    return () => {
      clearTimeout(timer);
      removeListeners();
    };
  }, []);

  if (!loadCaptcha) {
    return <>{children}</>;
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "body",
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
