// =========================================================================
// 1. DIGITAL MARKETING SKILLS (24 Skills across 3 Categories)
// =========================================================================
const skillsData = [
  // Column 1: Core Performance & Growth
  {
    name: "Performance Marketing",
    category: "core",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    name: "Programmatic Advertising",
    category: "core",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <rect x="2" y="5" width="20" height="14" rx="3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h2.5m-2.5 0a1.5 1.5 0 011.5-1.5h.5A1.5 1.5 0 019.5 12v0a1.5 1.5 0 01-1.5 1.5H7A1 1 0 016 12zm8-2.5v5m0-5h2a2 2 0 012 2v1a2 2 0 01-2 2h-2" />
      </svg>
    ),
  },
  {
    name: "Search Engine Optimization",
    category: "core",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <circle cx="10" cy="10" r="7" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m-8-5l3-3 2 2 4-4" />
      </svg>
    ),
  },
  {
    name: "Search Engine Marketing",
    category: "core",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9h2m-1-1v2" />
      </svg>
    ),
  },
  {
    name: "Copywriting & Creative Thinking",
    category: "core",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    name: "Problem Solving",
    category: "core",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    name: "CV and Interview Prep",
    category: "core",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    name: "Excel Reporting and Analysis",
    category: "core",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },

  // Column 2: Applied AI Skills (With AI Badges)
  {
    name: "AI & Automation Skills",
    category: "ai",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m16-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
  },
  {
    name: "LLM optimization",
    category: "ai",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    name: "Answer Engine Optimization",
    category: "ai",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
      </svg>
    ),
  },
  {
    name: "AI-Powered Audience Targeting",
    category: "ai",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    name: "Generative AI for Content",
    category: "ai",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    name: "AI Creative & Ad Generation",
    category: "ai",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: "Predictive Analytics & Forecasting",
    category: "ai",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
      </svg>
    ),
  },
  {
    name: "AI Prompt Engineering",
    category: "ai",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },

  // Column 3: Brand & Strategy Skills
  {
    name: "Brand Marketing",
    category: "strategy",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
  },
  {
    name: "Conversion Rate Optimization",
    category: "strategy",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    name: "Content Marketing",
    category: "strategy",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
  },
  {
    name: "Analytics & Data Interpretation",
    category: "strategy",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: "Social Media Marketing",
    category: "strategy",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    ),
  },
  {
    name: "Workplace Communication",
    category: "strategy",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    name: "Personal Storytelling",
    category: "strategy",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    ),
  },
  {
    name: "Interpersonal & behavioral skills",
    category: "strategy",
    icon: (
      <svg className="h-6 w-6 text-[#1E7CBC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
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
    tag: "PROJECT 1:",
    tagColor: "text-[#00a7b5]",
    title: "Meta Ads",
    duration: "15 Hours (& 15 Days of Live Campaign)",
    description:
      "You'll be creating and executing a FB and Instagram campaign for the brand Unleavables*. From the business objectives, target audience to creating media plans, ads and placements. You take the campaigns live and optimize to meet the targets.",
    checklist: [
      "Projects Briefing",
      "Meeting with the industry experts",
      "Making the campaigns live with the given budget",
      "Media Strategy Submission & Campaign Optimization",
    ],
    presentation: "Presentations and Mock Interviews",
    presentationColor: "text-[#00a7b5] border-[#00a7b5]",
    footnote: "*Brands change every batch",
    tools: [
      { name: "Facebook", type: "fb" },
      { name: "Meta", type: "meta" },
      { name: "Meta Business Manager", type: "meta-bm" },
      { name: "Facebook Ads", type: "fb-ads" },
      { name: "OpenAI", type: "openai" },
      { name: "ChatGPT", type: "chatgpt" },
      { name: "Canva", type: "canva" },
    ],
    aiBg: "bg-[#f0faf9]",
    aiAccent: "border-[#00a7b5]",
    aiTitleColor: "text-[#00a7b5]",
    aiExamples: [
      {
        title: "Persona Building with AI:",
        desc: "Mine reviews, map consumer triggers & barriers, and build detailed audience personas – cutting research time from days to hours.",
      },
      {
        title: "AI-Powered Ad Copy:",
        desc: "Generate and test multiple headline and hook variations at scale, so you always have fresh creative to fight ad fatigue.",
      },
    ],
  },
  {
    id: 2,
    tag: "PROJECT 2:",
    tagColor: "text-[#e05638]",
    title: "Ecom project",
    duration: "15 Hours (& 7 Days of Live Campaign)",
    description:
      "You'll be running live campaigns on Amazon for Seasoned Snack*. It will include creating a strategy based on business and user understanding, creating a media plan using past data, taking the campaign live on Amazon and optimizing it to meet the goals.",
    checklist: [
      "Project Briefing",
      "Meeting with the industry experts",
      "Making the campaigns live with the given budget",
      "Media Strategy Submission & Campaign Optimization",
      "Campaign Ends and Final Reports are Created",
    ],
    presentation: "Presentations and Mock Interviews",
    presentationColor: "text-[#e05638] border-[#e05638]",
    footnote: "*Brands change every batch",
    tools: [
      { name: "Shopify", type: "shopify" },
      { name: "Amazon Seller Central", type: "amazon" },
      { name: "Amazon Ads", type: "amazon-ads" },
      { name: "Flipkart Ads", type: "flipkart" },
      { name: "OpenAI", type: "openai" },
      { name: "ChatGPT", type: "chatgpt" },
      { name: "Canva", type: "canva" },
    ],
    aiBg: "bg-[#fef5f2]",
    aiAccent: "border-[#e05638]",
    aiTitleColor: "text-[#e05638]",
    aiExamples: [
      {
        title: "Listing Optimisation:",
        desc: "Analyse competitor listings, identify keyword gaps, and generate product titles and descriptions that improve search ranking.",
      },
      {
        title: "Search Term Analysis:",
        desc: "Process large search term reports, surface winning and wasteful keywords faster, and make smarter bid decisions.",
      },
    ],
  },
  {
    id: 3,
    tag: "PROJECT 3:",
    tagColor: "text-[#059669]",
    title: "Google Ads",
    duration: "15 Hours (& 7 Days of Live Campaign)",
    description:
      "You'll be creating and executing a Search campaign for the brand Unleavables*. Right from the business objectives, target audience to creating media plans, ads to bidding strategies. You take the campaigns live and optimize the performance to meet the targets.",
    checklist: [
      "Project Briefing",
      "Meeting with the industry experts",
      "Making the campaigns LIVE with the given budget",
      "Media Strategy Submission & Campaign Optimization",
    ],
    presentation: "Presentations and Mock Interviews",
    presentationColor: "text-[#059669] border-[#059669]",
    footnote: "*Brands change every batch",
    tools: [
      { name: "Google Analytics", type: "ga" },
      { name: "Google Tag Manager", type: "gtm" },
      { name: "Google Ads Keyword Planner", type: "gads" },
      { name: "Google Ads Transparency Center", type: "gads-trans" },
      { name: "OpenAI", type: "openai" },
      { name: "ChatGPT", type: "chatgpt" },
      { name: "Canva", type: "canva" },
    ],
    aiBg: "bg-[#f0faf5]",
    aiAccent: "border-[#059669]",
    aiTitleColor: "text-[#059669]",
    aiExamples: [
      {
        title: "Ad Copy at Scale:",
        desc: "Generate dozens of headline and description variations in minutes, letting you A/B test more aggressively without the manual effort.",
      },
      {
        title: "Negative Keyword Checks:",
        desc: "Scan search term reports and identify irrelevant query patterns, protecting your budget from wasted spend automatically.",
      },
    ],
  },
  {
    id: 4,
    tag: "PROJECT 4:",
    tagColor: "text-[#2563eb]",
    title: "SEO project",
    duration: "11.5 Hours (& 7 days of Performance Tracking)",
    description:
      "You'll be creating a SEO strategy for Unleavables*. This will include conducting on-page audits, technical audits and backlink audits of the website. You will also create a content strategy, create briefs for SEO optimized blogs and publish them using Wordpress.",
    checklist: [
      "Project Briefing",
      "Catchup with the experts",
      "SEO and Content Strategy Submission",
      "Blog Publishing Using Wordpress",
    ],
    presentation: "Presentations",
    presentationColor: "text-[#2563eb] border-[#2563eb]",
    footnote: "*Brands change every batch",
    tools: [
      { name: "WordPress", type: "wp" },
      { name: "SEMrush", type: "semrush" },
      { name: "Moz", type: "moz" },
      { name: "Ubersuggest", type: "ubersuggest" },
      { name: "Google Search Console", type: "gsc" },
      { name: "Ahrefs", type: "ahrefs" },
      { name: "Screaming Frog", type: "screamingfrog" },
      { name: "Google Ads", type: "gads" },
      { name: "Google PageSpeed", type: "pagespeed" },
      { name: "Google Trends", type: "gtrends" },
      { name: "GTmetrix", type: "gtmetrix" },
      { name: "Canva", type: "canva" },
    ],
    aiBg: "bg-[#f0f4ff]",
    aiAccent: "border-[#2563eb]",
    aiTitleColor: "text-[#2563eb]",
    aiExamples: [
      {
        title: "AI Content Briefs:",
        desc: "Generate structured, intent-matched content briefs in minutes. Covering headings, keywords, and competitor gaps. All before writing a single word.",
      },
      {
        title: "Answer Engine Optimisation:",
        desc: "Restructure content for Google's AI Overviews and featured snippets, so your pages rank in the new era of search.",
      },
    ],
  },
  {
    id: 5,
    tag: "PROJECT 5:",
    tagColor: "text-[#ea580c]",
    title: "Programmatic",
    duration: "10 hours",
    description:
      "You will plan a media campaign for Axis Bank. Your job is to create an end to end programmatic media plan using DV360: provide details for campaigns, line orders, insertion orders, adgroups, targeting, budget segregation, bidding strategies, and creatives.",
    checklist: [
      "Project Briefing",
      "Attempting the media plan on DV360",
      "Catchup with the experts",
      "Finalisation of media plan",
    ],
    presentation: "Presentations",
    presentationColor: "text-[#ea580c] border-[#ea580c]",
    footnote: "*Brands change every batch",
    tools: [
      { name: "Display & Video 360", type: "dv360" },
      { name: "Google Ads", type: "gads" },
      { name: "Google Trends", type: "gtrends" },
      { name: "Google Search Console", type: "gsc" },
      { name: "Canva", type: "canva" },
      { name: "OpenAI", type: "openai" },
      { name: "ChatGPT", type: "chatgpt" },
    ],
    aiBg: "bg-[#fff7ed]",
    aiAccent: "border-[#ea580c]",
    aiTitleColor: "text-[#ea580c]",
    aiExamples: [
      {
        title: "Audience Segment Modelling:",
        desc: "Identify which demographic, interest, and behavioural targeting combinations are most likely to perform for your campaign objectives.",
      },
    ],
  },
  {
    id: 6,
    tag: "PROJECT 6:",
    tagColor: "text-[#1E7CBC]",
    title: "Blog creation Projects",
    duration: "30 hours",
    description:
      "You will create SEO optimised blogs, publish them and analyse performance for two brands: Top of the funnel for SkillYards: Dissecting a brand strategy, Middle and Bottom of the funnel for Unleavables- for your own Shopify Page",
    checklist: [
      "Project briefing",
      "Creating the blog strategy",
      "Writing and Optimizing the blogs",
      "Publishing the blogs",
    ],
    presentation: "Presentations",
    presentationColor: "text-[#1E7CBC] border-[#1E7CBC]",
    footnote: "*Brands change every batch",
    tools: [
      { name: "Perplexity", type: "perplexity" },
      { name: "DALL-E", type: "dalle" },
      { name: "WordPress", type: "wp" },
      { name: "Google Search Console", type: "gsc" },
      { name: "Canva", type: "canva" },
      { name: "Google Analytics", type: "ga" },
    ],
    aiBg: null,
    aiAccent: null,
    aiTitleColor: null,
    aiExamples: [],
  },
  {
    id: 7,
    tag: "PROJECT 7:",
    tagColor: "text-[#0284c7]",
    title: "Social Media Strategy Project",
    duration: "30 hours",
    description:
      "You will create the Go-to-Market Organic Social Strategy for a Brand Launch case. You will be deciding the Campaign Idea, Campaign Stages (Pre-Launch, Launch, Post-Launch) and then executing social media posts and videos to drive the brand objective.",
    checklist: [
      "Project briefing",
      "Creating the Organic Content Strategy",
      "Making social media posts",
      "Publishing the social media posts",
    ],
    presentation: "Presentations",
    presentationColor: "text-[#0284c7] border-[#0284c7]",
    footnote: "*Brands change every batch",
    tools: [
      { name: "Grok", type: "grok" },
      { name: "ChatGPT", type: "chatgpt" },
      { name: "DALL-E", type: "dalle" },
      { name: "Canva", type: "canva" },
      { name: "Reels", type: "reels" },
      { name: "Instagram", type: "instagram" },
    ],
    aiBg: "bg-[#f0f9ff]",
    aiAccent: "border-[#0284c7]",
    aiTitleColor: "text-[#0284c7]",
    aiExamples: [
      {
        title: "Competitor Content Analysis:",
        desc: "Scan competitor social pages, identify content gaps and high-performing formats, and build a differentiated campaign strategy faster.",
      },
    ],
  },
  {
    id: 8,
    tag: "PROJECT 8:",
    tagColor: "text-[#e11d48]",
    title: "Content Creation Project",
    duration: "30 hours",
    description:
      "You will script, shoot, create edit plans, edit, and post short form videos (Instagram Reels/YT shorts) that drive objectives for 3 brands: Top of the Funnel, Bottom of the Funnel on instagram, bottom of the funnel on Linkedin",
    checklist: [
      "Project briefing",
      "Understanding user, brand and objectives",
      "Creating and Revising content",
      "Publishing Content",
    ],
    presentation: "Presentations",
    presentationColor: "text-[#e11d48] border-[#e11d48]",
    footnote: "*Brands change every batch",
    tools: [
      { name: "Grok", type: "grok" },
      { name: "ChatGPT", type: "chatgpt" },
      { name: "DALL-E", type: "dalle" },
      { name: "Canva", type: "canva" },
      { name: "Reels", type: "reels" },
      { name: "Instagram", type: "instagram" },
    ],
    aiBg: "bg-[#fff1f2]",
    aiAccent: "border-[#e11d48]",
    aiTitleColor: "text-[#e11d48]",
    aiExamples: [
      {
        title: "AI Scriptwriting:",
        desc: "Generate and stress-test video scripts across different hooks and formats.",
      },
    ],
  },
  {
    id: 9,
    tag: "PROJECT 9:",
    tagColor: "text-[#0d9488]",
    title: "Vibe Coding",
    duration: "15 Hours",
    description:
      "Learn how marketers can build real digital products using AI without traditional coding. In this project, students learn product thinking, prompting, iteration, testing, and deployment by shipping live builds including a Landing Page, Widget, and AI Intelligence Tool. The focus is not on writing code manually, but on defining problems clearly enough for AI tools to build effective solutions.",
    checklist: [
      "Product ideation & problem definition",
      "AI prompting, iteration & testing workflows",
      "Building live products with AI-assisted tools",
      "Deploying and sharing working URLs",
    ],
    presentation: "Presentations and Mock Reviews",
    presentationColor: "text-[#0d9488] border-[#0d9488]",
    footnote: "*Projects and tools may evolve with every batch",
    tools: [
      { name: "ChatGPT", type: "chatgpt" },
      { name: "OpenAI", type: "openai" },
      { name: "Gemini", type: "gemini" },
      { name: "Claude", type: "claude" },
      { name: "Google Analytics 4", type: "ga" },
      { name: "Formspree", type: "formspree" },
      { name: "Google Sheets", type: "gsheets" },
      { name: "API integrations", type: "api" },
      { name: "CSV", type: "csv" },
      { name: "Link / Webhooks", type: "link" },
    ],
    aiBg: "bg-[#f0fdfa]",
    aiAccent: "border-[#0d9488]",
    aiTitleColor: "text-[#0d9488]",
    aiExamples: [
      {
        title: "AI Landing Pages:",
        desc: "Build responsive landing pages with AI prompts, SEO optimization, and lead forms.",
      },
      {
        title: "Intelligence Tool Building:",
        desc: "Build AI-powered tools like campaign brief generators, competitor analyzers, ad copy generators, and review analyzers using APIs, prompts, and business data.",
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
            High-Demand Industry Competencies
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

          {/* 3-Column 24-Skills Grid */}
          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-4 text-left sm:grid-cols-2 lg:grid-cols-3">
            {skillsData.map((skill, index) => (
              <div
                key={index}
                className="group flex items-center gap-3.5 rounded-xl bg-white border border-gray-100 p-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(30,124,188,0.08)] hover:border-[#1E7CBC]/30 sm:p-4"
              >
                {/* Blue Skill Icon */}
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1E7CBC]/10 transition-colors group-hover:bg-[#1E7CBC]/20">
                  {skill.icon}

                  {/* AI Badge on Column 2 AI Skills */}
                  {skill.category === "ai" && (
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
        {/* SECTION 3: THE 9 LIVE PROJECT CARDS (STICKY ON SCROLL)       */}
        {/* ============================================================ */}
        <div className="relative pb-6 sm:pb-8">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              style={{
                zIndex: index + 10,
              }}
              className="sticky top-[76px] mb-8 sm:mb-10 last:mb-0 rounded-[24px] sm:rounded-[28px] border border-gray-200/90 bg-white p-6 sm:p-8 shadow-[0_6px_25px_rgba(0,0,0,0.05)] transition-all duration-200 hover:border-[#1E7CBC]/50"
            >
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
                {/* Left Column: Project Overview */}
                <div className="lg:col-span-7">
                  <span className={`block text-xs font-bold uppercase tracking-wider sm:text-sm ${project.tagColor}`}>
                    {project.tag}
                  </span>

                  <h3 className="mt-1 text-2xl font-bold tracking-tight text-[#333] sm:text-3xl">
                    {project.title}
                  </h3>

                  <p className="mt-2.5 text-sm font-semibold text-[#555] sm:text-base">
                    Duration: {project.duration}
                  </p>

                  <div className="mt-3.5">
                    <span className="block text-sm font-bold text-[#444]">
                      Description:
                    </span>
                    <p className="mt-1 text-sm leading-relaxed text-[#666] sm:text-[15px]">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Right Column: Checklist & Mock Reviews */}
                <div className="flex flex-col justify-between lg:col-span-5">
                  <ul className="space-y-2.5">
                    {project.checklist.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-[#555] sm:text-[15px]">
                        <svg
                          className="mt-0.5 h-5 w-5 shrink-0 text-[#9ca3af]"
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

                  {/* Presentations & Mock Interviews Target Badge */}
                  <div className="mt-5 flex flex-col items-start gap-1.5 sm:mt-6">
                    <div className="flex items-center gap-2.5 font-bold">
                      <svg
                        className={`h-6 w-6 shrink-0 ${project.tagColor}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <circle cx="12" cy="12" r="5" />
                        <circle cx="12" cy="12" r="2" />
                      </svg>
                      <span className={`text-sm sm:text-base ${project.tagColor}`}>
                        {project.presentation}
                      </span>
                    </div>

                    <span className="text-xs italic text-gray-400">
                      {project.footnote}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tools Used Shelf */}
              <div className="mt-6 flex flex-wrap items-center justify-start gap-3.5 rounded-2xl bg-[#fafafa] px-5 py-3.5 border border-[#f0eee9] sm:gap-6 sm:px-6">
                {project.tools.map((tool, idx) => (
                  <ToolBadge key={idx} tool={tool} />
                ))}
              </div>

              {/* Applied AI Examples (Optional Banner) */}
              {project.aiExamples && project.aiExamples.length > 0 && (
                <div className={`mt-5 rounded-2xl p-4 sm:p-6 ${project.aiBg}`}>
                  <h4 className={`text-sm font-bold uppercase tracking-wide sm:text-base ${project.aiTitleColor}`}>
                    Applied AI Examples
                  </h4>

                  <div className="mt-3 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    {project.aiExamples.map((ex, idx) => (
                      <div
                        key={idx}
                        className={`rounded-xl bg-white p-3.5 shadow-xs border-l-4 ${project.aiAccent}`}
                      >
                        <p className="text-xs leading-relaxed text-[#444] sm:text-sm">
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
