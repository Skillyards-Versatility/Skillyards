export default {
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    {
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule) => Rule.required().min(10).max(200),
      description: 'The question as it will appear on the website.',
    },
    {
      name: 'answer',
      title: 'Answer',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required().min(20),
      description: 'The answer. Can include basic HTML for links or lists.',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'faqCategory'}],
      validation: (Rule) => Rule.required(),
      description: 'Which category does this FAQ belong to?',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'question',
        maxLength: 120,
      },
      description: 'Unique identifier. Auto-generated from the question.',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first within the category.',
      initialValue: 0,
    },
    {
      name: 'focusKeyphrase',
      title: 'Focus Keyphrase',
      type: 'string',
      description: 'The primary keyword this FAQ should rank for (SEO).',
    },
    {
      name: 'targetPages',
      title: 'Target Pages',
      type: 'array',
      of: [{type: 'string'}],
      description:
        'Which pages should show this FAQ? e.g. ["/", "/full-stack-web-development-training-in-agra"]',
      options: {
        layout: 'tags',
      },
    },
    {
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Uncheck to hide this FAQ without deleting it.',
    },
  ],
  preview: {
    select: {
      title: 'question',
      subtitle: 'category.title',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Untitled FAQ',
        subtitle: subtitle ? `Category: ${subtitle}` : 'No category',
      }
    },
  },
  orderings: [
    {
      title: 'Category, then Order',
      name: 'categoryOrder',
      by: [
        {field: 'category->title', direction: 'asc'},
        {field: 'order', direction: 'asc'},
      ],
    },
  ],
}
