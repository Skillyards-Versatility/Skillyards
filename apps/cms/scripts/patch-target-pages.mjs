/**
 * Patches targetPages on existing FAQ documents to include new pages.
 * Usage: SANITY_TOKEN=your-token node apps/cms/scripts/patch-target-pages.mjs
 */

import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '2it7abok',
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

if (!process.env.SANITY_TOKEN) {
  console.error('ERROR: SANITY_TOKEN environment variable is required.')
  process.exit(1)
}

const patches = [
  {
    categorySlug: 'degrees',
    addPage: '/programs/on-job-degree',
  },
  {
    categorySlug: 'general',
    addPage: '/programs/on-job-training',
  },
]

async function main() {
  for (const {categorySlug, addPage} of patches) {
    const faqs = await client.fetch(
      `*[_type == "faq" && category->slug.current == $slug]{_id, targetPages}`,
      {slug: categorySlug},
    )

    console.log(`\n── ${categorySlug} (${faqs.length} FAQs) → adding "${addPage}"`)

    for (const faq of faqs) {
      const existing = faq.targetPages || []
      if (existing.includes(addPage)) {
        console.log(`  ~ Already has "${addPage}", skipping`)
        continue
      }
      await client
        .patch(faq._id)
        .set({targetPages: [...existing, addPage]})
        .commit()
      console.log(`  ✓ Patched ${faq._id}`)
    }
  }

  console.log('\n✓ Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
