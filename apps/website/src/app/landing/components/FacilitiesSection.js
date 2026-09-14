import {
  Wifi,
  Car,
  Zap,
  Camera,
  Droplet,
  Snowflake,
  Monitor,
  Projector,
  BookOpen,
  FileText,
  Coffee,
  Briefcase,
  Compass,
  HelpCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";

const GROUP_COLOR = {
  campus: "#00AEEF", // sky blue
  learning: "#1A2B4A", // navy
  support: "#F26522", // orange
};

const groups = [
  {
    id: "campus",
    title: "Campus Essentials",
    icon: Wifi,
    items: [
      {
        icon: Wifi,
        label: "Free Wi-Fi",
        description:
          "Research, upload portfolios and push code without burning your mobile data.",
      },
      {
        icon: Car,
        label: "Student & Visitor Parking",
        description:
          "Two-wheeler and car parking on-site — arrive, park, get to class.",
      },
      {
        icon: Zap,
        label: "Power Backup",
        description:
          "	Inverter backup means a power cut never ends a lab session mid-project.",
      },
      {
        icon: Camera,
        label: "CCTV Surveillance",
        description: "A monitored, secure campus throughout college hours.",
      },
      {
        icon: Droplet,
        label: "RO Drinking Water",
        description: "Clean drinking water available across the campus.",
      },
    ],
  },
  {
    id: "learning",
    title: "Learning Spaces",
    icon: Monitor,
    items: [
      {
        icon: Snowflake,
        label: "Air-Conditioned Classrooms",
        description:
          "Comfortable rooms for long practical sessions, year-round.",
      },
      {
        icon: Monitor,
        label: "Computer & Dev Lab",
        description:
          "	Development machines for coding, design, campaign work and live client projects.",
      },
      {
        icon: Projector,
        label: "Projector & Smart Classes",
        description:
          "VWatch a campaign or a codebase get built on screen, step by step.",
      },
      {
        icon: BookOpen,
        label: "Library & Reading Room",
        description:
          "Quiet space for revision, self-study and semester prep between practicals.",
      },
      {
        icon: FileText,
        label: "Free Study Material",
        description:
          "Notes, resources and project briefs included across our programs",
      },
    ],
  },
  {
    id: "support",
    title: "Student Support",
    icon: Compass,
    items: [
      {
        icon: Coffee,
        label: "Cafeteria & Refreshment Area",
        description: "A break space to recharge between classes.",
      },
      {
        icon: Briefcase,
        label: "Placement Cell",
        description:
          "A dedicated team preparing you for interviews and connecting you to hiring companies.",
      },
      {
        icon: Compass,
        label: "Free Career Counselling",
        description:
          "Free one-on-one guidance before you commit to any program — no obligation.",
      },
      {
        icon: HelpCircle,
        label: "Doubt-Clearing Support",
        description:
          "	Trainers stay available after class to work through what didn't land.",
      },
    ],
  },
];

// Derived from the same `groups` data above, so the visual list and the
// structured data can never drift out of sync — one source of truth.
export const facilitiesAmenityFeature = groups.flatMap((group) =>
  group.items.map((item) => ({
    "@type": "LocationFeatureSpecification",
    name: item.label,
    value: true,
  })),
);

/**
 * @param {boolean} renderSchema - Whether this component injects its own
 *   JSON-LD script tag. Defaults to true. If your project already renders
 *   organization-level schema elsewhere (e.g. app/layout.jsx), set this to
 *   false here and merge `facilitiesAmenityFeature` (exported above) into
 *   the `amenityFeature` field of that existing schema instead — two
 *   Organization/EducationalOrganization blocks on the same page is a
 *   duplicate-schema anti-pattern.
 */
export function FacilitiesSection({ renderSchema = true } = {}) {
  return (
    <section
      id="facilities"
      className="bg-background py-16 sm:py-24 transition-colors duration-300"
    >
      {renderSchema && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "SkillYards",
              amenityFeature: facilitiesAmenityFeature,
            }),
          }}
        />
      )}

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header — matches the eyebrow + heading pattern used across skillyards.in */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary tracking-wider uppercase mb-3">
            Campus &amp; Facilities
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
            Everything You Need on Campus, So Nothing Slows Down Your Learning
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted-foreground">
            Whether you're here for a three-year degree, a short skill program,
            or a weekend AI bootcamp, you're learning by building - writing
            code, running live campaigns, shipping real work. That takes proper
            labs, reliable power, quiet study space and mentors you can actually
            reach. Here's what our Agra campus gives every student who walks in.
          </p>
        </div>

        {/* Facility groups */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 md:grid-cols-3">
          {groups.map((group) => {
            const color = GROUP_COLOR[group.id];
            const GroupIcon = group.icon;
            return (
              <Card
                key={group.id}
                className="overflow-hidden border border-border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg"
              >
                <span
                  className="block h-1 w-full"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${color}14`, color }}
                    >
                      <GroupIcon
                        className="h-5 w-5"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">
                      {group.title}
                    </h3>
                  </div>

                  <ul className="mt-6 space-y-4">
                    {group.items.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <li key={item.label} className="flex gap-3">
                          <div
                            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                            style={{ backgroundColor: `${color}0d`, color }}
                          >
                            <ItemIcon
                              className="h-4 w-4"
                              strokeWidth={1.75}
                              aria-hidden="true"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {item.label}
                            </p>
                            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FacilitiesSection;
