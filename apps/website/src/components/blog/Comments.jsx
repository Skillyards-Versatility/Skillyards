"use client";

import { useEffect, useRef } from "react";

export default function Comments({ slug }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    ref.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.async = true;

    script.setAttribute("repo", "MrigeshDeshpande/Skillyards");
    script.setAttribute("issue-term", "pathname");
    script.setAttribute("label", "skillyards-blog");
    script.setAttribute("theme", "github-light");
    script.setAttribute("crossorigin", "anonymous");

    ref.current.appendChild(script);
  }, []);

  return <div ref={ref} />;
}
