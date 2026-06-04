import { buildSEO } from "@/lib/seo/buildSEO";
import TeamSection from "@/components/teampage/TeamSection";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getTeamMembersByGroup } from "@/lib/sanity/getTeamMembers";

export const revalidate = 86400;

export const metadata = buildSEO({
    title: "Meet the Team | SkillYards",
    description:
        "Meet the SkillYards team — founders, engineers, and support staff dedicated to delivering industry-relevant learning and authentic real-world skill development.",
    path: "/team",
    keywords: [
        "SkillYards team",
        "SkillYards mentors",
        "SkillYards trainers",
        "engineering team",
        "SkillYards leadership",
    ],
});

export default async function TeamPage() {
    const [leadershipTeam, engineeringTeam, operationsTeam] = await Promise.all([
        getTeamMembersByGroup("leadership"),
        getTeamMembersByGroup("engineering"),
        getTeamMembersByGroup("operations"),
    ]);

    return (
        <main className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-primary">
            
            {/* Custom Hero Spline/Gradient Background */}
            <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden -z-10 pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-primary/10 blur-[120px] mix-blend-multiply opacity-70" />
                <div className="absolute top-[10%] -left-[10%] w-[600px] h-[600px] rounded-full bg-secondary/10 blur-[120px] mix-blend-multiply opacity-50" />
            </div>

            {/* Bespoke Page Hero */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                    <div className="mb-8">
                        <Breadcrumbs />
                    </div>
                    
                    <h1 className="text-2xl md:text-4xl lg:text-6xl font-black tracking-tighter text-foreground leading-[0.95] mb-6">
                        The Minds Behind <br />
                        <span className="italic text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                            SkillYards.
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                        We are a collective of engineers, founders, and community builders fiercely dedicated to closing the gap between academic theory and real-world execution.
                    </p>
                </div>
            </section>

            {/* Main Content Areas */}
            <div className="max-w-7xl mx-auto px-6 pb-32">
                
                <TeamSection
                    title="Executive Board"
                    subtitle="Setting the vision, standard, and trajectory."
                    members={leadershipTeam}
                    featured={true}
                />

                <TeamSection
                    title="Product & Engineering"
                    subtitle="Architecting the curriculums and infrastructure."
                    members={engineeringTeam}
                    featured={false}
                />

                <TeamSection
                    title="Operations & Sales"
                    subtitle="Fueling growth and supporting student journeys."
                    members={operationsTeam}
                    featured={false}
                />

            </div>
        </main>
    );
}