import { Mail, Phone, MapPin, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const channels = [
  {
    icon: <MessageCircle size={22} />,
    label: "WhatsApp",
    value: process.env.NEXT_PUBLIC_PHONE || "+91 99999 99999",
    meta: "Usually replies in minutes",
    href: `https://wa.me/${(process.env.NEXT_PUBLIC_PHONE || "").replace(/\D/g, "")}`,
    iconClass:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
    badge: "Fastest",
    badgeClass:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
    external: true,
  },
  {
    icon: <Phone size={22} />,
    label: "Phone",
    value: process.env.NEXT_PUBLIC_PHONE || "+91 99999 99999",
    meta: "Mon – Sat · 9 AM to 7 PM",
    href: `tel:${(process.env.NEXT_PUBLIC_PHONE || "").replace(/\s/g, "")}`,
    iconClass:
      "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
    external: false,
  },
  {
    icon: <Mail size={22} />,
    label: "Email",
    value: process.env.NEXT_PUBLIC_EMAIL || "support@skillyards.in",
    meta: "Response within 24 hours",
    href: `mailto:${process.env.NEXT_PUBLIC_EMAIL || "support@skillyards.in"}`,
    iconClass:
      "bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400",
    external: false,
  },
  {
    icon: <MapPin size={22} />,
    label: "Visit Us",
    value:
      "A-3, behind Manoj Dhaba, Bhagwan Talkies crossing, Indra Puri, New Agra Colony, Agra, Uttar Pradesh 282005 – 282005",
    meta: "Mon – Sat · 9 AM to 6 PM",
    href: "https://maps.google.com/?q=SkillYards+Agra",
    iconClass:
      "bg-orange-100 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400",
    external: true,
  },
];

export default function SupportChannels() {
  return (
    <section className="bg-background py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
            Still need help?
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-foreground">
            Reach us directly
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-sm mx-auto">
            Our support team is available every weekday. Choose the channel that
            works best for you.
          </p>
        </div>

        {/* Channel cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {channels.map((ch) => (
            <a
              key={ch.label}
              href={ch.href}
              target={ch.external ? "_blank" : undefined}
              rel={ch.external ? "noopener noreferrer" : undefined}
              className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Icon + badge */}
              <div className="flex items-center justify-between">
                <div className={`rounded-xl p-3 ${ch.iconClass}`}>
                  {ch.icon}
                </div>
                {ch.badge && (
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${ch.badgeClass}`}
                  >
                    {ch.badge}
                  </span>
                )}
              </div>

              {/* Content */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  {ch.label}
                </p>
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {ch.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1.5">
                  {ch.meta}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="rounded-2xl bg-primary/5 border border-primary/15 px-6 py-10 sm:px-10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
            Free Session
          </p>
          <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-foreground mb-3">
            Want to talk to a counsellor?
          </h3>
          <p className="text-sm text-muted-foreground mb-7 max-w-sm mx-auto leading-relaxed">
            Not sure which program is right for you? Book a free 30-minute
            session with our academic counsellors.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold text-sm px-7 py-3 rounded-full hover:bg-primary/90 hover:gap-3 transition-all duration-200 group"
          >
            Book a Free Counselling Session
            <ArrowRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
