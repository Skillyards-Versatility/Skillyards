import Link from "next/link";
import { sanityClient } from "@/lib/sanity/client";
import { HOMEPAGE_POSTS_QUERY } from "@/lib/sanity/queries";
import BlogCard from "@/components/blog/BlogCard";
import { HoverBorderGradient } from "../ui/hover-border-gradient";

export async function BlogSection() {
  const posts = await sanityClient.fetch(
    HOMEPAGE_POSTS_QUERY,
    {},
    { next: { revalidate: 86400 } },
  );

  const recentPosts = posts ? posts.slice(0, 3) : [];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-[1200px] mx-auto px-12 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
            Latest IT Career Tips &amp; Insights
          </h2>
          <p className="font-sans text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Explore our latest insights, tips, and guides to stay ahead in your
            IT career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((post, index) => (
            <div
              key={post._id}
              className={index < 2 ? "block" : "hidden lg:block"}
            >
              <BlogCard post={post} />
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <Link href="/blog">
            <HoverBorderGradient
              as="div"
              containerClassName="rounded-full"
              className="bg-primary text-primary-foreground px-8 py-2.5 text-sm font-semibold tracking-wide flex items-center gap-2"
            >
              View All Blogs
              <span aria-hidden="true">→</span>
            </HoverBorderGradient>
          </Link>
        </div>
      </div>
    </section>
  );
}
