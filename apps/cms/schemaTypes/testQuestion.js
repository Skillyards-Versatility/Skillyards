import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'testQuestion',
  title: 'Test Question',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'Question ID',
      type: 'slug',
      options: {
        source: 'question',
        maxLength: 30,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'topic',
      title: 'Topic',
      type: 'string',
      options: {
        list: [
          { title: 'Physics', value: 'physics' },
          { title: 'Chemistry', value: 'chemistry' },
          { title: 'Biology', value: 'biology' },
          { title: 'Math', value: 'math' },
          { title: 'English', value: 'english' },
          { title: 'Accountancy', value: 'accountancy' },
          { title: 'Business', value: 'business' },
          { title: 'Economics', value: 'economics' },
          { title: 'HTML', value: 'html' },
          { title: 'CSS', value: 'css' },
          { title: 'JavaScript', value: 'javascript' },
          { title: 'React', value: 'react' },
          { title: 'Node.js', value: 'node' },
          { title: 'MongoDB', value: 'mongodb' },
          { title: 'Express', value: 'express' },
          { title: 'Python', value: 'python' },
          { title: 'Django', value: 'django' },
          { title: 'Next.js', value: 'nextjs' },
        ],
        layout: 'dropdown',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          { title: 'English', value: 'english' },
          { title: 'Hindi', value: 'hindi' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'english',
    }),
    defineField({
      name: 'question',
      title: 'Question',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'options',
      title: 'Options',
      type: 'array',
      of: [{ type: 'string' }],
      validation: Rule => Rule.required().min(2).max(6),
      description: 'At least 2 options. First option is A, second is B, etc.',
    }),
    defineField({
      name: 'correctAnswer',
      title: 'Correct Answer',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Must match one of the options exactly.',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Inactive questions are excluded from tests.',
    }),
  ],
  preview: {
    select: {
      title: 'question',
      subtitle: 'topic',
    },
    prepare({ title, subtitle }) {
      return {
        title: title ? title.substring(0, 60) + (title.length > 60 ? '...' : '') : 'Untitled',
        subtitle: subtitle || 'No topic',
      }
    },
  },
  orderings: [
    {
      title: 'Topic A–Z',
      name: 'topicAsc',
      by: [{ field: 'topic', direction: 'asc' }],
    },
  ],
})
