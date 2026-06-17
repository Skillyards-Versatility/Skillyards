/** @type {import('next').NextConfig} */

console.log("NODE_ENV:", process.env.NODE_ENV);

const nextConfig = {
    reactCompiler: false,

    async headers() {
        const isDev = process.env.NODE_ENV !== "production";

        const staticCacheHeaders = {
            source: "/_next/static/(.*)",
            headers: [
                {
                    key: "Cache-Control",
                    value: "public, max-age=31536000, immutable",
                },
            ],
        };

        const swHeaders = {
            source: "/sw.js",
            headers: [
                {
                    key: "Content-Type",
                    value: "application/javascript; charset=utf-8",
                },
                {
                    key: "Service-Worker-Allowed",
                    value: "/",
                },
            ],
        };

        const cspHeaders = {
            source: "/(.*)",
            headers: [
                {
                    key: "Content-Security-Policy",
                    value:
                        "default-src 'self'; " +

                        // Scripts
                        "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://utteranc.es https://www.google.com https://www.gstatic.com https://www.googletagmanager.com https://googleads.g.doubleclick.net https://www.googleadservices.com https://*.disqus.com https://*.disquscdn.com; "+
                        // Frames
                        "frame-src https://utteranc.es https://www.google.com https://www.gstatic.com https://www.youtube.com https://www.googletagmanager.com https://disqus.com https://*.disqus.com; " +

                        // API calls 
                        "connect-src 'self' https://api.github.com https://www.google.com https://www.gstatic.com https://skillyards-backend.vercel.app https://api.skillyards.in https://www.googletagmanager.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://www.googleadservices.com https://*.disqus.com https://*.disquscdn.com; " +

                        // Images
                        "img-src 'self' data: blob: https://images.unsplash.com https://cdn.sanity.io https://cdn.simpleicons.org https://img.youtube.com https://googleads.g.doubleclick.net https://www.googleadservices.com https://www.google.com https://www.google.co.in https://*.disquscdn.com https://referrer.disqus.com; " +

                        // Styles
                        "style-src 'self' 'unsafe-inline'; " +

                        // Fonts
                        "font-src 'self' data:; " +

                        // Workers
                        "worker-src 'self' blob:;",
                },
            ],
        };

        return isDev
            ? [swHeaders]
            : [swHeaders, staticCacheHeaders, cspHeaders];
    },

    images: {
        remotePatterns: [
            { protocol: "https", hostname: "randomuser.me" },
            { protocol: "https", hostname: "img.youtube.com" },
            { protocol: "https", hostname: "i.ytimg.com" },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "admin.skillyards.in",
                pathname: "/storage/**",
            },
            {
                protocol: "https",
                hostname: "admin.skillyards.in",
                pathname: "/images/**",
            },
            {
                protocol: "https",
                hostname: "cdn.sanity.io",
                pathname: "/images/**",
            },
        ],
    },

    async redirects() {
        return [
            // Host canonicalization (keep existing)
            {
                source: "/:path*",
                has: [{ type: "host", value: "skillyards.in" }],
                destination: "https://www.skillyards.in/:path*",
                permanent: true,
            },

            // === 301: Old deep URLs → New flat URLs ===
            { source: "/programs/on-job-degree/best-bca-course-in-agra-with-job-training", destination: "/bca-training-program-in-agra", permanent: true },
            { source: "/programs/on-job-degree/best-bba-course-in-agra-with-job-training", destination: "/bba-training-program-in-agra", permanent: true },
            { source: "/programs/on-job-training/best-full-stack-development-course-in-agra", destination: "/full-stack-web-development-training-in-agra", permanent: true },
            { source: "/programs/on-job-training/best-digital-marketing-course-in-agra", destination: "/digital-marketing-course-in-agra", permanent: true },

            // === 301: Short aliases for convenience + legacy → New flat URLs ===
            { source: "/programs/bca", destination: "/bca-training-program-in-agra", permanent: true },
            { source: "/programs/bba", destination: "/bba-training-program-in-agra", permanent: true },
            { source: "/programs/fullstack", destination: "/full-stack-web-development-training-in-agra", permanent: true },
            { source: "/programs/full-stack", destination: "/full-stack-web-development-training-in-agra", permanent: true },
            { source: "/programs/digitalmarketing", destination: "/digital-marketing-course-in-agra", permanent: true },
            { source: "/programs/digital-marketing", destination: "/digital-marketing-course-in-agra", permanent: true },
            { source: "/programs/data-science", destination: "/programs", permanent: true },
            { source: "/programs/mern-stack-developer", destination: "/full-stack-web-development-training-in-agra", permanent: true },
            { source: "/programs/bachelor-of-computer-applications-bca", destination: "/bca-training-program-in-agra", permanent: true },

            // === 301: Existing site-wide URL aliases (keep) ===
            { source: "/about-us", destination: "/about", permanent: true },
            { source: "/contact-us", destination: "/contact", permanent: true },
            { source: "/courses", destination: "/programs", permanent: true },
            { source: "/blogs", destination: "/blog", permanent: true },
            { source: "/reviews", destination: "/testimonials", permanent: true },
            { source: "/gallery/photos", destination: "/gallery/images", permanent: true },
            { source: "/suryanshupadhyay", destination: "/team/suryanshupadhyay", permanent: true },
            { source: "/rahulsingh", destination: "/team/rahulsingh", permanent: true },
            { source: "/team/suryansh-upadhyay", destination: "/team/suryanshupadhyay", permanent: true },
            { source: "/team/rahul-singh", destination: "/team/rahulsingh", permanent: true },

            // === 301: FIX existing broken redirect (was pointing to non-existent /terms-of-service) ===
            { source: "/terms-and-conditions", destination: "/legal/terms-of-service", permanent: true },
            { source: "/terms-of-service", destination: "/legal/terms-of-service", permanent: true },
            { source: "/privacy-policy", destination: "/legal/privacy-policy", permanent: true },
            { source: "/refund-policy", destination: "/legal/refund-policy", permanent: true },

            // === 301: Legacy /on-job-training root URL → category page ===
            { source: "/on-job-training", destination: "/programs/on-job-training", permanent: true },

            {
                source: "/gallery/videos/:id",
                destination: "/gallery/videos",
                permanent: true,
            },

            {
                source: "/programs/on-job-degree/best-bba-college-in-agra-with-digital-skills",
                destination: "/bba-training-program-in-agra",
                permanent: true,
            },

            {
                source: "/programs/on-job-training/digital-marketing-course-in-agra-with-live-projects",
                destination: "/digital-marketing-course-in-agra",
                permanent: true,
            },

            {
                source: "/programs/on-job-training/mern-stack-developer-course-in-agra",
                destination: "/full-stack-web-development-training-in-agra",
                permanent: true,
            },

            {
                source: "/blog/tag/:slug*",
                destination: "/blog",
                permanent: true,
            },

            {
                source: "/blog/web-development-ke-latest-trends",
                destination: "/blog",
                permanent: true,
            },

            {
                source: "/programs/on-job-training/tall-stack-developer-course-in-agra",
                destination: "/full-stack-web-development-training-in-agra",
                permanent: true,
            },
        ];
    },

    async rewrites() {
        return [
            {
                source: "/sitemap",
                destination: "/sitemap-html",
            },
        ];
    },
};

export default nextConfig;
