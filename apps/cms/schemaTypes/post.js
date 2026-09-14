import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'taxonomy', title: 'Taxonomy & Relationships'},
    {name: 'seo', title: 'SEO'},
    {name: 'news', title: 'SkillYards Times'},
  ],
  fields: [
    // ============================================================
    // CONTENT GROUP
    // ============================================================
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (Rule) =>
        Rule.required()
          .min(20)
          .warning('Short titles often underperform — aim for 40-60 chars')
          .max(120)
          .warning('Over 60 chars truncates in SERPs; over 120 looks spammy'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt (Meta Description)',
      type: 'text',
      group: 'content',
      rows: 3,
      validation: (Rule) =>
        Rule.required()
          .error('Excerpt is required — it becomes the meta description')
          .min(80)
          .warning('Aim for 80+ chars — shorter excerpts get poor SERP CTR')
          .max(160)
          .warning('Over 160 chars will truncate in search results'),
      description:
        'Required. Shown in search results and social shares. Sweet spot: 120-155 chars.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'content',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) =>
            Rule.required().error('Alt text is required for accessibility').min(10).max(120),
          description: 'Describe the image for screen readers and search. 10-120 chars.',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Body',
      type: 'array',
      group: 'content',
      of: [
        {type: 'block'},
        {
          type: 'image',
          options: {hotspot: true},
        },
        {
          type: 'code',
          options: {
            language: 'javascript',
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      group: 'content',
      to: [{type: 'author'}],
      validation: (Rule) => Rule.required(),
    }),

    // ============================================================
    // TAXONOMY & RELATIONSHIPS GROUP
    // ============================================================
    defineField({
      name: 'contentType',
      title: 'Content Type',
      type: 'string',
      group: 'taxonomy',
      options: {
        list: [
          {title: 'Brand Pillar (top of cluster)', value: 'pillar-brand'},
          {title: 'Sub-Pillar (under brand pillar)', value: 'pillar-sub'},
          {title: 'Cluster Article (supporting)', value: 'cluster'},
          {title: 'Comparison Piece', value: 'comparison'},
          {title: 'News / Announcement', value: 'news'},
        ],
        layout: 'radio',
      },
      initialValue: 'cluster',
      validation: (Rule) => Rule.required(),
      description:
        'Determines page template, JSON-LD schema type, and internal linking behavior. Pillars: 2500-4000 words. Clusters: 800-1800.',
    }),
    defineField({
      name: 'parentPillar',
      title: 'Parent Pillar',
      type: 'reference',
      group: 'taxonomy',
      to: [{type: 'post'}],
      options: {
        filter: 'contentType == "pillar-brand" || contentType == "pillar-sub"',
      },
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const ctype = context.document?.contentType
          if ((ctype === 'cluster' || ctype === 'pillar-sub') && !value) {
            return 'Cluster articles and sub-pillars must reference a parent pillar'
          }
          if (ctype === 'pillar-brand' && value) {
            return 'Brand pillars should not have a parent pillar'
          }
          return true
        }),
      description:
        'Required for clusters and sub-pillars. Brand pillars and news posts leave this empty.',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'taxonomy',
      of: [
        {
          type: 'reference',
          to: [{type: 'tag'}],
        },
      ],
      validation: (Rule) =>
        Rule.required()
          .min(2)
          .warning('Aim for 2-8 tags per post for proper cluster grouping')
          .max(8)
          .warning('Too many tags dilute topical signal — cap at 8'),
      description: '2-8 tags. Used for cluster grouping, tag hub pages, and related content.',
    }),
    defineField({
      name: 'relatedMoneyPages',
      title: 'Linked Money Pages',
      type: 'array',
      group: 'taxonomy',
      of: [
        {
          type: 'object',
          name: 'moneyPageLink',
          title: 'Money Page Link',
          fields: [
            defineField({
              name: 'title',
              title: 'Display Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
              description: 'How the link is shown to readers, e.g. "Explore the OJD BCA Program"',
            }),
            defineField({
              name: 'path',
              title: 'URL Path',
              type: 'string',
              validation: (Rule) =>
                Rule.required()
                  .regex(/^\/[a-z0-9\-\/]+$/, {
                    name: 'path',
                    invert: false,
                  })
                  .error(
                    'Path must start with / and contain only lowercase letters, numbers, and hyphens',
                  ),
              description:
                'Path only, e.g. /on-job-degree or /full-stack-web-development-training-in-agra',
            }),
            defineField({
              name: 'linkContext',
              title: 'Where to Display',
              type: 'string',
              options: {
                list: [
                  {title: 'Related programs block (end of post)', value: 'related-block'},
                  {title: 'Prominent CTA (within post)', value: 'cta-prominent'},
                  {title: 'Inline mention (auto-linked in body)', value: 'inline-mention'},
                ],
                layout: 'radio',
              },
              initialValue: 'related-block',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'path'},
          },
        },
      ],
      validation: (Rule) =>
        Rule.max(5).warning('More than 5 money page links per post dilutes intent'),
      description:
        'Money pages this post should link to. Each renders inline, as a related block, or as a prominent CTA.',
    }),
    defineField({
      name: 'siblingArticles',
      title: 'Related Sibling Articles',
      type: 'array',
      group: 'taxonomy',
      of: [
        {
          type: 'reference',
          to: [{type: 'post'}],
        },
      ],
      validation: (Rule) =>
        Rule.max(4).warning('Aim for 2-3 sibling articles; more than 4 dilutes attention'),
      description:
        '2-3 related cluster articles (4 max). Renders as "Read more" section at end of post.',
    }),

    // ============================================================
    // SEO GROUP
    // ============================================================
    defineField({
      name: 'seoTitle',
      title: 'SEO Title (optional override)',
      type: 'string',
      group: 'seo',
      validation: (Rule) => Rule.max(60).warning('Over 60 characters truncates in search results'),
      description:
        'Optional. Used for <title> tag and og:title. Falls back to editorial title if empty. Sweet spot: 50-60 chars.',
    }),
    defineField({
      name: 'seoKeywords',
      title: 'SEO Keywords (internal reference)',
      type: 'array',
      group: 'seo',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      validation: (Rule) =>
        Rule.max(10).warning('Aim for 3-8 focused keywords. Too many dilutes intent.'),
      description:
        'Target search queries for this post. Used in JSON-LD keywords field and as editorial reference.',
    }),
    defineField({
      name: 'category',
      title: 'Primary Category',
      type: 'string',
      group: 'seo',
      options: {
        list: [
          {title: 'OJD Program (general)', value: 'ojd-program'},
          {title: 'OJD BCA', value: 'ojd-bca'},
          {title: 'OJD BBA', value: 'ojd-bba'},
          {title: 'Full-Stack Development', value: 'full-stack'},
          {title: 'Digital Marketing', value: 'digital-marketing'},
          {title: 'Career Guidance', value: 'career-guidance'},
          {title: 'Industry News', value: 'industry-news'},
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
      description:
        'Single primary category. Used in JSON-LD articleSection and for category-based filtering.',
    }),
    defineField({
      name: 'noIndex',
      title: 'No-Index this post',
      type: 'boolean',
      group: 'seo',
      initialValue: false,
      description:
        'When true, search engines are instructed not to index this post. Use sparingly — only for thin content, test posts, or time-sensitive announcements.',
    }),

    // ============================================================
    // SKILLYARDS TIMES GROUP (visible only when contentType === "news")
    // ============================================================
    defineField({
      name: 'newsType',
      title: 'News Type',
      type: 'string',
      group: 'news',
      options: {
        list: [{title: 'Media Coverage', value: 'media-coverage'}],
        layout: 'radio',
      },
      initialValue: 'media-coverage',
      hidden: ({document}) => document?.contentType !== 'news',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.contentType === 'news' && !value) {
            return 'News Type is required for news posts'
          }
          return true
        }),
    }),
    defineField({
      name: 'sourceName',
      title: 'Newspaper / Source Name',
      type: 'string',
      group: 'news',
      hidden: ({document}) => document?.contentType !== 'news',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.contentType === 'news' && !value) {
            return 'Source Name is required for news posts'
          }
          return true
        }),
    }),
    defineField({
      name: 'sourceLanguage',
      title: 'Source Language',
      type: 'string',
      group: 'news',
      options: {
        list: [
          {title: 'Hindi', value: 'Hindi'},
          {title: 'English', value: 'English'},
          {title: 'Other', value: 'Other'},
        ],
        layout: 'dropdown',
      },
      initialValue: 'Hindi',
      hidden: ({document}) => document?.contentType !== 'news',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.contentType === 'news' && !value) {
            return 'Source Language is required for news posts'
          }
          return true
        }),
    }),
    defineField({
      name: 'sourceDate',
      title: 'Source Publication Date',
      type: 'date',
      group: 'news',
      hidden: ({document}) => document?.contentType !== 'news',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.contentType === 'news' && !value) {
            return 'Source Date is required for news posts'
          }
          return true
        }),
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source URL / E-paper Link',
      type: 'url',
      group: 'news',
      hidden: ({document}) => document?.contentType !== 'news',
    }),
    defineField({
      name: 'clippingImage',
      title: 'Newspaper Clipping Image',
      type: 'image',
      group: 'news',
      options: {hotspot: true},
      hidden: ({document}) => document?.contentType !== 'news',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required().min(10).max(120),
        }),
      ],
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.contentType === 'news' && !value) {
            return 'Clipping Image is required for news posts'
          }
          return true
        }),
    }),
    defineField({
      name: 'englishSummary',
      title: 'English Summary',
      type: 'text',
      group: 'news',
      rows: 4,
      description:
        'Write your own English summary of the newspaper coverage. Do not copy the full article word-for-word.',
      hidden: ({document}) => document?.contentType !== 'news',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.contentType === 'news' && !value) {
            return 'English Summary is required for news posts'
          }
          return true
        }),
    }),
  ],

  // ============================================================
  // PREVIEW & ORDERINGS
  // ============================================================
  preview: {
    select: {
      title: 'title',
      contentType: 'contentType',
      author: 'author.name',
      media: 'coverImage',
    },
    prepare({title, contentType, author, media}) {
      const labels = {
        'pillar-brand': 'BRAND PILLAR',
        'pillar-sub': 'SUB-PILLAR',
        cluster: 'Cluster',
        comparison: 'Comparison',
        news: 'News',
      }
      return {
        title,
        subtitle: `${labels[contentType] || ''} · by ${author || 'Unknown'}`,
        media,
      }
    },
  },

  orderings: [
    {
      title: 'Published Date, Newest First',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Content Type, then Date',
      name: 'contentTypeAndDate',
      by: [
        {field: 'contentType', direction: 'asc'},
        {field: 'publishedAt', direction: 'desc'},
      ],
    },
  ],
})
