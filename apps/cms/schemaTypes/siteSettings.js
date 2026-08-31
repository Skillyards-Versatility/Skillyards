import { defineType, defineField } from 'sanity'

const ogImageField = (title, description = '') =>
  defineField({
    name: 'ogImage',
    title,
    type: 'image',
    options: { hotspot: true },
    description: description || 'Recommended 1200x630px. Used for social sharing previews.',
    fields: [
      defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
    ],
  })

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Internal label only.',
      initialValue: 'SkillYards Site Settings',
    }),
    defineField({
      name: 'ogImages',
      title: 'Open Graph (OG) Images',
      description:
        'Upload a 1200x630px social share preview image for each page. If a page is left empty, the site falls back to its built-in image.',
      type: 'object',
      options: { collapsed: false },
      fields: [
        { ...ogImageField('Home', 'Used on the homepage and as the default fallback.'), name: 'home' },
        { ...ogImageField('About'), name: 'about' },
        { ...ogImageField('Contact'), name: 'contact' },
        { ...ogImageField('Blog (listing)'), name: 'blog' },
        { ...ogImageField('Gallery', 'Shared by /gallery, /gallery/images and /gallery/videos.'), name: 'gallery' },
        { ...ogImageField('Programs Index', 'Shared by /programs, /programs/on-job-degree and /programs/on-job-training.'), name: 'programs' },
        { ...ogImageField('Careers'), name: 'careers' },
        { ...ogImageField('FAQs'), name: 'faqs' },
        { ...ogImageField('Testimonials'), name: 'testimonials' },
        { ...ogImageField('Success Stories'), name: 'successStories' },
        { ...ogImageField('Support'), name: 'support' },
        { ...ogImageField('HTML Sitemap'), name: 'sitemapHtml' },
        { ...ogImageField('Privacy Policy'), name: 'privacy' },
        { ...ogImageField('Refund Policy'), name: 'refund' },
        { ...ogImageField('Terms of Service'), name: 'terms' },
        { ...ogImageField('Full-Stack Course'), name: 'fullstack' },
        { ...ogImageField('Digital Marketing Course'), name: 'digitalmarketing' },
        { ...ogImageField('BCA Program'), name: 'bca' },
        { ...ogImageField('BBA Program'), name: 'bba' },
      ],
    }),
  ],
  preview: {
    select: { title: 'title' },
  },
})
