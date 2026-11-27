// =========================================================================
// 1. DIGITAL MARKETING SKILLS (39 High-Demand Industry Skills in Sequential Order)
// =========================================================================
const skillsData = [
  {
    name: "Performance Marketing",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    name: "Search Engine Optimization (SEO)",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <circle cx="11" cy="11" r="8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m-4.65-4.65l3-3 2 2 3-3" />
      </svg>
    ),
  },
  {
    name: "Social Media Marketing",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    ),
  },
  {
    name: "Meta Ads",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
  },
  {
    name: "Google Ads",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <circle cx="12" cy="12" r="10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20" />
      </svg>
    ),
  },
  {
    name: "Microsoft (Bing) Ads",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <rect x="3" y="3" width="8" height="8" rx="1.5" />
        <rect x="13" y="3" width="8" height="8" rx="1.5" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" />
        <rect x="13" y="13" width="8" height="8" rx="1.5" />
      </svg>
    ),
  },
  {
    name: "Snapchat Ads",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-4 0-6 3-6 6 0 2 .5 3.5 1.5 4.5-.5.5-1.5 1-2.5 1.5 0 1 1 2 3 2 .5 0 1-.2 1.5-.5.8 1.2 2 1.5 2.5 1.5s1.7-.3 2.5-1.5c.5.3 1 .5 1.5.5 2 0 3-1 3-2-1-.5-2-1-2.5-1.5 1-1 1.5-2.5 1.5-4.5 0-3-2-6-6-6z" />
      </svg>
    ),
  },
  {
    name: "Telegram Ads",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
  },
  {
    name: "ChatGPT Ads",
    isAI: true,
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
  },
  {
    name: "TikTok Ads",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
  },
  {
    name: "YouTube Advertising",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <rect x="2" y="4" width="20" height="16" rx="4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 9l5 3-5 3V9z" />
      </svg>
    ),
  },
  {
    name: "Local SEO",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    name: "Technical SEO",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    name: "On-Page & Off-Page SEO",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  },
  {
    name: "Answer Engine Optimization (AEO)",
    isAI: true,
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    name: "Generative Engine Optimization (GEO)",
    isAI: true,
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: "E-Commerce Marketing",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    name: "Shopify Store Development",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    name: "Dropshipping",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    name: "WordPress Development",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <circle cx="12" cy="12" r="10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 8l4 9 4-9m-7 5h6" />
      </svg>
    ),
  },
  {
    name: "Landing Page Development",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8m-4-4v4M7 8h10M7 11h6" />
      </svg>
    ),
  },
  {
    name: "Graphic Designing",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
  {
    name: "Copywriting & Content Creation",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    name: "Brand Marketing",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    name: "Email Marketing",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp Marketing",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    name: "SMS Marketing",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 18h2m-2-10h2m-3 4h4" />
      </svg>
    ),
  },
  {
    name: "Conversion Rate Optimization (CRO)",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
      </svg>
    ),
  },
  {
    name: "Google Analytics (GA4)",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    name: "Google Tag Manager (GTM)",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  {
    name: "Excel Reporting & Analysis",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9h18M3 15h18M9 3v18M15 3v18" />
      </svg>
    ),
  },
  {
    name: "Growth Hacking",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    name: "Marketing Automation",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    name: "AI Prompt Engineering",
    isAI: true,
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: "Generative AI for Marketing",
    isAI: true,
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    name: "AI Creative & Ad Generation",
    isAI: true,
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: "AI-Powered Audience Targeting",
    isAI: true,
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3" />
      </svg>
    ),
  },
  {
    name: "Agentic AI & Workflows",
    isAI: true,
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <circle cx="6" cy="6" r="3" />
        <circle cx="18" cy="6" r="3" />
        <circle cx="12" cy="18" r="3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 7.5l7 0M7.5 8.5l3.5 7m5.5-7l-3.5 7" />
      </svg>
    ),
  },
  {
    name: "CV & Interview Preparation",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

// =========================================================================
// 2. LIVE DIGITAL MARKETING PROJECTS (Projects 1 to 9)
// =========================================================================
const projectsData = [
  {
    id: 1,
    tag: "MODULE 02: WEBSITE DEVELOPMENT",
    tagColor: "text-[#1E7CBC]",
    title: "WordPress & Website Development",
    learnTitle: "What You'll Learn",
    description:
      "Learn to build professional, responsive and SEO-friendly websites from scratch. Understand everything from domain registration and hosting to website design, landing page development and deployment.",
    practicalProject:
      "Build and deploy a fully functional business website with a conversion-focused landing page.",
    checklistTitle: "Your Learning Journey",
    checklist: [
      "Domain, Hosting & DNS Management",
      "WordPress Installation & Configuration",
      "Theme & Plugin Management",
      "Elementor & Website Designing",
      "Responsive Website Development",
      "Conversion-Focused Landing Pages",
      "Website Security & Speed Optimization",
      "Website Deployment & Maintenance",
    ],
    toolsTitle: "Tools You'll Work With",
    tools: [
      { name: "WordPress", type: "wp" },
      { name: "Elementor", type: "elementor" },
      { name: "Hostinger", type: "hostinger" },
      { name: "Cloudflare", type: "cloudflare" },
      { name: "ChatGPT", type: "chatgpt" },
      { name: "Google PageSpeed Insights", type: "pagespeed" },
    ],
    buildTitle: "What You'll Build",
    buildDesc: "A fully functional business website and a conversion-focused landing page.",
    aiBg: "bg-[#f0f8ff]",
    aiAccent: "border-[#1E7CBC]",
    aiTitleColor: "text-[#1E7CBC]",
    aiExamples: [
      {
        title: "AI-Assisted Website Development:",
        desc: "Generate website layouts, custom HTML and CSS snippets, content and design elements using AI tools.",
      },
      {
        title: "AI-Powered Website Optimization:",
        desc: "Use AI to identify usability issues, troubleshoot errors and suggest improvements to website performance and conversions.",
      },
    ],
  },
  {
    id: 2,
    tag: "MODULE 03: E-COMMERCE & ONLINE BUSINESS",
    tagColor: "text-[#e05638]",
    title: "E-Commerce, Shopify & Dropshipping",
    learnTitle: "What You'll Learn",
    description:
      "Learn how to build, manage and market an online store from scratch. Understand product research, marketplace selling, dropshipping, pricing strategies and customer acquisition.",
    practicalProject:
      "Build a functional e-commerce store, create optimized product listings and develop a complete product launch strategy.",
    checklistTitle: "Your Learning Journey",
    checklist: [
      "E-Commerce Business Models (B2B, B2C & D2C)",
      "Product Research & Competitor Analysis",
      "Shopify Store Development",
      "WooCommerce Store Setup",
      "Dropshipping & Supplier Research",
      "Amazon & Flipkart Seller Fundamentals",
      "Product Listing & Marketplace SEO",
      "Payment Gateway, Shipping & Order Management",
      "Pricing Strategy & Profit Margin Analysis",
    ],
    toolsTitle: "Tools You'll Work With",
    tools: [
      { name: "Shopify", type: "shopify" },
      { name: "WooCommerce", type: "woocommerce" },
      { name: "Amazon Seller Central", type: "amazon" },
      { name: "Flipkart Seller Hub", type: "flipkart-seller" },
      { name: "Google Trends", type: "gtrends" },
      { name: "Razorpay", type: "razorpay" },
      { name: "ChatGPT", type: "chatgpt" },
    ],
    buildTitle: "What You'll Build",
    buildDesc: "A functional e-commerce store with optimized product listings and a product launch strategy.",
    aiBg: "bg-[#fef5f2]",
    aiAccent: "border-[#e05638]",
    aiTitleColor: "text-[#e05638]",
    aiExamples: [
      {
        title: "AI-Powered Product Research:",
        desc: "Use AI to analyse market trends, evaluate product opportunities, research competitors and understand customer demand.",
      },
      {
        title: "AI-Driven Product Listing Optimization:",
        desc: "Generate SEO-friendly product titles, persuasive descriptions, product visuals and advertising creatives using AI.",
      },
    ],
  },
  {
    id: 3,
    tag: "MODULE 04: PAID ADVERTISING & PERFORMANCE",
    tagColor: "text-[#059669]",
    title: "PPC & Performance Marketing",
    learnTitle: "What You'll Learn",
    description:
      "Learn to plan, create and optimize paid advertising campaigns across major digital platforms. Understand audience behaviour, budget allocation, bidding strategies and how to maximize return on ad spend (ROAS).",
    practicalProject:
      "Develop a multi-platform advertising campaign for a selected business, from competitor research and media planning to campaign execution and performance analysis.",
    checklistTitle: "Your Learning Journey",
    checklist: [
      "Google Ads — Search, Display, Shopping & YouTube",
      "Meta Ads — Facebook & Instagram",
      "Microsoft (Bing) Ads",
      "Snapchat & Telegram Ads",
      "ChatGPT & TikTok Advertising",
      "Audience Research & Competitor Analysis",
      "Media Planning & Budget Allocation",
      "Advanced Bidding & Retargeting Strategies",
      "Conversion Tracking & Attribution",
      "A/B Testing & Campaign Optimization",
      "ROAS, CAC & Performance Reporting",
    ],
    toolsTitle: "Tools & Platforms You'll Explore",
    tools: [
      { name: "Google Ads", type: "gads" },
      { name: "Meta Ads", type: "fb-ads" },
      { name: "YouTube Ads", type: "yt-ads" },
      { name: "Microsoft Ads", type: "ms-ads" },
      { name: "Snapchat Ads", type: "snap-ads" },
      { name: "Telegram Ads", type: "tg-ads" },
      { name: "ChatGPT Ads", type: "chatgpt" },
      { name: "TikTok Ads", type: "tiktok-ads" },
      { name: "Google Analytics (GA4)", type: "ga" },
      { name: "Google Tag Manager (GTM)", type: "gtm" },
      { name: "Meta Ad Library", type: "meta-ad-lib" },
    ],
    buildTitle: "What You'll Build",
    buildDesc:
      "A multi-platform advertising strategy, campaign assets, media plan and professional performance marketing report.",
    aiBg: "bg-[#f0faf5]",
    aiAccent: "border-[#059669]",
    aiTitleColor: "text-[#059669]",
    aiExamples: [
      {
        title: "AI-Powered Campaign Creation:",
        desc: "Use AI to research audiences, generate persuasive ad copies, create advertising visuals and develop platform-specific campaign strategies.",
      },
      {
        title: "AI-Driven Performance Optimization:",
        desc: "Analyse campaign data, identify wasted ad spend, discover optimization opportunities and make smarter budget allocation decisions using AI.",
      },
    ],
  },
  {
    id: 4,
    tag: "MODULE 05: SEARCH & ORGANIC GROWTH",
    tagColor: "text-[#2563eb]",
    title: "SEO & AI-Powered Search Marketing",
    learnTitle: "What You'll Learn",
    description:
      "Learn how to improve website rankings, attract organic traffic and increase business visibility across traditional and AI-powered search engines. Master everything from keyword research to advanced technical SEO and organic growth strategies.",
    practicalProject:
      "Conduct a comprehensive SEO audit, optimize a business website and develop a complete organic growth strategy.",
    checklistTitle: "Your Learning Journey",
    checklist: [
      "Keyword Research & Search Intent",
      "On-Page & Off-Page SEO",
      "Technical SEO & Website Auditing",
      "Local SEO & Google Business Profile",
      "Link Building & Digital PR",
      "Content Strategy & Topical Authority",
      "E-Commerce SEO",
      "Answer Engine Optimization (AEO)",
      "Generative Engine Optimization (GEO)",
      "LLM Visibility & AI Search Optimization",
      "SEO Analytics & Performance Reporting",
    ],
    toolsTitle: "Tools You'll Work With",
    tools: [
      { name: "Google Search Console", type: "gsc" },
      { name: "Semrush", type: "semrush" },
      { name: "Ahrefs", type: "ahrefs" },
      { name: "Screaming Frog", type: "screamingfrog" },
      { name: "Google Business Profile", type: "gbp" },
      { name: "Google Trends", type: "gtrends" },
      { name: "Google Analytics (GA4)", type: "ga" },
      { name: "ChatGPT", type: "chatgpt" },
      { name: "Gemini", type: "gemini" },
      { name: "Perplexity", type: "perplexity" },
    ],
    buildTitle: "What You'll Build",
    buildDesc:
      "A professional SEO audit report, an optimized website, a local SEO strategy and an AI search visibility roadmap.",
    aiBg: "bg-[#f0f4ff]",
    aiAccent: "border-[#2563eb]",
    aiTitleColor: "text-[#2563eb]",
    aiExamples: [
      {
        title: "AI-Powered SEO Auditing:",
        desc: "Use AI to analyse technical SEO issues, identify content gaps, discover keyword opportunities and develop actionable optimization strategies.",
      },
      {
        title: "AI Search Visibility Optimization:",
        desc: "Develop content strategies designed to improve discoverability across Google AI Overviews, ChatGPT, Gemini and Perplexity.",
      },
    ],
  },
  {
    id: 5,
    tag: "MODULE 06: SOCIAL MEDIA & BRAND BUILDING",
    tagColor: "text-[#ea580c]",
    title: "Social Media & Brand Growth",
    learnTitle: "What You'll Learn",
    description:
      "Learn to build powerful brand identities, create engaging content and grow audiences across major social media platforms. Understand how to turn followers into communities and communities into customers.",
    practicalProject:
      "Develop a complete social media growth strategy for a selected brand, including a 30-day content calendar, creative assets and audience engagement strategy.",
    checklistTitle: "Your Learning Journey",
    checklist: [
      "Instagram, Facebook & YouTube Marketing",
      "LinkedIn, X & Pinterest Marketing",
      "Brand Positioning & Personal Branding",
      "Content Strategy & Calendar Planning",
      "Copywriting & Storytelling",
      "Short-Form Video & Reel Strategy",
      "Influencer & UGC Marketing",
      "Community Management & Engagement",
      "Online Reputation Management (ORM)",
      "Social Media Analytics & Growth Strategy",
    ],
    toolsTitle: "Tools & Platforms You'll Work With",
    tools: [
      { name: "Instagram", type: "instagram" },
      { name: "Facebook", type: "fb" },
      { name: "YouTube", type: "youtube" },
      { name: "LinkedIn", type: "linkedin" },
      { name: "Meta Business Suite", type: "meta-bm" },
      { name: "Canva", type: "canva" },
      { name: "Buffer", type: "buffer" },
      { name: "ChatGPT", type: "chatgpt" },
      { name: "Gemini", type: "gemini" },
    ],
    buildTitle: "What You'll Build",
    buildDesc:
      "A complete brand growth strategy, 30-day content calendar, social media creative portfolio and performance report.",
    aiBg: "bg-[#fff7ed]",
    aiAccent: "border-[#ea580c]",
    aiTitleColor: "text-[#ea580c]",
    aiExamples: [
      {
        title: "AI-Powered Content Production:",
        desc: "Generate content ideas, engaging captions, video scripts, creative visuals and platform-specific content calendars using AI.",
      },
      {
        title: "AI-Driven Brand Growth Strategy:",
        desc: "Use AI to analyse audience behaviour, discover emerging trends, research competitors and identify content growth opportunities.",
      },
    ],
  },
  {
    id: 6,
    tag: "MODULE 07: GROWTH, AI & AUTOMATION",
    tagColor: "text-[#7c3aed]",
    title: "Growth Hacking, AI & Marketing Automation",
    learnTitle: "What You'll Learn",
    description:
      "Learn to accelerate business growth through marketing automation, AI agents, customer engagement and data-driven experimentation. Build intelligent workflows that save time, nurture leads and improve conversions.",
    practicalProject:
      "Build an automated lead management and customer engagement system, from lead capture to personalized follow-ups.",
    checklistTitle: "Your Learning Journey",
    checklist: [
      "Growth Hacking Fundamentals",
      "AARRR Framework & Growth Experiments",
      "Email Marketing & Automation",
      "WhatsApp Business API & Marketing",
      "SMS Marketing & Compliance",
      "CRM & Lead Management",
      "Sales Funnels & Lead Nurturing",
      "Conversion Rate Optimization (CRO)",
      "Advanced Prompt Engineering",
      "Agentic AI & AI Agents",
      "No-Code Automation & API Integration",
      "Automated Marketing Workflows",
    ],
    toolsTitle: "Tools & Platforms You'll Work With",
    tools: [
      { name: "n8n", type: "n8n" },
      { name: "Make", type: "make" },
      { name: "Zapier", type: "zapier" },
      { name: "Mailchimp", type: "mailchimp" },
      { name: "WhatsApp Business", type: "wa-biz" },
      { name: "HubSpot", type: "hubspot" },
      { name: "ChatGPT", type: "chatgpt" },
      { name: "Gemini", type: "gemini" },
      { name: "Google Sheets", type: "gsheets" },
    ],
    buildTitle: "What You'll Build",
    buildDesc:
      "An automated marketing funnel, AI-powered lead management workflow and a complete business growth strategy.",
    aiBg: "bg-[#f5f3ff]",
    aiAccent: "border-[#7c3aed]",
    aiTitleColor: "text-[#7c3aed]",
    aiExamples: [
      {
        title: "AI Agents & Intelligent Automation:",
        desc: "Build AI-powered workflows for lead qualification, customer communication, content generation and automated reporting.",
      },
      {
        title: "AI-Powered Growth Optimization:",
        desc: "Use AI to analyse customer journeys, identify conversion bottlenecks and develop personalized marketing strategies.",
      },
    ],
  },
];

// =========================================================================
// 3. TOOL BRAND BADGE RENDERER
// =========================================================================
function ToolBadge({ tool }) {
  switch (tool.type) {
    case "fb":
      return (
        <div className="flex items-center gap-2 font-semibold text-[#1877f2]">
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </div>
      );
    case "meta":
      return (
        <div className="flex items-center gap-1.5 font-semibold text-[#0081fb]">
          <svg className="h-5 w-6 fill-current" viewBox="0 0 24 24">
            <path d="M16.5 4.5c-2.3 0-4.3 1.2-5.5 3-1.2-1.8-3.2-3-5.5-3C2.5 4.5 0 7.2 0 10.8c0 5.6 7 11.2 11 11.2s11-5.6 11-11.2c0-3.6-2.5-6.3-5.5-6.3zm-5.5 12.2C8 14.5 3 9.8 3 7.8c0-2 1.3-3.3 2.5-3.3 1.8 0 3.5 1.5 4.5 3.5.3.6.8 1 1 1s.7-.4 1-1c1-2 2.7-3.5 4.5-3.5 1.2 0 2.5 1.3 2.5 3.3 0 2-5 6.7-8 8.9z" />
          </svg>
          <span className="text-sm font-bold text-gray-700">Meta</span>
        </div>
      );
    case "meta-bm":
      return (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
          <svg className="h-5 w-5 text-[#0081fb]" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M8 12a4 4 0 108 0 4 4 0 00-8 0z" />
          </svg>
          <span className="leading-tight">Meta Business<br />Manager</span>
        </div>
      );
    case "fb-ads":
      return (
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
          <svg className="h-5 w-5 text-[#1877f2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          <span className="leading-tight">facebook<br /><span className="text-sm text-blue-600">Ads</span></span>
        </div>
      );
    case "openai":
      return (
        <div className="flex items-center gap-1.5 font-bold text-gray-800">
          <svg className="h-5 w-5 fill-current text-gray-900" viewBox="0 0 24 24">
            <path d="M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 0010.864.887a6.012 6.012 0 00-5.753 4.17 5.998 5.998 0 00-3.998 2.9 6.046 6.046 0 00.743 7.097 5.98 5.98 0 00.51 4.911 6.051 6.051 0 006.515 2.9A5.985 5.985 0 0013.26 24a6.056 6.056 0 005.772-4.206 5.99 5.99 0 003.997-2.9 6.056 6.056 0 00-.747-7.073z" />
          </svg>
          <span className="text-sm font-semibold tracking-tight">OpenAI</span>
        </div>
      );
    case "chatgpt":
      return (
        <div className="flex items-center justify-center rounded-lg bg-[#10a37f] p-1.5 text-white shadow-sm">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
            <path d="M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 0010.864.887a6.012 6.012 0 00-5.753 4.17 5.998 5.998 0 00-3.998 2.9 6.046 6.046 0 00.743 7.097 5.98 5.98 0 00.51 4.911 6.051 6.051 0 006.515 2.9A5.985 5.985 0 0013.26 24a6.056 6.056 0 005.772-4.206 5.99 5.99 0 003.997-2.9 6.056 6.056 0 00-.747-7.073z" />
          </svg>
        </div>
      );
    case "elementor":
      return (
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#92003B]">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#92003B] text-white font-black text-[10px]">
            E
          </span>
          <span className="text-gray-800">Elementor</span>
        </div>
      );
    case "hostinger":
      return (
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#673DE6]">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-[#673DE6] text-white font-black text-[11px]">
            H
          </span>
          <span className="text-gray-900 font-extrabold tracking-tight">Hostinger</span>
        </div>
      );
    case "cloudflare":
      return (
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#F38020]">
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
          </svg>
          <span className="text-gray-800">Cloudflare</span>
        </div>
      );
    case "pagespeed":
      return (
        <div className="flex items-center gap-1 text-xs font-bold text-[#1A73E8]">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[#1A73E8] text-xs">
            ⚡
          </span>
          <span className="text-gray-800 text-[11px] sm:text-xs">PageSpeed Insights</span>
        </div>
      );
    case "canva":
      return (
        <span className="font-serif text-lg font-bold italic tracking-wide text-[#7d2ae8]">
          Canva
        </span>
      );
    case "shopify":
      return (
        <div className="flex items-center gap-1 text-sm font-bold text-[#95bf47]">
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
            <path d="M19.78 6.46L14.92 5.1c-.24-.07-.5.06-.57.3l-2.02 7.15-2.58-1.52c-.21-.12-.48-.07-.63.13l-4.5 5.86c-.15.2-.12.48.08.64l4.88 3.84c.19.15.47.12.63-.07l4.5-5.86 2.58 1.52c.21.12.48.07.63-.13l2.02-7.15c.07-.24-.06-.5-.3-.57l-.35-.11.49-1.74c.07-.24-.06-.5-.3-.57l-1.74-.49z" />
          </svg>
          <span className="text-gray-800">shopify</span>
        </div>
      );
    case "woocommerce":
      return (
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#96588a]">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-[#96588a] text-white font-black text-[10px]">
            W
          </span>
          <span className="text-gray-800">WooCommerce</span>
        </div>
      );
    case "flipkart-seller":
      return (
        <div className="flex items-center gap-1 text-xs font-bold text-gray-800">
          <span className="rounded bg-[#2874f0] px-1.5 py-0.5 text-white text-[11px] font-bold">Flipkart</span>
          <span className="text-gray-700 font-semibold text-[11px]">Seller Hub</span>
        </div>
      );
    case "gtrends":
      return (
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#4285F4]">
          <svg className="h-4 w-4 text-[#4285F4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span className="text-gray-800">Google Trends</span>
        </div>
      );
    case "razorpay":
      return (
        <div className="flex items-center gap-1 text-xs font-bold text-[#0c2340]">
          <span className="rounded bg-[#0c2340] px-1.5 py-0.5 text-[#528ff0] font-black text-[10px]">
            ₹
          </span>
          <span className="text-gray-800 font-bold">Razorpay</span>
        </div>
      );
    case "amazon":
      return (
        <div className="flex flex-col items-center">
          <span className="text-sm font-black tracking-tight text-gray-900">amazon</span>
          <span className="text-[10px] text-gray-500">seller central</span>
        </div>
      );
    case "amazon-ads":
      return (
        <div className="flex items-center gap-1 text-xs font-bold text-gray-800">
          <span className="text-sm font-black">amazon</span>
          <span className="text-xs font-semibold text-gray-500">ads</span>
        </div>
      );
    case "flipkart":
      return (
        <div className="flex items-center gap-1 text-xs font-bold text-gray-800">
          <span className="rounded bg-[#2874f0] px-1.5 py-0.5 text-white">Flipkart</span>
          <span className="text-[#1E7CBC]">Ads</span>
        </div>
      );
    case "ga":
      return (
        <div className="flex items-center gap-1 text-xs font-bold text-gray-700">
          <div className="flex items-end gap-0.5">
            <span className="h-2 w-1 rounded-sm bg-[#f9ab00]" />
            <span className="h-3.5 w-1 rounded-sm bg-[#f9ab00]" />
            <span className="h-5 w-1 rounded-sm bg-[#e37400]" />
          </div>
          <span>Google<br /><span className="text-[10px] text-gray-500">Analytics</span></span>
        </div>
      );
    case "gtm":
      return (
        <div className="flex items-center gap-1 text-xs font-bold text-[#1a73e8]">
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5-9-5-9 5z" />
          </svg>
          <span className="text-[10px] text-gray-600">Google Tag Manager</span>
        </div>
      );
    case "gads":
      return (
        <div className="flex items-center gap-1 text-xs font-bold text-gray-800">
          <span className="text-[#4285f4]">G</span>
          <span className="text-[#ea4335]">o</span>
          <span className="text-[#fbbc05]">o</span>
          <span className="text-[#4285f4]">g</span>
          <span className="text-[#34a853]">l</span>
          <span className="text-[#ea4335]">e</span>
          <span className="text-gray-600">Ads</span>
        </div>
      );
    case "gads-trans":
      return (
        <span className="text-[11px] font-semibold text-gray-600">
          Google Ads Transparency
        </span>
      );
    case "yt-ads":
      return (
        <div className="flex items-center gap-1 text-xs font-bold text-[#FF0000]">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          <span className="text-gray-800 text-[11px]">YouTube Ads</span>
        </div>
      );
    case "ms-ads":
      return (
        <div className="flex items-center gap-1 text-xs font-bold text-[#00a4ef]">
          <span className="flex h-4 w-4 items-center justify-center rounded bg-[#00a4ef] text-white font-black text-[9px]">
            M
          </span>
          <span className="text-gray-800 text-[11px]">Microsoft Ads</span>
        </div>
      );
    case "snap-ads":
      return (
        <div className="flex items-center gap-1 text-xs font-bold text-[#fffc00]">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-black text-[#fffc00] text-[10px]">
            👻
          </span>
          <span className="text-gray-800 text-[11px]">Snapchat Ads</span>
        </div>
      );
    case "tg-ads":
      return (
        <div className="flex items-center gap-1 text-xs font-bold text-[#229ED9]">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#229ED9] text-white text-[9px]">
            ✈
          </span>
          <span className="text-gray-800 text-[11px]">Telegram Ads</span>
        </div>
      );
    case "tiktok-ads":
      return (
        <div className="flex items-center gap-1 text-xs font-bold text-gray-900">
          <span className="flex h-4 w-4 items-center justify-center rounded bg-black text-white text-[9px]">
            ♪
          </span>
          <span className="text-gray-800 text-[11px]">TikTok Ads</span>
        </div>
      );
    case "meta-ad-lib":
      return (
        <div className="flex items-center gap-1 text-xs font-semibold text-gray-700">
          <span className="text-[#0081fb] font-bold">Meta</span>
          <span className="text-[11px] text-gray-600">Ad Library</span>
        </div>
      );
    case "wp":
      return (
        <div className="flex items-center gap-1 text-xs font-bold text-[#21759b]">
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.8 14.8L7.3 8.6h1.8l2 6.1 1.7-5.3-1.2-.8h2.3l1.8 5.6 1.7-5.6h1.8l-2.9 8.2h-1.8l-1.8-5.3-1.9 5.3h-1.8z" />
          </svg>
          <span className="text-gray-700">WORDPRESS</span>
        </div>
      );
    case "semrush":
      return (
        <div className="flex items-center gap-1 text-xs font-black text-[#ff642d]">
          <span>●</span>
          <span>SEMRUSH</span>
        </div>
      );
    case "moz":
      return (
        <span className="text-sm font-black tracking-widest text-[#00a8e8]">
          MOZ
        </span>
      );
    case "ubersuggest":
      return (
        <span className="text-xs font-bold text-[#ff5722]">
          Ubersuggest
        </span>
      );
    case "gsc":
      return (
        <div className="flex flex-col text-left">
          <span className="text-xs font-bold text-gray-800">Google</span>
          <span className="text-[9px] text-gray-500">Search Console</span>
        </div>
      );
    case "ahrefs":
      return (
        <span className="text-xs font-black tracking-wide text-[#0066cc]">
          ahrefs
        </span>
      );
    case "screamingfrog":
      return (
        <span className="text-xs font-bold text-[#4caf50]">
          Screamingfrog
        </span>
      );
    case "gbp":
      return (
        <div className="flex items-center gap-1 text-xs font-bold text-[#4285F4]">
          <span className="flex h-4 w-4 items-center justify-center rounded bg-[#4285F4] text-white text-[9px] font-bold">
            G
          </span>
          <span className="text-gray-800 text-[11px]">Business Profile</span>
        </div>
      );
    case "pagespeed":
      return (
        <span className="text-[10px] text-gray-500">
          PageSpeed Insights
        </span>
      );
    case "gtrends":
      return (
        <span className="text-xs font-semibold text-gray-700">
          Google Trends
        </span>
      );
    case "gtmetrix":
      return (
        <span className="text-xs font-bold text-[#0070ba]">
          GTmetrix
        </span>
      );
    case "dv360":
      return (
        <div className="flex items-center gap-1 text-xs font-bold text-[#34a853]">
          <span>Display & Video 360</span>
        </div>
      );
    case "perplexity":
      return (
        <div className="flex items-center gap-1 font-semibold text-gray-800">
          <span className="text-sm text-teal-600">✱</span>
          <span className="text-xs font-medium">perplexity</span>
        </div>
      );
    case "dalle":
      return (
        <span className="text-xs font-bold tracking-tight text-gray-900">
          DALL·E
        </span>
      );
    case "grok":
      return (
        <span className="text-sm font-black italic text-gray-900">
          Grok
        </span>
      );
    case "reels":
      return (
        <span className="text-xs font-bold text-gray-800">
          🎬 Reels
        </span>
      );
    case "instagram":
      return (
        <svg className="h-5 w-5 text-[#e4405f]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      );
    case "youtube":
      return (
        <div className="flex items-center gap-1 text-xs font-bold text-[#FF0000]">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          <span className="text-gray-800 text-[11px]">YouTube</span>
        </div>
      );
    case "linkedin":
      return (
        <div className="flex items-center gap-1 text-xs font-bold text-[#0A66C2]">
          <span className="flex h-4 w-4 items-center justify-center rounded bg-[#0A66C2] text-white text-[9px] font-black">
            in
          </span>
          <span className="text-gray-800 text-[11px]">LinkedIn</span>
        </div>
      );
    case "buffer":
      return (
        <div className="flex items-center gap-1 text-xs font-bold text-gray-800">
          <span className="flex h-4 w-4 items-center justify-center rounded bg-gray-900 text-white text-[9px] font-black">
            B
          </span>
          <span className="text-gray-800 text-[11px]">Buffer</span>
        </div>
      );
    case "n8n":
      return (
        <div className="flex items-center gap-1 text-xs font-bold text-[#EA4B71]">
          <span className="flex h-4 w-4 items-center justify-center rounded bg-[#EA4B71] text-white text-[8px] font-black">
            n8n
          </span>
          <span className="text-gray-800 text-[11px]">n8n</span>
        </div>
      );
    case "make":
      return (
        <div className="flex items-center gap-1 text-xs font-bold text-[#6D28D9]">
          <span className="flex h-4 w-4 items-center justify-center rounded bg-[#6D28D9] text-white text-[9px] font-black">
            M
          </span>
          <span className="text-gray-800 text-[11px]">Make</span>
        </div>
      );
    case "zapier":
      return (
        <div className="flex items-center gap-1 text-xs font-bold text-[#FF4A00]">
          <span className="flex h-4 w-4 items-center justify-center rounded bg-[#FF4A00] text-white text-[9px] font-black">
            _
          </span>
          <span className="text-gray-800 text-[11px]">Zapier</span>
        </div>
      );
    case "mailchimp":
      return (
        <div className="flex items-center gap-1 text-xs font-bold text-[#FFE01B]">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FFE01B] text-black text-[9px] font-bold">
            🐵
          </span>
          <span className="text-gray-800 text-[11px]">Mailchimp</span>
        </div>
      );
    case "wa-biz":
      return (
        <div className="flex items-center gap-1 text-xs font-bold text-[#25D366]">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#25D366] text-white text-[9px] font-black">
            W
          </span>
          <span className="text-gray-800 text-[11px]">WhatsApp</span>
        </div>
      );
    case "hubspot":
      return (
        <div className="flex items-center gap-1 text-xs font-bold text-[#FF7A59]">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FF7A59] text-white text-[9px] font-black">
            ●
          </span>
          <span className="text-gray-800 text-[11px]">HubSpot</span>
        </div>
      );
    case "gemini":
      return (
        <span className="flex items-center gap-1 font-bold text-blue-600">
          ✦ <span className="text-xs font-semibold text-gray-800">Gemini</span>
        </span>
      );
    case "claude":
      return (
        <span className="flex items-center gap-1 font-bold text-[#1E7CBC]">
          ✳ <span className="text-xs font-semibold text-gray-800">Claude</span>
        </span>
      );
    case "formspree":
      return (
        <span className="text-xs font-bold text-red-500">
          Formspree
        </span>
      );
    case "gsheets":
      return (
        <span className="text-xs font-medium text-emerald-700">
          Google Sheets
        </span>
      );
    case "api":
      return (
        <span className="rounded bg-gray-100 px-1 text-[10px] font-mono text-gray-700">
          API
        </span>
      );
    case "csv":
      return (
        <span className="rounded bg-gray-100 px-1 text-[10px] font-mono text-gray-700">
          CSV
        </span>
      );
    case "link":
      return (
        <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      );
    default:
      return (
        <span className="text-xs font-medium text-gray-600">
          {tool.name}
        </span>
      );
  }
}

// =========================================================================
// 4. MAIN PROJECTS SECTION COMPONENT (Single self-contained file)
// =========================================================================
export default function ProjectsSection({ id = "projects" }) {
  const filteredProjects = projectsData;

  return (
    <section id={id} className="w-full bg-[#faf9f6] px-4 py-16 font-sans sm:px-6 lg:px-8 lg:py-24 scroll-mt-20 lg:scroll-mt-24">
      <div className="mx-auto max-w-7xl">

        {/* ============================================================ */}
        {/* SECTION 1: DIGITAL MARKETING SKILLS THAT YOU'LL LEARN        */}
        {/* ============================================================ */}
        <div className="mb-16 text-center sm:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1E7CBC]/30 bg-[#1E7CBC]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#1E7CBC] mb-4">
            HIGH-DEMAND INDUSTRY SKILLS
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-gray-900 leading-tight">
            Digital Marketing Skills{" "}
            <span className="bg-gradient-to-r from-[#1E7CBC] to-blue-600 bg-clip-text text-transparent">
              That You'll Master
            </span>
          </h2>

          <div className="relative mx-auto mt-4 h-[6px] w-[240px] sm:w-[420px]">
            <img src="/bottom-line.png" alt="bottom-line" className="h-full w-full object-fill" />
          </div>

          <p className="mx-auto mt-4 max-w-3xl text-sm text-gray-600 sm:text-base lg:text-lg">
            From marketing fundamentals to advanced AI-powered strategies — build the skills that modern businesses need.
          </p>

          {/* 3-Column Skills Grid (39 skills = 13 rows x 3 columns) */}
          <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-3.5 text-left sm:grid-cols-2 lg:grid-cols-3">
            {skillsData.map((skill, index) => (
              <div
                key={index}
                className="group flex items-center gap-3.5 rounded-xl bg-white border border-gray-100 p-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(30,124,188,0.08)] hover:border-[#1E7CBC]/30 sm:p-4"
              >
                {/* Blue Skill Icon */}
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1E7CBC]/10 transition-colors group-hover:bg-[#1E7CBC]/20">
                  {skill.icon}

                  {/* AI Badge on AI Skills */}
                  {skill.isAI && (
                    <span className="absolute -top-1 -right-1 rounded bg-[#1E7CBC] px-1 py-0.2 text-[9px] font-bold uppercase text-white shadow-xs">
                      AI
                    </span>
                  )}
                </div>

                <span className="text-[15px] font-medium leading-snug text-gray-700 transition-colors group-hover:text-gray-900 sm:text-base">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Banner */}
          <div className="mt-10 flex justify-center">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-xs sm:text-base">
              <span className="flex h-2 w-2 rounded-full bg-[#1E7CBC]" />
              <span>And more through hands-on training and 15+ practical projects.</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 2: DIGITAL MARKETING LIVE PROJECTS HEADER            */}
        {/* ============================================================ */}
        <div className="mb-12 text-center sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1E7CBC]/30 bg-[#1E7CBC]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#1E7CBC] mb-4">
            Real Client Experience
          </div>

          <h2 className="mx-auto max-w-4xl text-3xl sm:text-4xl lg:text-[42px] font-extrabold leading-tight tracking-tight text-gray-900">
            Gain Real Experience with{" "}
            <span className="bg-gradient-to-r from-[#1E7CBC] to-blue-600 bg-clip-text text-transparent">
              LIVE Client Projects
            </span>
          </h2>

          <div className="relative mx-auto mt-4 h-[6px] w-[240px] sm:w-[440px]">
            <img src="/bottom-line.png" alt="bottom-line" className="h-full w-full object-fill" />
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 3: LIVE PROJECT CARDS (STICKY ON SCROLL)             */}
        {/* ============================================================ */}
        <div className="relative pb-12 sm:pb-16 lg:pb-24">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              style={{
                zIndex: index + 10,
              }}
              className="sticky top-[74px] sm:top-[78px] mb-12 sm:mb-16 lg:mb-20 last:mb-0 h-auto lg:h-[calc(100dvh-92px)] min-h-[calc(100dvh-92px)] flex flex-col justify-between rounded-[24px] sm:rounded-[28px] border border-gray-200/90 bg-white p-4 sm:p-6 lg:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-200 hover:border-[#1E7CBC]/50 overflow-hidden"
            >
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-8 flex-1 min-h-0">
                {/* Left Column: Project Overview */}
                <div className="flex flex-col justify-start gap-2.5 lg:col-span-6 min-h-0">
                  <div>
                    <span className={`block text-xs font-bold uppercase tracking-wider ${project.tagColor}`}>
                      {project.tag}
                    </span>

                    <h3 className="mt-0.5 text-xl font-bold tracking-tight text-[#333] sm:text-2xl lg:text-[25px] leading-tight">
                      {project.title}
                    </h3>

                    {project.duration && (
                      <p className="mt-1 text-xs font-semibold text-[#555] sm:text-sm">
                        Duration: {project.duration}
                      </p>
                    )}

                    <div className="mt-2.5">
                      <span className="block text-[11px] font-bold text-[#444] uppercase tracking-wider">
                        {project.learnTitle || "What You'll Learn"}
                      </span>
                      <p className="mt-0.5 text-xs sm:text-sm leading-relaxed text-[#666]">
                        {project.description}
                      </p>
                    </div>

                    {project.practicalProject && (
                      <div className="mt-3 rounded-xl bg-[#1E7CBC]/5 border border-[#1E7CBC]/20 p-2.5 sm:p-3">
                        <span className="block text-[11px] font-bold uppercase tracking-wider text-[#1E7CBC]">
                          Practical Project
                        </span>
                        <p className="mt-0.5 text-xs sm:text-[13px] font-medium leading-snug text-gray-800">
                          {project.practicalProject}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Checklist & What You'll Build */}
                <div className="flex flex-col justify-start gap-2.5 lg:col-span-6 min-h-0">
                  <div>
                    {project.checklistTitle && (
                      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                        {project.checklistTitle}
                      </span>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-1.5 sm:gap-y-2">
                      <ul className="space-y-1.5 sm:space-y-2">
                        {project.checklist.slice(0, Math.ceil(project.checklist.length / 2)).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-xs sm:text-[13px] leading-snug text-[#555]">
                            <svg
                              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1E7CBC]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-1.5 sm:space-y-2">
                        {project.checklist.slice(Math.ceil(project.checklist.length / 2)).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-xs sm:text-[13px] leading-snug text-[#555]">
                            <svg
                              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1E7CBC]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* What You'll Build (moved up right under Learning Journey) */}
                  {project.buildDesc ? (
                    <div className="mt-1 rounded-xl border border-emerald-200 bg-emerald-50/70 p-2.5 sm:p-3">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                        <svg className="h-4 w-4 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-[11px] uppercase tracking-wider sm:text-xs">{project.buildTitle || "What You'll Build"}</span>
                      </div>
                      <p className="mt-1 text-xs font-medium text-emerald-950 leading-snug">
                        {project.buildDesc}
                      </p>
                    </div>
                  ) : project.presentation ? (
                    <div className="mt-1 flex flex-col items-start gap-1">
                      <div className="flex items-center gap-2 font-bold">
                        <svg
                          className={`h-5 w-5 shrink-0 ${project.tagColor}`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="9" />
                          <circle cx="12" cy="12" r="5" />
                          <circle cx="12" cy="12" r="2" />
                        </svg>
                        <span className={`text-xs sm:text-sm ${project.tagColor}`}>
                          {project.presentation}
                        </span>
                      </div>

                      {project.footnote && (
                        <span className="text-[11px] italic text-gray-400">
                          {project.footnote}
                        </span>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Full Width: Tools Shelf (Icons Only) */}
              {project.tools && project.tools.length > 0 && (
                <div className="mt-3 shrink-0 rounded-xl sm:rounded-2xl bg-[#fafafa] px-4 py-2.5 sm:px-5 sm:py-3 border border-[#f0eee9] flex flex-wrap items-center gap-3 sm:gap-5">
                  {project.tools.map((tool, idx) => (
                    <ToolBadge key={idx} tool={tool} />
                  ))}
                </div>
              )}

              {/* Full Width: Applied AI Examples */}
              {project.aiExamples && project.aiExamples.length > 0 && (
                <div className={`mt-2.5 sm:mt-3 shrink-0 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 ${project.aiBg}`}>
                  <h4 className={`text-xs font-bold uppercase tracking-wide ${project.aiTitleColor} mb-2`}>
                    Applied AI Examples
                  </h4>

                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {project.aiExamples.map((ex, idx) => (
                      <div
                        key={idx}
                        className={`rounded-lg bg-white p-2.5 sm:p-3 shadow-2xs border-l-4 ${project.aiAccent}`}
                      >
                        <p className="text-xs leading-relaxed text-[#444]">
                          <strong className="text-[#222]">{ex.title} </strong>
                          {ex.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
