export default {
  name: 'faqCategory',
  title: 'FAQ Category',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Category Title',
      type: 'string',
      description: 'e.g., General, Full-Stack Dev, Digital Marketing',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Category Description',
      type: 'text',
      description: 'Brief description shown above the FAQs in this category.',
      rows: 2,
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Higher numbers appear later.',
      initialValue: 0,
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'order',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
}
