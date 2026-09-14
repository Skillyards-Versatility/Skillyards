export default {
  name: 'batch',
  title: 'Batch Information',
  type: 'document',
  fields: [
    {
      name: 'program',
      title: 'Program Name',
      type: 'string',
      description: 'e.g., BCA, BBA, Full-Stack Dev',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'nextBatch',
      title: 'Next Batch Date',
      type: 'string',
      description: 'e.g., July 2026',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'e.g., 3 Years, 6 Months',
    },
    {
      name: 'fee',
      title: 'Fee Details',
      type: 'string',
      description: 'e.g., Contact us, Starting ₹25,000',
    },
    {
      name: 'image',
      title: 'Batch Card Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Cover image for batch cards on website.',
    },
    {
      name: 'emiAvailable',
      title: 'EMI Available',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'seatsLeft',
      title: 'Seats Remaining',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    },
    {
      name: 'ctaLink',
      title: 'CTA Link',
      type: 'string',
      initialValue: '/contact',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Higher numbers appear later',
      initialValue: 0,
    },
  ],
  preview: {
    select: {
      title: 'program',
      subtitle: 'nextBatch',
      media: 'image',
    },
  },
}
