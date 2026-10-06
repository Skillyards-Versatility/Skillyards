"use client";

import * as React from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export default function ReCaptchaProvider({ children }) {
  const [loadCaptcha, setLoadCaptcha] = React.useState(false);

  React.useEffect(() => {
    const handleTrigger = () => setLoadCaptcha(true);

    // Load immediately if user scrolls, taps, moves mouse, or focuses input
    window.addEventListener("scroll", handleTrigger, { passive: true, once: true });
    window.addEventListener("pointerdown", handleTrigger, { passive: true, once: true });
    window.addEventListener("touchstart", handleTrigger, { passive: true, once: true });
    window.addEventListener("keydown", handleTrigger, { passive: true, once: true });

    // Fallback: load after 4 seconds regardless so forms are always ready
    const timer = setTimeout(handleTrigger, 4000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleTrigger);
      window.removeEventListener("pointerdown", handleTrigger);
      window.removeEventListener("touchstart", handleTrigger);
      window.removeEventListener("keydown", handleTrigger);
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
