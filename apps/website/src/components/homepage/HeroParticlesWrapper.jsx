"use client";

import dynamic from "next/dynamic";

const Particles = dynamic(() => import("@/components/Particles"), {
  ssr: false,
});

export default function HeroParticlesWrapper({ particleColor }) {
  return (
    <div className="absolute inset-0 z-2 pointer-events-none">
      <Particles
        particleColors={[particleColor]}
        particleCount={80}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={100}
        moveParticlesOnHover
        alphaParticles={false}
        disableRotation={false}
        pixelRatio={1}
      />
    </div>
  );
}
