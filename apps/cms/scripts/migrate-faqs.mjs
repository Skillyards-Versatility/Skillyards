/**
 * Migration script: imports hardcoded FAQs into Sanity.
 *
 * Usage:
 *   node apps/cms/scripts/migrate-faqs.mjs
 *
 * Environment variables (optional, for non-production datasets):
 *   SANITY_PROJECT_ID  (default: 2it7abok)
 *   SANITY_DATASET     (default: production)
 *   SANITY_TOKEN       (required for writes)
 *
 * To create a write token:
 *   https://www.sanity.io/manage → API → Tokens → Add token (editor role)
 */

import {createClient} from '@sanity/client'

const projectId = process.env.SANITY_PROJECT_ID || '2it7abok'
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

// ── Source data (from apps/website/src/data/faqs.js) ──────────────────────

const faqCategories = {
  about: {
    label: 'About SkillYards',
    description:
      'Questions about SkillYards, our learning model, OJD and OJT pathways, and career-focused training in Agra.',
    faqs: [
      {
        question: 'What is SkillYards?',
        answer:
          'SkillYards is an AI-integrated career-building institute in Agra focused on practical learning, mentorship, industry-focused training, and structured programs for students after 12th and graduates.',
      },
      {
        question: 'What makes SkillYards different from a generic training institute?',
        answer:
          'SkillYards focuses on practical learning, mentor guidance, portfolio-building, modern workflows, and career-focused preparation instead of theory-only classroom teaching.',
      },
      {
        question: 'What is the difference between OJD and OJT at SkillYards?',
        answer:
          'OJD, or On-Job Degree, is for students after 12th who want a university-recognized degree pathway along with practical skill development. OJT, or On-Job Training, is for college students, graduates, and early-career learners who want focused practical training and portfolio-building in a shorter format.',
      },
      {
        question: 'Is AI included in SkillYards programs?',
        answer:
          'Yes. SkillYards integrates practical AI-assisted workflows into learning so students understand how modern developers and marketers improve productivity, research, debugging, planning, reporting, and documentation.',
      },
      {
        question: 'Are SkillYards programs offline or online?',
        answer:
          'SkillYards programs are conducted through offline classroom-based learning at the Agra campus so students can learn with mentor support, structure, and practical interaction.',
      },
      {
        question: 'Who can join SkillYards?',
        answer:
          'SkillYards is designed for students after 12th, college students, graduates, and early-career learners who want more practical skills, better career clarity, and stronger real-world preparation.',
      },
      {
        question: 'Does SkillYards provide placement assistance?',
        answer:
          'Yes. SkillYards provides placement assistance that may include resume building, portfolio review, GitHub or profile support, LinkedIn support, mock interviews, interview preparation, career counselling, and relevant opportunity referrals where available.',
      },
      {
        question: 'Where is SkillYards located?',
        answer:
          'SkillYards is located at A-3, behind Manoj Dhaba, Bhagwan Talkies Crossing, Indra Puri, New Agra Colony, Agra, Uttar Pradesh 282005.',
      },
    ],
  },

  homepage: {
    label: 'About SkillYards',
    description: 'General questions about SkillYards, our training model, and what we offer.',
    faqs: [
      {
        question: 'What is On Job Training (OJT)?',
        answer:
          "On Job Training (OJT) is a 7-9 month program where you learn full-stack development or digital marketing through live projects and real work experience. You don't need a degree - just complete the training, build your portfolio, and get placement support.",
      },
      {
        question: 'What is the On Job Degree program?',
        answer:
          'The On Job Degree combines formal university education with practical work experience, enabling you to earn a recognised degree while contributing to live industry projects.',
      },
      {
        question: 'Do you provide placement assistance?',
        answer:
          'Yes, we provide 100% placement assistance. Our network of 180+ partner companies and dedicated placement cell help students secure high-paying jobs in the IT industry.',
      },
      {
        question: 'Which technologies do you train in?',
        answer:
          'We offer comprehensive training in Full-Stack Web Development (MERN), Digital Marketing, BCA, and BBA - each with on-job training and placement support.',
      },
      {
        question: 'Is there any certification provided?',
        answer:
          'Yes, upon successful completion of the training or degree program, you receive industry-recognised certifications that are highly valued by top IT employers.',
      },
      {
        question: 'What is the duration of the training programs?',
        answer:
          'Our short-term skill courses typically range from 3 to 6 months, while the On Job Degree programs follow standard academic timelines (3 years) integrated with practical work.',
      },
      {
        question: 'Are the classes online or offline?',
        answer:
          'We offer completely offline training at our Agra campus. Our institute provides direct mentorship, code reviews, and laboratory access.',
      },
      {
        question: 'Who is eligible to join SkillYards?',
        answer:
          'Students who have completed or are pursuing their 12th, BCA, B.Tech, MCA, or any degree with a passion for IT are eligible to join our various programs.',
      },
      {
        question: 'Where is SkillYards located?',
        answer:
          'Our main centre is located at A-3, behind Manoj Dhaba, Bhagwan Talkies crossing, Indra Puri, New Agra Colony, Agra, Uttar Pradesh – 282005, India.',
      },
    ],
  },

  general: {
    label: 'General',
    description: 'About SkillYards, admissions, fees, and placement.',
    faqs: [
      {
        question: 'What are the eligibility criteria for joining SkillYards?',
        answer:
          'For skill courses (Full-Stack Dev & Digital Marketing), there is no strict eligibility - anyone with basic computer literacy can join. For degree programs (BCA & BBA), you need to have passed 12th grade with at least 50% marks.',
      },
      {
        question: "What's the difference between a Degree program and a Skill Course?",
        answer:
          "Degree programs (BCA & BBA) are 3-year university-affiliated programs that give you an accredited bachelor's degree plus on-job training. Skill Courses (Full-Stack Dev & Digital Marketing) are shorter, intensive programs focused on immediate job readiness with industry certificates and practical work. Both include placement support.",
      },
      {
        question: 'How do I enroll in a program?',
        answer:
          'Visit our Contact page or come to the campus directly. Our counsellors will guide you through the right program, seat availability, and the joining process. Enrollment is confirmed once the initial fee is paid.',
      },
      {
        question: 'Can I join mid-batch?',
        answer:
          'Mid-batch joining is possible in limited cases depending on how far the batch has progressed. Contact us to check availability and get access to recorded sessions to catch up.',
      },
      {
        question: 'Is placement actually guaranteed?',
        answer:
          'No. Placement is not guaranteed. We provide placement assistance such as resume building, mock interviews, portfolio guidance, interview preparation, and relevant opportunity referrals where available.',
      },
      {
        question: 'What are the fee and EMI options?',
        answer:
          'Fee and EMI options vary by program. For Digital Marketing OJT, the full fee is ₹35,000 and installment options are available starting from ₹5.5k/month. Contact us for the latest plan for any program.',
      },
      {
        question: 'What payment modes are accepted?',
        answer:
          'We accept UPI, bank transfer, cash, and debit/credit card at our campus. Digital payments can be made via UPI or bank transfer after confirming your seat.',
      },
      {
        question: 'Can I switch programs after joining?',
        answer:
          'Program switches are evaluated case-by-case within the first 2 weeks of joining. After that, seat allocation and scheduling make switches difficult. We strongly recommend attending a counselling session before enrolling to make the right choice from the start.',
      },
      {
        question: 'Are the programs available online?',
        answer:
          'All our programs are exclusively offline at our Agra campus. We believe in hands-on training to provide the best learning environment and direct mentorship.',
      },
      {
        question: 'What if I miss classes?',
        answer:
          'All sessions are recorded and shared with enrolled students. Our mentors also hold weekly doubt-clearing sessions. For degree programs, we follow the university attendance policy (minimum 75% attendance required).',
      },
    ],
  },

  ojt: {
    label: 'On-Job Training',
    description: "Everything about SkillYards' AI-integrated On-Job Training programs in Agra.",
    faqs: [
      {
        question: 'What is an On-Job Training (OJT) program?',
        answer:
          'OJT programs at SkillYards focus on practical, project-based learning designed to help students build job-ready skills through mentor guidance, practical assignments, and portfolio work.',
      },
      {
        question: 'Which OJT programs are available at SkillYards?',
        answer:
          'SkillYards currently offers Full-Stack Web Development OJT and Digital Marketing OJT.',
      },
      {
        question: 'Are these OJT programs offline or online?',
        answer:
          'Both OJT programs are conducted through offline classroom training at the SkillYards Agra campus.',
      },
      {
        question: 'Is AI included in these OJT programs?',
        answer:
          'Yes. Both programs include practical AI-assisted workflows alongside core learning fundamentals.',
      },
      {
        question: 'Who can join these OJT programs?',
        answer:
          'These programs are best suited for college students, graduates, and early-career learners. Serious 12th-pass students, working professionals, and career switchers can also join.',
      },
      {
        question: 'What kind of practical work do students do?',
        answer:
          'Students work on mentor-guided projects, practical exercises, portfolio work, GitHub/workflow practice, reporting exercises, and AI-assisted productivity tasks.',
      },
      {
        question: 'Does SkillYards provide placement assistance?',
        answer:
          'Yes. Placement assistance includes resume building, portfolio review, GitHub/profile support, LinkedIn support, mock interviews, interview preparation, and career counselling.',
      },
    ],
  },

  fullstack: {
    label: 'Full-Stack Dev',
    description: 'Everything about the Full-Stack Development program.',
    faqs: [
      {
        question: 'Is this Full-Stack Web Development Course in Agra offline or online?',
        answer:
          'This is an offline classroom-based full-stack web development course at SkillYards, Agra.',
      },
      {
        question: 'What is the duration of the course?',
        answer: 'The Full-Stack Web Development OJT program duration is 6 months.',
      },
      {
        question: 'Is AI included in this full-stack course?',
        answer:
          'Yes. Students learn to use AI for code explanation, debugging support, project planning, documentation, README writing, understanding errors, productivity, and test-case thinking while still writing and understanding their own code.',
      },
      {
        question: 'Do I need prior coding experience?',
        answer:
          'No. The course starts from the basics, including HTML, CSS, JavaScript, Git/GitHub, and gradually moves into React, Node.js, Express, MongoDB, APIs, deployment, and full-stack projects.',
      },
      {
        question: 'Who can join this course?',
        answer:
          'The course is best suited for college students, graduates, and early-career learners. Serious 12th-pass students, working professionals, and career switchers can also join.',
      },
      {
        question: 'Will I build real projects?',
        answer:
          'Students work on mentor-guided practical projects, full-stack application builds, GitHub-based code practice, code reviews, deployment exercises, and portfolio-ready project work. Selected students may also get exposure to live/internal projects where available.',
      },
      {
        question: 'What does placement assistance include?',
        answer:
          'Placement assistance includes resume building, GitHub/profile review, portfolio review, mock interviews, LinkedIn support, interview preparation, career counselling, and relevant opportunity referrals where available.',
      },
      {
        question: 'What is the fee?',
        answer:
          'The full program fee is ₹50,000. Installment options are available, starting from ₹5k/month.',
      },
    ],
  },

  digitalmarketing: {
    label: 'Digital Marketing',
    description: 'Everything about the Digital Marketing program.',
    faqs: [
      {
        question: 'Is this Digital Marketing Course in Agra offline or online?',
        answer: 'This is an offline classroom-based digital marketing course at SkillYards, Agra.',
      },
      {
        question: 'What is the duration of the course?',
        answer: 'The Digital Marketing OJT program duration is 6 months.',
      },
      {
        question: 'Is AI included in this digital marketing course?',
        answer:
          'Yes. The course includes practical AI usage for keyword research, content planning, ad copy ideas, campaign planning, SEO support, reporting, analytics interpretation, and productivity. AI is taught as a marketing assistant, not as a replacement for fundamentals or strategy.',
      },
      {
        question: 'Do I need coding for digital marketing?',
        answer:
          'No. Coding is not required. You will learn marketing tools, SEO, ads, content, analytics, reporting, and practical AI workflows.',
      },
      {
        question: 'Who can join this course?',
        answer:
          'The course is best suited for college students, graduates, and early-career learners. 12th-pass students, business owners, homemakers, and working professionals can also join.',
      },
      {
        question: 'Will I work on live campaigns?',
        answer:
          'Students work on mentor-guided practical projects, SEO audits, ad campaign planning, reporting exercises, and portfolio-ready case work. Selected students may get exposure to live business campaigns where available.',
      },
      {
        question: 'Does SkillYards provide placement assistance?',
        answer:
          'Yes. Placement assistance includes resume building, portfolio review, mock interviews, LinkedIn/profile support, interview preparation, counselling, and relevant opportunity referrals where available. It is not a job guarantee.',
      },
      {
        question: 'What is the fee for the Digital Marketing Course?',
        answer:
          'The full program fee is ₹35,000. Installment options are available, starting from ₹5.5k/month.',
      },
    ],
  },

  degrees: {
    label: 'BCA & BBA',
    description: 'About the 3-year degree programs.',
    faqs: [
      {
        question: 'What are the eligibility criteria for BCA and BBA?',
        answer:
          "Both BCA and BBA require 12th pass (any stream) with a minimum of 50% marks. There's no entrance exam - just a counselling session to ensure the program is the right fit for you.",
      },
      {
        question: 'Are BCA and BBA degrees university-recognised?',
        answer:
          "Yes. Both programs are affiliated with a recognised university. You receive a standard bachelor's degree (BCA or BBA) along with SkillYards' practical training and career support.",
      },
      {
        question: 'Do BCA and BBA programs offer placement support?',
        answer:
          'Yes. Both programs include dedicated placement support such as resume building, mock interviews, and interview preparation.',
      },
      {
        question: 'Is attendance mandatory for degree programs?',
        answer:
          'Yes. BCA and BBA are primarily offline programs with university attendance requirements. A minimum of 75% attendance is required as per university policy.',
      },
      {
        question: "Can I do BCA if I'm from an arts or commerce background?",
        answer:
          'Yes. BCA does not require a science background at 12th level - any stream is accepted as long as you meet the 50% minimum marks requirement.',
      },
      {
        question: 'What is the OJT (On-Job Training) component in degree programs?',
        answer:
          "OJT is SkillYards' signature component where you work on mentor-guided practical projects alongside your academic coursework. This helps you build hands-on skills beyond the university syllabus.",
      },
    ],
  },

  support: {
    label: 'Support',
    description: 'Technical help, LMS access, and administrative queries.',
    faqs: [
      {
        question: "I can't access my student portal / LMS. What do I do?",
        answer:
          "Try resetting your password first. If the issue persists, WhatsApp or email us with your enrollment ID and we'll restore access within a few hours.",
      },
      {
        question: 'Where can I find recorded sessions?',
        answer:
          "Recorded sessions are uploaded to the LMS within 24 hours of each class. Check the 'Recordings' section under your enrolled course. If a recording is missing, contact your batch coordinator.",
      },
      {
        question: 'How do I get a payment receipt or invoice?',
        answer:
          'A receipt is issued at the time of payment. If you need a duplicate receipt or a formal invoice for reimbursement, email us with your enrollment details.',
      },
      {
        question: 'What does the placement process look like?',
        answer:
          'Placement prep starts early - resume building, LinkedIn optimisation, and mock interviews. In the final phase, we support interview preparation and share opportunities where available, without guaranteeing outcomes.',
      },
    ],
  },

  test: {
    label: 'Skill Test',
    description: 'About the free 10-minute skill assessment.',
    faqs: [
      {
        question: 'Is the skill test really free?',
        answer:
          'Yes, completely free. There is no payment, no subscription, and no catch. You take the test and get your score at zero cost.',
      },
      {
        question: 'How long does the test take?',
        answer:
          'The test has 20–25 multiple choice questions and is designed to be completed in under 10 minutes. Most students finish in 6–8 minutes.',
      },
      {
        question: 'Do I need any coding experience to take the test?',
        answer:
          'No coding is required. The test is multiple choice - you just need a basic familiarity with HTML, CSS, JavaScript, and SEO concepts. Beginners are welcome.',
      },
      {
        question: 'When will I receive my certificate?',
        answer:
          'Your certificate is generated instantly after you submit the test. It is emailed to the address you provide in the registration form, typically within a few minutes.',
      },
      {
        question: 'Is the certificate valid / recognised?',
        answer:
          'The certificate is issued by SkillYards and is suitable for sharing on LinkedIn, your portfolio, or your CV. It demonstrates that you have completed a verified skill assessment.',
      },
      {
        question: 'What happens if I score below 60%?',
        answer:
          "You still receive a certificate - labelled 'Beginner' - along with a personalised recommendation for which SkillYards program would help you reach the next level. There is no fail.",
      },
      {
        question: 'Can I retake the test?',
        answer:
          'Yes, you can retake the test after 7 days. We encourage you to revisit the topics you found challenging and come back for a better score.',
      },
      {
        question: 'Will SkillYards contact me after the test?',
        answer:
          'Our counselling team may reach out with a program recommendation based on your score - but only once, and only to help. You can opt out at any time.',
      },
    ],
  },
}

