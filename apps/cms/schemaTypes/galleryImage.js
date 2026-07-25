import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'galleryImage',
    title: 'Gallery Image',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title / Alt Text',
            type: 'string',
            description: 'Used for accessibility alt text and image caption.',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'image',
            title: 'Image File',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            description: 'Optional category (e.g., "Campus Life", "Events", "Workshops") to enable filtering on the website.',
            options: {
                list: [
                    { title: 'Campus Life', value: 'Campus Life' },
                    { title: 'Events', value: 'Events' },
                    { title: 'Workshops', value: 'Workshops' },
                    { title: 'Classrooms', value: 'Classrooms' },
                ]
            }
        }),
        defineField({
            name: 'showInDome',
            title: 'Show in About Page Dome',
            type: 'boolean',
            description: 'If checked, this image will also be rendered in the 3D Globe/Dome Gallery on the About page.',
            initialValue: true,
        }),
        defineField({
            name: 'noindex',
            title: 'No Index (SEO)',
            type: 'boolean',
            description: 'If checked, search engines will be discouraged from indexing this image by serving it via CSS background (Google Images ignores CSS backgrounds).',
            initialValue: false,
        }),
        defineField({
            name: 'order',
            title: 'Display Order',
            type: 'number',
            description: 'Lower numbers appear first.',
            initialValue: 0,
        })
    ],
    orderings: [
        {
            title: 'Display Order',
            name: 'orderAsc',
            by: [{ field: 'order', direction: 'asc' }],
        },
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'category',
            media: 'image',
        },
    },
})
