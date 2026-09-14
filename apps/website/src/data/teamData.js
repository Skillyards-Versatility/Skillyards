export const TEAM_MEMBERS = {
  // Leadership
  rahulSingh: {
    id: "rahul-singh",
    slug: "rahulsingh",
    name: "Rahul Singh",
    role: "COO",
    bio: "Focused on operations, curriculum coordination, student support, and creating smoother learning experiences that help students stay consistent and career-focused.",
    image: "/images/team/rahul-singh.webp",
    imageClassName:
      "object-top scale-[1.15] group-hover:scale-[1.25] md:group-hover:scale-[1.25]",
    badge: "Leadership",
    socials: {
      linkedin: "https://www.linkedin.com/in/rahul-singh-a90ab630/",
      instagram:
        "https://www.instagram.com/rahul_rs0310?igsh=bmpqejlqZXdsbHN5&utm_source=qr",
      twitter: "https://x.com/rsrsrahul444?s=11",
    },
  },
  suryanshUpadhyay: {
    id: "suryansh-upadhyay",
    slug: "suryanshupadhyay",
    name: "Suryansh Upadhyay",
    role: "CEO",
    bio: "Focused on building SkillYards around practical skills, structured mentorship, and career-focused learning for students after 12th and graduates.",
    image: "/images/team/suryanshSir.webp",
    badge: "Leadership",
    socials: {
      linkedin: "https://www.linkedin.com/in/suryansh-upadhyay-346a22347/",
      instagram:
        "https://www.instagram.com/suryanshupadhyay_official?igsh=MTZnaDg2Z2JyMWNneg==",
      twitter: "https://x.com/SuryanshUpad",
    },
  },

  // Engineering & Marketing
  mrigeshDeshpande: {
    id: "mrigesh-deshpande",
    name: "Mrigesh Deshpande",
    role: "Sr. Full Stack Developer",
    bio: "Full Stack Engineer focused on backend scalability, system design, and building robust real-world production systems.",
    specialization: "Backend & Systems Design",
    image: "/images/team/Mrigesh-Deshpande.webp",
    imageClassName:
      "object-center scale-[1.25] group-hover:scale-[1.35] md:group-hover:scale-[1.35]",
    badge: "Core",
    socials: {},
  },
  chakreshChakshu: {
    id: "chakresh-chakshu",
    name: "Chakresh Chakshu",
    role: "Jr. Full Stack Developer",
    bio: "React & Next.js developer obsessed with high performance, fluid motion animations, and delivering clean UX.",
    specialization: "Next.js & Frontend Architecture",
    image: "/images/team/Chakresh-Chakshu.webp",
    imageClassName:
      "object-center scale-[1.1] group-hover:scale-[1.2] md:group-hover:scale-[1.2]",
    socials: {},
  },
  neerajDang: {
    id: "neeraj-dang",
    name: "Neeraj Dang",
    role: "SEO & PPC Specialist",
    bio: "An SEO & PPC Specialist known for data analysis and strategic execution.",
    specialization: "Digital Marketing Strategy",
    image: "/images/team/Neeraj.webp",
    socials: {
      linkedin: "https://www.linkedin.com/in/neeraj-dang-70350824a",
    },
  },

  // Operations & Sales
  kaushalParihar: {
    id: "kaushal-parihar",
    name: "Kaushal Parihar",
    role: "Field Sales Executive",
    bio: "Supports student outreach and helps learners understand programs, batches, and admissions.",
    image: "/images/team/KaushalSIr.webp",
    badge: "Ops",
    socials: {
      linkedin: "https://linkedin.com",
    },
  },
  khushaliGupta: {
    id: "khushali-gupta",
    name: "Khushali Gupta",
    role: "Business Development Executive",
    bio: "Where words meet results. Spearheads outbound campaigns and deepens community engagement pipelines.",
    image: "/images/team/khushali.webp",
    socials: {
      linkedin: "https://linkedin.com",
    },
  },
  bhanuSharma: {
    id: "bhanu-sharma",
    name: "Bhanu Sharma",
    role: "Administrative Head",
    bio: "Behind the scenes leader: orchestrating systems, managing people, and laying the groundwork for success.",
    image: "/images/team/Bhanu.webp",
    socials: {
      linkedin: "https://linkedin.com",
    },
  },
  karanSinghTomar: {
    id: "karan-singh-tomar",
    name: "Karan Singh Tomar",
    role: "Business Development Associate",
    bio: "Crafts stories that drive sales and cultivates long-term relationships with institutional partners.",
    image: "/images/team/Karan.webp",
    socials: {
      linkedin: "https://linkedin.com",
    },
  },
  saurabhVerma: {
    id: "saurabh-verma",
    name: "Saurabh Verma",
    role: "Business Development Associate",
    bio: "Helps students choose the right program based on goals, background, and career interests.",
    image: "/images/team/Saurav.webp",
    socials: {
      linkedin: "https://linkedin.com",
    },
  },
  narendraSingh: {
    id: "narendra-singh",
    name: "Narendra Singh",
    role: "Digital Marketing Program Director",
    bio: "Leading the Digital Marketing Program with years of industry experience to guide students toward success.",
    image: "/images/team/Narendra-Singh.jpeg",
    imageClassName:
      "object-center scale-[1.2] group-hover:scale-[1.3] md:group-hover:scale-[1.3]",
    specialization: "Program Direction & Strategy",
    socials: {
      linkedin: "https://www.linkedin.com/in/narendra-s-singh-51522725",
    },
  },
};

// General team page groupings
export const leadershipTeam = [
  TEAM_MEMBERS.suryanshUpadhyay,
  TEAM_MEMBERS.rahulSingh,
];

export const engineeringTeam = [
  TEAM_MEMBERS.mrigeshDeshpande,
  TEAM_MEMBERS.chakreshChakshu,
  TEAM_MEMBERS.neerajDang,
  TEAM_MEMBERS.narendraSingh,
];

export const operationsTeam = [
  TEAM_MEMBERS.kaushalParihar,
  TEAM_MEMBERS.bhanuSharma,
  TEAM_MEMBERS.karanSinghTomar,
  TEAM_MEMBERS.saurabhVerma,
  TEAM_MEMBERS.khushaliGupta,
];

// Carousel / Other Team selection
export const carouselTeam = [
  TEAM_MEMBERS.mrigeshDeshpande,
  TEAM_MEMBERS.neerajDang,
  TEAM_MEMBERS.kaushalParihar,
  TEAM_MEMBERS.khushaliGupta,
  TEAM_MEMBERS.bhanuSharma,
  TEAM_MEMBERS.karanSinghTomar,
  TEAM_MEMBERS.saurabhVerma,
  TEAM_MEMBERS.narendraSingh,
  TEAM_MEMBERS.chakreshChakshu,
];

// Course specific educators
export const bcaEducators = [
  TEAM_MEMBERS.mrigeshDeshpande,
  TEAM_MEMBERS.chakreshChakshu,
];

export const bbaEducators = [
  TEAM_MEMBERS.narendraSingh,
  TEAM_MEMBERS.neerajDang,
];

export const dgmEducators = [
  TEAM_MEMBERS.narendraSingh,
  TEAM_MEMBERS.neerajDang,
];

export const fsdEducators = [
  TEAM_MEMBERS.mrigeshDeshpande,
  TEAM_MEMBERS.chakreshChakshu,
];
