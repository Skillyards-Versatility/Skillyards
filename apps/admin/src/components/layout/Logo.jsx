"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

export function Logo({ className = "h-14 w-auto" }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className={`${className} bg-transparent`} />;
  }

  const src =
    resolvedTheme === "dark" ? "/logo/logo-dark.svg" : "/logo/logo-light.svg";

  return (
    <Image
      src={src}
      alt="Skillyards"
      width={160}
      height={32}
      className={className}
      priority
    />
  );
}
