import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'teamMember',
    title: 'Team Member',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: 'name', maxLength: 96 },
        }),
        defineField({
            name: 'role',
            title: 'Role',
            type: 'string',
        }),
        defineField({
            name: 'bio',
            title: 'Bio',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'specialization',
            title: 'Specialization',
            type: 'string',
            description: 'e.g. "Backend & Systems Design", "Digital Marketing Strategy"',
        }),
        defineField({
            name: 'image',
            title: 'Profile Image',
            type: 'image',
            options: { hotspot: true },
            fields: [
                defineField({
                    name: 'alt',
                    title: 'Alt Text',
                    type: 'string',
                }),
            ],
        }),
        defineField({
            name: 'imageClassName',
            title: 'Image CSS Class Override',
            type: 'string',
            description: 'Optional CSS classes for the image (object-position, scale, etc.)',
        }),
        defineField({
            name: 'badge',
            title: 'Badge',
            type: 'string',
            description: 'e.g. "Leadership", "Core", "Ops"',
        }),
        defineField({
            name: 'socials',
            title: 'Social Links',
            type: 'object',
            fields: [
                defineField({ name: 'linkedin', title: 'LinkedIn URL', type: 'url' }),
                defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
                defineField({ name: 'twitter', title: 'Twitter URL', type: 'url' }),
            ],
        }),
        defineField({
            name: 'groups',
            title: 'Display Groups',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'Leadership', value: 'leadership' },
                    { title: 'Engineering', value: 'engineering' },
                    { title: 'Operations & Sales', value: 'operations' },
                    { title: 'Carousel (About page)', value: 'carousel' },
                    { title: 'BCA Educators', value: 'bcaEducators' },
                    { title: 'BBA Educators', value: 'bbaEducators' },
                    { title: 'DGM Educators', value: 'dgmEducators' },
                    { title: 'FSD Educators', value: 'fsdEducators' },
                ],
            },
            description: 'Which sections of the site should this member appear in?',
        }),
        defineField({
            name: 'noindex',
            title: 'No Index (SEO)',
            type: 'boolean',
            description: 'If checked, this team member\'s profile page will NOT be indexed by search engines.',
            initialValue: false,
        }),
        defineField({
            name: 'order',
            title: 'Display Order',
            type: 'number',
            description: 'Lower numbers appear first.',
        }),
    ],
    orderings: [
        {
            title: 'Display Order',
            name: 'orderAsc',
            by: [{ field: 'order', direction: 'asc' }],
        },
    ],
})
