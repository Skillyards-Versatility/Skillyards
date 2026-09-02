import dynamic from "next/dynamic";
import JsonLd from "@/components/JsonLd";
import ContactForm from "@/components/ContactForm";
import Breadcrumbs from "@/components/Breadcrumbs";
import { GoogleMapEmbed } from "@/components/ui/GoogleMapEmbed";

const ContactPageInfoCard = dynamic(() => import("@/components/ContactPageInfoCard"));

import { buildSEO } from "@/lib/seo/buildSEO";
import { getAllOgImages } from "@/lib/sanity/getSiteSettings";
import { resolveOgImage } from "@/lib/seo/og";

export const revalidate = 86400;

import { getContactPageSchema } from "@/lib/seo/schema/webPageSchema";

const contactPageSchema = getContactPageSchema({
  url: "/contact",
  name: "Contact SkillYards",
  description: "Contact SkillYards for course inquiries, training support, partnerships, or general questions. We’re here to help you grow your skills and career."
});
export async function generateMetadata() {
  const ogImages = await getAllOgImages();
  return buildSEO({
  title: "Contact SkillYards",
  description:
    "Contact SkillYards for course inquiries, training support, partnerships, or general questions. We’re here to help you grow your skills and career.",
  path: "/contact",
  keywords: [
    "Contact SkillYards",
    "SkillYards contact number",
    "SkillYards support",
    "Training help",
    "SkillYards India",
    "EdTech support India",
  ],
  ogImage: resolveOgImage(ogImages, "contact", "/images/opengraph/contact-og.jpg"),
});
}

export default function ContactPage() {
  return (
    <>
      <div className="bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 transition-colors duration-500 relative selection:bg-primary/30 min-h-screen z-0 overflow-x-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_40%_at_50%_0%,#000_60%,transparent_100%)] pointer-events-none z-[-1]" />
        
        <div className="absolute top-0 left-[20%] w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-60 pointer-events-none z-[-1]" />
        <div className="absolute top-[20%] right-[15%] w-[350px] h-[350px] bg-secondary/30 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-50 pointer-events-none z-[-1]" />

        <section className="relative pt-32 sm:pt-36 pb-16 sm:pb-24 md:pt-48 md:pb-32 px-4 sm:px-6 text-center z-10">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center justify-center mb-6">
              <span className="px-4 py-1.5 text-sm font-semibold tracking-wide bg-primary/10 text-accent-foreground rounded-full border border-primary/20 backdrop-blur-md shadow-sm">
                Contact Us
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight font-playfair mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-br from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-400">
              Let's Get in Touch
            </h1>
            
            <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
              Have questions about SkillYards? Our team is ready to answer your inquiries, support your learning, and help accelerate your career.
            </p>
            
            <div className="mt-10 flex justify-center">
              <Breadcrumbs />
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24 relative z-20 -mt-6 sm:-mt-10 md:-mt-16">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-12">
            <div className="lg:col-span-5 flex flex-col h-full order-2 lg:order-1">
              <ContactPageInfoCard />
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="h-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-2xl border border-neutral-200/60 dark:border-neutral-800 shadow-2xl shadow-neutral-200/50 dark:shadow-black/60 rounded-3xl md:rounded-[2.5rem] p-6 sm:p-8 md:p-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/10 transition-colors duration-1000" />
                
                <div className="relative z-10">
                  <h2 className="text-2xl sm:text-3xl font-playfair font-bold text-neutral-900 dark:text-white mb-2">
                    Send us a message
                  </h2>
                  <p className="text-neutral-500 dark:text-neutral-400 mb-8 sm:mb-10 text-base sm:text-lg">
                    Fill out the fields below and we'll reply as soon as possible.
                  </p>
                  
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="hidden md:block max-w-7xl mx-auto px-6 pb-20 lg:pb-24 relative z-20">
          <div className="overflow-hidden rounded-[2rem] border border-neutral-200/70 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl shadow-2xl shadow-neutral-200/40 dark:shadow-black/50">
            <div className="flex items-center justify-between px-8 pt-8 pb-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                  Find Us
                </p>
                <h2 className="mt-2 text-3xl font-playfair font-bold text-neutral-900 dark:text-white">
                  Visit SkillYards in Agra
                </h2>
              </div>
            </div>

            <div className="px-8 pb-8">
              <div className="relative h-[360px] lg:h-[420px] overflow-hidden rounded-[1.5rem] border border-neutral-200 dark:border-neutral-800 shadow-lg">
                <GoogleMapEmbed
                  previewImageSrc="/images/DesktopMap.png"
                  previewImageAlt="SkillYards Agra location preview"
                />
              </div>
            </div>
          </div>
        </section>

      </div>

      <JsonLd
        data={contactPageSchema}
        id="contact-page-schema-skillyards"
      />
    </>
  );
}
