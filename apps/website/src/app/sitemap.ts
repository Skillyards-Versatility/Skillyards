import { MetadataRoute } from 'next';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { sanityClient } from '@/lib/sanity/client';
import { getAllTeamSlugs } from '@/lib/sanity/getTeamMembers';
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


  // 🔹 Blog dynamic routes
  let blogUrls: MetadataRoute.Sitemap = [];
  try {
    const posts = await sanityClient.fetch(`
      *[_type == "post" && defined(slug.current)]{
        "slug": slug.current,
        _updatedAt
      }
    `, {}, { next: { revalidate: 3600 } });

    blogUrls = posts.map((post: any) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post._updatedAt ? new Date(post._updatedAt) : now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Failed to fetch blog posts for sitemap:", error);
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

  return [...staticUrls, ...blogUrls, ...teamUrls];
}
