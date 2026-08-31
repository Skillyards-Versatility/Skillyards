import { MetadataRoute } from 'next';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { sanityClient } from '@/lib/sanity/client';
import { getAllTeamSlugs, getAllTeamMembers } from '@/lib/sanity/getTeamMembers';
import { getGalleryImages } from '@/lib/sanity/getGalleryImages';
import { POSTS_WITH_IMAGES_QUERY } from '@/lib/sanity/queries';
import { TEAM_PROFILES } from '@/data/teamProfiles';

const BASE_URL = 'https://www.skillyards.in';

// Paths to exclude from sitemap (private, utility, dynamic placeholders)
const EXCLUDED_PATHS = new Set([
  '/api',
  '/admin',
  '/_next',
  '/_error',
  '/unsubscribe',
  '/feedback',
  '/campaigns',
  '/test',
  '/thank-you-contact',
  '/sitemap',
  '/sitemap-html'
]);



// Dynamic route segments to skip (we'd need DB/filesystem lookups for slugs)
const DYNAMIC_SEGMENT = /^\[.+\]$/;

function walkAppDir(dir: string, basePath = ''): string[] {
  const routes: string[] = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch (e) {
    return routes;
  }

  // If this directory has a page.jsx/page.tsx/page.js, it's a route
  const hasPage = entries.some(
    (e) => e === 'page.jsx' || e === 'page.tsx' || e === 'page.js'
  );
  if (hasPage && basePath !== '/api' && !basePath.startsWith('/api/')) {
    const url = basePath || '/';
    if (!EXCLUDED_PATHS.has(url) && !shouldExclude(url)) {
      routes.push(url);
    }
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    let isDir = false;
    try {
      isDir = statSync(fullPath).isDirectory();
    } catch {
      continue;
    }
    if (!isDir) continue;
    if (entry.startsWith('_')) continue; // _components, _lib, etc.
    if (entry.startsWith('(') && entry.endsWith(')')) {
      // Route group — descend but don't add to path
      routes.push(...walkAppDir(fullPath, basePath));
      continue;
    }
    if (DYNAMIC_SEGMENT.test(entry)) continue; // skip [slug], [uuid] for now
    routes.push(...walkAppDir(fullPath, `${basePath}/${entry}`));
  }
  return routes;
}

function shouldExclude(path: string): boolean {
  for (const excluded of EXCLUDED_PATHS) {
    if (path === excluded || path.startsWith(`${excluded}/`)) return true;
  }
  return false;
}

// Static illustration/logo/icon dirs that should NOT be indexed in Google Images
const NON_PHOTO_DIRS = new Set([
  'favicons',
  'icons',
  'icons-cloud',
  'partners',
  'screenshots',
  'opengraph',
  'benefits',
  'features',
  'illustrations',
  'programmes',
  'services',
]);

// Only real photo folders from public/images get indexed
const PHOTO_DIRS = ['team', 'life'];

function listPhotoFiles(dir: string): string[] {
  try {
    return readdirSync(dir)
      .filter((f) => /\.(webp|jpe?g|png|avif)$/i.test(f))
      .sort();
  } catch {
    return [];
  }
}

// Note: In this Next.js version, sitemap `images` are plain URL strings.
// Metadata (title/caption/alt) is carried via ImageObject JSON-LD on the page instead.

