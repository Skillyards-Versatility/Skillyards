const POST_CARD_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  coverImage,
  publishedAt,
  contentType,
  category,
  "parentPillar": parentPillar->{
    title,
    "slug": slug.current,
    contentType
  },
  author->{
    name,
    image,
    role,
    shortBio,
    linkedinUrl
  },
  "tags": tags[]->{
    title,
    "slug": slug.current
  }
`;

export const POSTS_QUERY = `
*[_type == "post"] | order(publishedAt desc){
${POST_CARD_FIELDS}
}
`;

export const HOMEPAGE_POSTS_QUERY = `
*[_type == "post"] | order(publishedAt desc)[0...3]{
${POST_CARD_FIELDS}
}
`;

export const POST_BY_SLUG_QUERY = `
*[_type == "post" && slug.current == $slug][0]{
  _id,
  _updatedAt,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  coverImage,
  content,
  contentType,
  seoTitle,
  seoKeywords,
  category,
  noIndex,
  newsType,
  sourceName,
  sourceLanguage,
  sourceDate,
  sourceUrl,
  clippingImage,
  englishSummary,
  author->{
    name,
    image,
    role,
    shortBio,
    linkedinUrl
  },
  "tags": tags[]->{
    title,
    "slug": slug.current
  },
  "parentPillar": parentPillar->{
    _id,
    title,
    "slug": slug.current,
    contentType
  },
  relatedMoneyPages[]{
    title,
    path,
    linkContext
  },
  "siblingArticles": siblingArticles[]->{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage,
    contentType
  }
}
`;

export const PILLAR_CHILDREN_QUERY = `
*[_type == "post" && defined(parentPillar->slug.current) && parentPillar->slug.current == $slug]
| order(contentType asc, publishedAt desc){
${POST_CARD_FIELDS}
}
`;

export const FEATURED_PILLARS_QUERY = `
*[_type == "post" && contentType in ["pillar-brand", "pillar-sub"]]
| order(publishedAt desc)[0...4]{
${POST_CARD_FIELDS}
}
`;

export const NEWS_POSTS_QUERY = `
*[_type == "post" && contentType == "news"]
| order(publishedAt desc)[0...4]{
${POST_CARD_FIELDS}
}
`;

export const BATCHES_QUERY = `
*[_type == "batch"] | order(order asc){
  program,
  nextBatch,
  duration,
  fee,
  image,
  emiAvailable,
  seatsLeft,
  ctaLink
}
`;

export const FAQS_BY_CATEGORY_QUERY = `
*[_type == "faqCategory" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  description,
  "faqs": *[_type == "faq" && category->_id == ^._id && isActive == true]
    | order(order asc){
    question,
    answer,
    "slug": slug.current,
    focusKeyphrase,
    targetPages
  }
}
`;

export const ALL_FAQ_CATEGORIES_QUERY = `
*[_type == "faqCategory"] | order(order asc){
  title,
  "slug": slug.current,
  description,
  "faqs": *[_type == "faq" && category->_id == ^._id && isActive == true]
    | order(order asc){
    question,
    answer,
    "slug": slug.current,
    focusKeyphrase,
    targetPages
  }
}
`;

const TEAM_MEMBER_FIELDS = `
  _id,
  name,
  "slug": slug.current,
  role,
  bio,
  specialization,
  image,
  imageClassName,
  badge,
  socials,
  groups,
  noindex,
  order
`;

export const TEAM_MEMBERS_QUERY = `
*[_type == "teamMember" && defined(groups)] | order(order asc){
${TEAM_MEMBER_FIELDS}
}
`;

export const TEAM_MEMBER_BY_SLUG_QUERY = `
*[_type == "teamMember" && slug.current == $slug][0]{
${TEAM_MEMBER_FIELDS}
}
`;

export const TEAM_MEMBERS_SLUGS_QUERY = `
*[_type == "teamMember" && defined(slug.current)]{
  "slug": slug.current
}
`;

export const GALLERY_IMAGES_QUERY = `
*[_type == "galleryImage"] | order(order asc){
  _id,
  title,
  image,
  category,
  showInDome,
  noindex,
  order
}
`;

export const POSTS_WITH_IMAGES_QUERY = `
*[_type == "post" && !noIndex && defined(slug.current)] | order(publishedAt desc){
  _id,
  _updatedAt,
  title,
  "slug": slug.current,
  noIndex,
  "coverImage": coverImage.asset->url,
  "bodyImages": content[_type == "image"].asset->url,
  "clippingImage": clippingImage.asset->url
}
`;

export const TEAM_MEMBERS_WITH_IMAGES_QUERY = `
*[_type == "teamMember" && !noindex && defined(image.asset)] | order(order asc){
  _id,
  name,
  "slug": slug.current,
  role,
  image,
  noindex
}
`;
