import React from "react";
import Image from "next/image";
import { useTheme } from "@/app/context/ThemeContext";

function Logo() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Image
      src={
        theme === "dark"
          ? "/images/logo-dark.svg" // white logo for dark mode
          : "/images/logo-light.svg" // dark logo for light mode
      }
      alt="SkillYards Logo"
      width={160}
      height={40}
      className="object-contain transition-transform duration-300 group-hover:scale-101"
    />
  );
}

export default Logo;
