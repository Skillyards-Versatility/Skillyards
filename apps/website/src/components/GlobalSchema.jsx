export const globalSchema = {
  "@context": "https://schema.org",
  "@type": ["WebSite", "EducationalOrganization", "LocalBusiness"],

  "@id": "https://www.skillyards.in/#organization",

  name: "SkillYards – IT Training Institute in Agra",
  url: "https://www.skillyards.in",

  description:
    "SkillYards is an IT training institute in Agra offering project-based BCA, BBA, full-stack development, digital marketing, and career-focused training programs.",

  image: {
    "@type": "ImageObject",
    url: "https://www.skillyards.in/images/opengraph/home-og.jpg",
    width: 1200,
    height: 630,
  },

  logo: {
    "@type": "ImageObject",
    url: "https://www.skillyards.in/images/logo-square.png",
    width: 512,
    height: 512,
  },

  address: {
    "@type": "PostalAddress",
    streetAddress:
      "A-3, behind Manoj Dhaba, Bhagwan Talkies crossing, Indra Puri, New Agra Colony",
    addressLocality: "Agra",
    addressRegion: "Uttar Pradesh",
    postalCode: "282005",
    addressCountry: "IN",
  },

  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91 70601 00562",
    contactType: "customer support",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi"],
  },

  sameAs: [
    "https://www.facebook.com/skillyardss",
    "https://www.linkedin.com/company/skillyards",
    "https://www.instagram.com/skillyards_eduhub",
    "https://www.twitter.com/skillyardss",
    "https://www.youtube.com/@Skillyardss",
  ],
};
