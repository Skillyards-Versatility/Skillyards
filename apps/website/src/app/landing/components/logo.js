import React from "react";

export default function Logo() {
  return (
    <>
      <img
        src="https://www.skillyards.in/images/logo-light.svg"
        alt="SkillYards"
        className="h-9 w-auto dark:hidden transition-all duration-300"
      />
      <img
        src="https://www.skillyards.in/images/logo-dark.svg"
        alt="SkillYards"
        className="h-9 w-auto hidden dark:block transition-all duration-300"
      />
    </>
  );
}
