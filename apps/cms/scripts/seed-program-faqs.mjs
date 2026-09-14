/**
 * Seeds BCA and BBA program-specific FAQs into Sanity.
 *
 * These are the 10 FAQs that appear on each program landing page,
 * currently hardcoded in bca-training-program-in-agra/page.jsx
 * and bba-training-program-in-agra/page.jsx.
 *
 * Usage:
 *   SANITY_TOKEN=your-token node apps/cms/scripts/seed-program-faqs.mjs
 *
 * Environment variables:
 *   SANITY_TOKEN  (required for writes)
 *   SANITY_DATASET (default: production)
 */

import {createClient} from '@sanity/client'
import {readFileSync} from 'fs'
import {resolve, dirname} from 'path'
import {fileURLToPath} from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const projectId = '2it7abok'
const dataset = process.env.SANITY_DATASET || 'production'
const token = process.env.SANITY_TOKEN

if (!token) {
  console.error(
    'ERROR: SANITY_TOKEN environment variable is required.\n' +
      'Create a token at https://www.sanity.io/manage → API → Tokens → Add token (editor role).',
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// ── BCA FAQs ─────────────────────────────────────────────────────────

const bcaCategory = {
  slug: 'bca',
  title: 'BCA with Full-Stack Development',
  description:
    "Everything about SkillYards' BCA with Full-Stack Development program — eligibility, fees, curriculum, placements, and more.",
  order: 4,
  targetPages: ['/bca-training-program-in-agra', '/programs/on-job-degree'],
  faqs: [
    {
      question: 'What is the eligibility for BCA at SkillYards?',
      answer:
        'BCA requires 12th pass from a Science stream with a minimum of 50% aggregate marks. There is no entrance exam, just a counselling session to confirm the program is the right fit.',
      focusKeyphrase: 'BCA eligibility Agra science stream',
      order: 0,
    },
    {
      question: 'Do I need prior coding experience to join?',
      answer:
        "No. The curriculum starts from fundamentals, computer basics, networking, mathematics and C/C++, before moving into full-stack development. You don't need to know how to code before joining.",
      focusKeyphrase: 'BCA without coding experience',
      order: 1,
    },
    {
      question: 'Is the BCA degree from a recognised university?',
      answer:
        'Yes. The BCA is university-affiliated. Details of the affiliated university are shared during your free counselling session.',
      focusKeyphrase: 'BCA recognised university Agra',
      order: 2,
    },
    {
      question: 'What is the fee for the BCA program?',
      answer:
        'The program starts from Rs 5,000 per month. EMI and instalment options are available. The exact fee depends on applicable scholarships and discounts, our counsellors walk you through the full breakdown. There are no hidden fees.',
      focusKeyphrase: 'BCA fees Agra per month 5000',
      order: 3,
    },
    {
      question: 'What technologies will I learn?',
      answer:
        "You'll learn the MERN stack, MongoDB, Express.js, React and Node.js, along with HTML, CSS, JavaScript, Data Structures, Algorithms, Database Management and deployment. The full semester-by-semester breakdown is in the curriculum section above.",
      focusKeyphrase: 'BCA MERN stack technologies curriculum',
      order: 4,
    },
    {
      question: 'How is this different from a regular BCA college?',
      answer:
        'A regular BCA college focuses on theory and exams. At SkillYards, you spend the majority of each day writing code alongside your degree subjects. You graduate with a BCA degree and a portfolio of real projects, not just a certificate.',
      focusKeyphrase: 'BCA with practical coding vs regular college',
      order: 5,
    },
    {
      question: 'Are there placements for BCA students?',
      answer:
        "Yes. 15 students from our first batch are already placed at SN Digitech and 7th Triangle as Frontend and Full-Stack Developers at an average package of Rs 5.5 LPA. We're a young institute and we share real numbers, not inflated ones.",
      focusKeyphrase: 'BCA placements Agra 5.5 LPA',
      order: 6,
    },
    {
      question: 'What if I fail a university exam?',
      answer:
        "We support you through re-attempts. Your coding training continues regardless, one exam setback doesn't stop your progress with us.",
      focusKeyphrase: 'BCA exam failure support policy',
      order: 7,
    },
    {
      question: 'When does the next batch start?',
      answer:
        'August 2026. Each batch is limited to 35 seats. Once seats are filled, the next intake is a full year away.',
      focusKeyphrase: 'BCA batch start date August 2026',
      order: 8,
    },
    {
      question: "I'm not from a Science background, can I still join?",
      answer:
        "BCA requires a Science background at 12th level. If you're from Commerce or Arts, our BBA with Digital Marketing program is open to any stream. <a href='/programs/on-job-degree' class='font-bold text-primary underline underline-offset-4 hover:opacity-80'>Compare both programs</a>.",
      focusKeyphrase: 'BCA science stream required 12th',
      order: 9,
    },
  ],
}

// ── BBA FAQs ─────────────────────────────────────────────────────────

const bbaCategory = {
  slug: 'bba',
  title: 'BBA with Digital Marketing',
  description:
    "Everything about SkillYards' BBA with Digital Marketing program — eligibility, fees, curriculum, placements, and more.",
  order: 5,
  targetPages: ['/bba-training-program-in-agra', '/programs/on-job-degree'],
  faqs: [
    {
      question: "Can I join BBA if I'm from an Arts or Science background?",
      answer:
        'Yes. The BBA program is open to students from any stream, Science, Commerce or Arts. As long as you passed 12th with at least 50% marks, you are eligible. No prior business knowledge is needed.',
      focusKeyphrase: 'BBA eligibility any stream Arts Science Commerce',
      order: 0,
    },
    {
      question: 'Is the BBA degree from a recognised university?',
      answer:
        "Yes. The BBA is a university-affiliated degree. You will receive a standard bachelor's degree upon completion, which qualifies you for jobs and higher studies that require a graduate degree.",
      focusKeyphrase: 'BBA recognised university Agra',
      order: 1,
    },
    {
      question: 'What is the fee for the BBA program?',
      answer:
        'Fees start at Rs 5,000 per month. Exact fee structure depends on the payment plan you choose. EMI and instalment options are available. Contact us for a detailed breakdown.',
      focusKeyphrase: 'BBA fees Agra per month 5000',
      order: 2,
    },
    {
      question: 'What Digital Marketing tools will I learn?',
      answer:
        'You will work with Google Search Console, Google Analytics, Google Ads (Search and Display), Meta Ads Manager, Ahrefs (or Semrush), WordPress, Canva, and more. The full list is in the curriculum above.',
      focusKeyphrase: 'BBA digital marketing tools SEO Google Ads',
      order: 3,
    },
    {
      question: 'How is this different from a regular BBA college in Agra?',
      answer:
        'A regular BBA teaches theory and awards a degree. This program adds practical Digital Marketing training every day alongside your degree. You graduate with both a BBA degree and hands-on skills in SEO, Google Ads, Meta Ads, and social media marketing.',
      focusKeyphrase: 'BBA with practical digital marketing training',
      order: 4,
    },
    {
      question: 'Are there placements for BBA students?',
      answer:
        'Our first BBA batch is still ongoing, so we do not have placement numbers to share yet. Placement support starts from your second year, resume building, mock interviews and direct referrals when you are ready.',
      focusKeyphrase: 'BBA placements support Agra',
      order: 5,
    },
    {
      question: 'Do I need any prior knowledge of marketing or business?',
      answer:
        'None at all. The program starts from the basics. If you are curious about how businesses work and want to learn Digital Marketing from scratch, you have everything you need to start.',
      focusKeyphrase: 'BBA no prior marketing knowledge needed',
      order: 6,
    },
    {
      question: 'What if I fail a university exam?',
      answer:
        'University exams can be retaken in the next semester. Our academic mentors help you prepare with regular tests and doubt sessions. The goal is to make sure you pass, not just to cover the syllabus.',
      focusKeyphrase: 'BBA exam failure support retake',
      order: 7,
    },
    {
      question: 'When does the next batch start?',
      answer:
        'The next batch starts in August 2026. There are 35 seats available. Once the batch is full, the next intake is a year away.',
      focusKeyphrase: 'BBA batch start date August 2026',
      order: 8,
    },
    {
      question: "I'm interested in coding, not marketing, should I do BCA instead?",
      answer:
        "If you enjoy coding and want to build software, BCA with Full-Stack Development is a better fit. <a href='/programs/on-job-degree' class='font-bold text-primary underline underline-offset-4 hover:opacity-80'>Compare both programs</a>.",
      focusKeyphrase: 'BCA vs BBA coding vs marketing',
      order: 9,
    },
  ],
}
const categories = [bcaCategory, bbaCategory]

// ── Helpers ─────────────────────────────────────────────────────────

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

async function upsertDocument(doc) {
  const slug = doc.slug?.current
  const existing = slug
    ? await client.fetch(`*[_type == $type && slug.current == $slug][0]{_id}`, {
        type: doc._type,
        slug,
      })
    : null

  try {
    if (existing) {
      const result = await client.patch(existing._id).set(doc).commit()
      const label = doc.title || doc.question?.slice(0, 60)
      console.log(`  ~ Updated ${doc._type}: "${label}"`)
      return result
    }
    const result = await client.create(doc)
    const label = doc.title || doc.question?.slice(0, 60)
    console.log(`  ✓ Created ${doc._type}: "${label}"`)
    return result
  } catch (err) {
    const label = doc.title || doc.question?.slice(0, 60)
    console.error(`  ✗ Failed ${doc._type}: "${label}" — ${err.message}`)
    throw err
  }
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log('\n── Seeding BCA & BBA Program FAQs into Sanity ──\n')
  console.log(`Project: ${projectId}, Dataset: ${dataset}\n`)

  const categoryRefs = {}

  // Step 1: Upsert faqCategory documents
  console.log('── FAQ Categories ──')
  for (const cat of categories) {
    const doc = {
      _type: 'faqCategory',
      title: cat.title,
      slug: {_type: 'slug', current: cat.slug},
      description: cat.description,
      order: cat.order,
    }
    const result = await upsertDocument(doc)
    categoryRefs[cat.slug] = {_type: 'reference', _ref: result._id}
  }

  // Step 2: Upsert faq documents
  console.log('\n── FAQs ──')
  for (const cat of categories) {
    for (const faq of cat.faqs) {
      const doc = {
        _type: 'faq',
        question: faq.question,
        answer: faq.answer,
        category: categoryRefs[cat.slug],
        slug: {
          _type: 'slug',
          current: slugify(faq.question).slice(0, 120),
        },
        order: faq.order,
        isActive: true,
        focusKeyphrase: faq.focusKeyphrase,
        targetPages: cat.targetPages,
      }
      await upsertDocument(doc)
    }
  }

  // Summary
  console.log('\n── Summary ──')
  for (const cat of categories) {
    console.log(`  ${cat.title}: ${cat.faqs.length} FAQs`)
  }
  const total = categories.reduce((s, c) => s + c.faqs.length, 0)
  console.log(`  Total: ${total} FAQs\n`)
  console.log('✓ Done! You can now use these FAQs in the Sanity CMS.')
  console.log('  Next: Update page.jsx to fetch from Sanity instead of hardcoded data.\n')
}

main().catch((err) => {
  console.error('\nMigration failed:', err)
  process.exit(1)
})
