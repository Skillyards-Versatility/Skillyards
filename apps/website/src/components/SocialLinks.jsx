import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Github,
} from "lucide-react";

export default function SocialLinks({
  label = "Follow us:",
  showLabel = true,
  className = "",
}) {
  const links = [
    {
      url: process.env.NEXT_PUBLIC_FACEBOOK_URL,
      Icon: Facebook,
      hover: "hover:bg-blue-600",
      name: "Facebook",
    },
    {
      url: process.env.NEXT_PUBLIC_TWITTER_URL,
      Icon: Twitter,
      hover: "hover:bg-sky-500",
      name: "Twitter",
    },
    {
      url: process.env.NEXT_PUBLIC_LINKEDIN_URL,
      Icon: Linkedin,
      hover: "hover:bg-blue-700",
      name: "LinkedIn",
    },
    {
      url: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
      Icon: Instagram,
      hover: "hover:bg-pink-500",
      name: "Instagram",
    },
    {
      url: process.env.NEXT_PUBLIC_YOUTUBE_URL,
      Icon: Youtube,
      hover: "hover:bg-red-600",
      name: "YouTube",
    },
    {
      url: process.env.NEXT_PUBLIC_GITHUB_URL,
      Icon: Github,
      hover: "hover:bg-neutral-900 dark:hover:bg-white dark:hover:text-black",
      name: "GitHub",
    },
  ].filter((item) => Boolean(item.url));

  if (!links.length) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          {label}
        </span>
      )}

      {links.map(({ url, Icon, hover, name }, index) => (
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={name}
          title={name}
          className={`flex shrink-0 h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition dark:bg-neutral-800 dark:text-neutral-400 ${hover} hover:text-white`}
        >
          <Icon className="h-4 w-4 sm:h-4 sm:w-4" />
        </a>
      ))}
    </div>
  );
}
