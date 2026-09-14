import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (internal)',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      description:
        'Internal identifier for CMS/editor workflows. Not used for public author pages.',
    }),
    defineField({
      name: 'image',
      title: 'Profile Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describe the author photo for accessibility.',
        }),
      ],
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'e.g. CEO, Full Stack Developer, Marketing Head',
    }),
    defineField({
      name: 'shortBio',
      title: 'Short Bio',
      type: 'text',
      rows: 3,
      description: 'Shown on blog posts and used for EEAT. Keep it short and specific.',
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
      description:
        'Real LinkedIn profile/company URL only. Do not use generic https://linkedin.com placeholders.',
    }),
    defineField({
      name: 'expertise',
      title: 'Expertise',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      description: 'Optional. Topics this author is credible on (e.g. React, SEO, Data Science).',
    }),
    defineField({
      name: 'hasTeamProfile',
      title: 'Has Team Profile (deprecated)',
      type: 'boolean',
      description: 'Deprecated. Blog author rendering and JSON-LD no longer link to /team/[slug].',
      initialValue: false,
    }),
  ],
})
