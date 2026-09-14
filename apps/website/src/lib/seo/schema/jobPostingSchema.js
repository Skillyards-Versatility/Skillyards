import { ORGANIZATION_ID, PRIMARY_LOCATION_ID } from "./global";

export const getJobPostingSchema = (job) => {
  if (!job) return null;

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    ...(job.description && { description: job.description }),
    datePosted: job.datePosted || new Date().toISOString(),
    ...(job.validThrough && { validThrough: job.validThrough }),
    employmentType: job.employmentType || "FULL_TIME",
    hiringOrganization: {
      "@id": ORGANIZATION_ID,
    },
    skills: job.skills || "Communication, Technical Proficiency, Teamwork",
    responsibilities:
      job.responsibilities ||
      "Execute projects, maintain quality, collaborate with teams",
    experienceRequirements: job.experience || "Entry Level",
    jobLocation: {
      "@id": PRIMARY_LOCATION_ID,
    },
  };
};
