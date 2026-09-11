"use client";

const STORIES = [
  {
    id: 1,
    name: "Ayush Talyan",
    bg: "bg-pink-200",
    avatar: "👨🏻",
    company: "GTF Technologies",
    quote:
      "My journey from being a student at Pingmedia to landing a role at GTF Technologies, Noida, has been nothing short of remarkable. Pingmedia didn't just equip me with technical skills; they gave me a holistic understanding of the industry. The hands-on learning, real-world projects, and personalized mentorship prepared me for the challenges I now face in my role. I'm grateful for everything they've done for me.",
  },
  {
    id: 2,
    name: "Rituraj",
    bg: "bg-cyan-300",
    avatar: "👨🏽",
    company: "Tek Inspirations",
    quote:
      "When I got the opportunity to join Tek Inspirations, I knew my hard work had paid off, and Pingmedia had a major role in it. The way they integrate practical learning with theoretical knowledge gave me the edge over other candidates. Pingmedia doesn't just focus on teaching, it focuses on making you industry-ready.",
  },
  {
    id: 3,
    name: "Hem Agrawal",
    bg: "bg-yellow-200",
    avatar: "👨🏻",
    company: "R Smart Solar",
    quote:
      "Starting my own solar business was a huge leap, but Pingmedia's entrepreneurial training gave me the confidence and skills I needed to make it happen. The support I received wasn't just theoretical, it was hands-on, with practical insights into managing a business and tackling real-world challenges. Today, I'm running my own solar business.",
  },
  {
    id: 4,
    name: "Shubham Chauhan",
    bg: "bg-teal-300",
    avatar: "👨🏻",
    company: "Cosmo Experts Clinics",
    quote:
      "Breaking into the US Process was no small feat, but Pingmedia's immersive training and real-world exposure made it happen. The institute doesn't just teach you concepts from books, it prepares you to face the toughest challenges in the industry. The entire learning experience was both enriching and rewarding.",
  },
];

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function StoryCard({ story }) {
  return (
    <div className="bg-card border border-border text-card-foreground rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row gap-5 shadow-xs transition-colors duration-300">
      <div
        className={`relative w-full sm:w-44 h-40 sm:h-auto flex-shrink-0 rounded-2xl border border-border overflow-hidden flex items-center justify-center ${story.bg} transition-colors duration-300`}
      >
        <span className="text-4xl sm:text-5xl font-black text-gray-900/80 select-none">
          {getInitials(story.name)}
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-foreground text-lg mb-1">
            {story.name}
          </h3>
          <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-3">
            {story.company}
          </span>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            &ldquo;{story.quote}&rdquo;
          </p>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <span className="text-xs font-bold text-primary flex items-center gap-1">
            Placed Graduate
          </span>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Verified
          </span>
        </div>
      </div>
    </div>
  );
}

export default function SuccessStories() {
  return (
    <section className="bg-background py-16 sm:py-24 px-4 sm:px-6 relative transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary tracking-wider uppercase mb-3">
            Success Stories
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight text-center">
            What Our <span className="text-primary italic">Students</span> Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {STORIES.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </section>
  );
}