// Next's sitemap serializer writes <image:loc> unescaped, so image URLs containing
// query-string ampersands (e.g. ?w=600&h=750) break XML well-formedness. Escape them.
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appDir = join(process.cwd(), 'src', 'app');
  const routes = walkAppDir(appDir);
  const uniqueRoutes = Array.from(new Set(routes)).sort();

  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = uniqueRoutes.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1.0 : path.startsWith('/blog/') ? 0.6 : 0.8,
  }));

  // 🔹 Blog dynamic routes (with images)
  let blogUrls: MetadataRoute.Sitemap = [];
  let blogImages: Record<string, string[]> = {};
  try {
    const posts = await sanityClient.fetch<Array<{
      slug: string;
      _updatedAt?: string;
      coverImage?: string;
      bodyImages?: string[];
      clippingImage?: string;
    }>>(POSTS_WITH_IMAGES_QUERY, {}, { next: { revalidate: 3600 } });

    blogUrls = posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post._updatedAt ? new Date(post._updatedAt) : now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    // Collect each post's indexable image URLs
    for (const post of posts) {
      const imgs: string[] = [];
      if (post.coverImage) imgs.push(escapeXml(post.coverImage));
      for (const imgUrl of post.bodyImages || []) {
        if (imgUrl) imgs.push(escapeXml(imgUrl));
      }
      if (post.clippingImage) imgs.push(escapeXml(post.clippingImage));
      if (imgs.length) blogImages[post.slug] = imgs;
    }
  } catch (error) {
    console.error("Failed to fetch blog posts for sitemap:", error);
  }

  // Attach images to blog URL entries
  for (const entry of blogUrls) {
    const slug = entry.url.replace(`${BASE_URL}/blog/`, '');
    const imgs = blogImages[slug];
    if (imgs && imgs.length) entry.images = imgs;
  }

  // 🔹 Gallery images (for /gallery/images, /about)
  let galleryEntry: string[] = [];
  let domeImages: string[] = [];
  try {
    const gallery = await getGalleryImages();
    galleryEntry = gallery
      .filter((g: any) => !g.noindex && g.src)
      .map((g: any) => escapeXml(g.src));
    domeImages = gallery
      .filter((g: any) => !g.noindex && g.showInDome && g.src)
      .map((g: any) => escapeXml(g.src));
  } catch (error) {
    console.error("Failed to fetch gallery images for sitemap:", error);
  }

  // 🔹 Team images (Sanity) for /about, /team
  let sanityTeamImages: string[] = [];
  try {
    const team = await getAllTeamMembers();
    sanityTeamImages = (team || [])
      .filter((m: any) => !m.noindex && m.image)
      .map((m: any) => escapeXml(m.image));
  } catch (error) {
    console.error("Failed to fetch team members for sitemap:", error);
  }

  // 🔹 Static real-photo files (team/, life/) — discovered from filesystem
  const photoDir = join(process.cwd(), 'public', 'images');
  const staticPhotos: Record<string, string[]> = {};
  for (const dir of PHOTO_DIRS) {
    staticPhotos[dir] = listPhotoFiles(join(photoDir, dir)).map(
      (f) => escapeXml(`${BASE_URL}/images/${dir}/${f}`)
    );
  }

  // 🔹 Team dynamic routes
  let teamSlugs: string[] = [];
  try {
    teamSlugs = await getAllTeamSlugs();
  } catch (error) {
    console.error("Failed to fetch team slugs for sitemap:", error);
  }
  const teamUrls: MetadataRoute.Sitemap = teamSlugs
    .filter((slug) => !!TEAM_PROFILES[slug])
    .map((slug) => ({
      url: `${BASE_URL}/team/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    }));

  // Attach images to the /about, /team, /gallery/images page entries
  const findEntry = (urlPath: string) =>
    [...staticUrls, ...blogUrls, ...teamUrls].find((e) => e.url === `${BASE_URL}${urlPath}`);

  // /gallery/images — all indexable gallery images
  const galleryPage = findEntry('/gallery/images');
  if (galleryPage && galleryEntry.length) galleryPage.images = galleryEntry;

  // /about — dome gallery images + static life photos + sanity team images
  const aboutEntry = findEntry('/about');
  if (aboutEntry) {
    const aboutImages = [
      ...domeImages,
      ...staticPhotos['life'],
      ...sanityTeamImages,
    ];
    if (aboutImages.length) aboutEntry.images = aboutImages;
  }

  // /team — sanity team images + static team photos
  const teamEntry = findEntry('/team');
  if (teamEntry) {
    const teamImages = [...sanityTeamImages, ...staticPhotos['team']];
    if (teamImages.length) teamEntry.images = teamImages;
  }

  return [...staticUrls, ...blogUrls, ...teamUrls];
}
