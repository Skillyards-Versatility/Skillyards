import { BASE_URL } from "../constants/ids.js";
import { PRESS_MENTIONS } from "./press.js";

export const orgData = {
  name: "SkillYards",
  url: BASE_URL,
  description:
    "SkillYards is an AI-integrated career-building institute in Agra offering practical learning, mentorship, OJD and OJT pathways, Full-Stack Web Development, Digital Marketing, and career-focused training with portfolio building and placement assistance.",

  foundingDate: "2023",

  founders: [
    {
      name: "Rahul Singh",
      jobTitle: "Chief Operating Officer",
    },
    {
      name: "Suryansh Upadhyay",
      jobTitle: "Chief Executive Officer",
    },
  ],

  knowsAbout: [
    "Full Stack Web Development",
    "Data Science & Analytics",
    "On Job Training (OJT)",
    "On Job Degree (OJD)",
    "Industrial Certifications",
    "Career Placement",
    "Digital Marketing",
    "BCA Specialized Training",
    "BBA Specialized Training",
  ],

  areaServed: [
    { type: "City", name: "Agra" },
    { type: "Country", name: "India" },
  ],

  media: {
    logo: {
      url: `${BASE_URL}/images/logo-square.png`,
      width: 512,
      height: 512,
    },
    defaultOgImage: {
      url: `${BASE_URL}/images/opengraph/home-og.jpg`,
      width: 1200,
      height: 630,
    },
  },

  location: {
    name: "SkillYards",
    address: {
      streetAddress:
        "A-3, behind Manoj Dhaba, Bhagwan Talkies Crossing, Indra Puri, New Agra Colony, Agra, Uttar Pradesh",
      addressLocality: "Agra",
      addressRegion: "Uttar Pradesh",
      postalCode: "282005",
      addressCountry: "IN",
    },
  },

  contact: {
    telephone: "+91 70601 00562",
    contactType: "customer support",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi"],
  },

  socials: [
    "https://www.facebook.com/skillyardss",
    "https://www.linkedin.com/company/skillyards",
    "https://www.instagram.com/skillyards_eduhub",
    "https://www.twitter.com/skillyardss",
    "https://www.youtube.com/@Skillyardss",
  ],

  press: PRESS_MENTIONS,
};