// ── Helpers ─────────────────────────────────────────────────────────────

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

// ── Main ────────────────────────────────────────────────────────────────

async function main() {
  console.log('Starting FAQ migration...\n')
  console.log(`Project: ${projectId}, Dataset: ${dataset}\n`)

  const categoryRefs = {}

  // Step 1: Upsert faqCategory documents
  console.log('── FAQ Categories ──')
  for (const [slug, cat] of Object.entries(faqCategories)) {
    const doc = {
      _type: 'faqCategory',
      title: cat.label,
      slug: {_type: 'slug', current: slug},
      description: cat.description,
      order: Object.keys(faqCategories).indexOf(slug),
    }
    const result = await upsertDocument(doc)
    categoryRefs[slug] = {_type: 'reference', _ref: result._id}
  }

  // Step 2: Upsert faq documents
  console.log('\n── FAQs ──')
  for (const [slug, cat] of Object.entries(faqCategories)) {
    for (let i = 0; i < cat.faqs.length; i++) {
      const faq = cat.faqs[i]
      const doc = {
        _type: 'faq',
        question: faq.question,
        answer: faq.answer,
        category: categoryRefs[slug],
        slug: {_type: 'slug', current: slugify(faq.question).slice(0, 120)},
        order: i,
        isActive: true,
        targetPages: getTargetPages(slug),
      }
      await upsertDocument(doc)
    }
  }

  console.log('\n✓ Migration complete!')
  console.log(`  Categories: ${Object.keys(faqCategories).length}`)
  const totalFaqs = Object.values(faqCategories).reduce((sum, c) => sum + c.faqs.length, 0)
  console.log(`  FAQs: ${totalFaqs}`)
}

function getTargetPages(slug) {
  const map = {
    homepage: ['/'],
    general: ['/programs'],
    fullstack: ['/full-stack-web-development-training-in-agra'],
    digitalmarketing: ['/digital-marketing-course-in-agra'],
    degrees: ['/programs/on-job-degree'],
    support: ['/support'],
    test: ['/10-minutes-test'],
  }
  return map[slug] || []
}

main().catch((err) => {
  console.error('\nMigration failed:', err)
  process.exit(1)
})
