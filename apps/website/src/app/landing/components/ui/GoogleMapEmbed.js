"use client";

import React from "react";

export function GoogleMapEmbed() {
  return (
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3548.749591461942!2d78.0064789!3d27.203366399999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3974756a3f3b61d9%3A0x326cc02d5a39a7fc!2sA-3%20Bhagwan%20Talkies%20crossing%20Indra%20Puri%20New%20Agra%20Colony!5e0!3m2!1sen!2sin!4v1711234567890!5m2!1sen!2sin"
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="SkillYards Location Map"
      className="absolute inset-0 w-full h-full"
    />
  );
}
