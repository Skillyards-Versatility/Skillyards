import { Inter, Playfair_Display, Source_Sans_3 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";


import "@/app/styles/globals.css";

import { ThemeProvider } from "@/app/context/ThemeContext";
import ReCaptchaProvider from "@/components/providers/ReCaptchaProvider";
import BackToTop from "@/components/BackToTop";
import JsonLd from "@/components/JsonLd";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";
import {
    organizationSchema,
    primaryLocationSchema,
    websiteSchema,
} from "@/lib/seo/schema/global";
const playfair = Playfair_Display({
    subsets: ["latin"],
    weight: ["500", "600", "700"],
    variable: "--font-playfair",
    display: "swap",
});

const inter = Inter({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600"],
    variable: "--font-inter",
    display: "swap",
});

const sourceSans = Source_Sans_3({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-source-sans",
    display: "swap",
});

const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||((!t||t==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}else{document.documentElement.classList.add('light')}}catch(e){}})();`;

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning className={`${inter.variable} ${sourceSans.variable} ${playfair.variable}`}>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />

                <link
                    rel="author"
                    href="/human.txt"
                    type="text/plain"
                />
                <link rel="author" href="/humans.txt" type="text/plain" />

                <JsonLd data={organizationSchema} id="organization-schema" />
                <JsonLd data={primaryLocationSchema} id="primary-location-schema" />
                <JsonLd data={websiteSchema} id="website-schema" />
            </head>

            <body
                className={`antialiased bg-foreground text-primary-foreground`}
            >
                <noscript>
                    <iframe
                        src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER}`}
                        height="0"
                        width="0"
                        style={{ display: "none", visibility: "hidden" }}
                    />
                </noscript>
                <Script
                    id="gtm"
                    strategy="lazyOnload"
                    dangerouslySetInnerHTML={{
                        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER}');`,
                    }}
                />
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <ReCaptchaProvider>
                        <div className="min-h-screen bg-background">
                            <Header />

                            <main className="relative z-10">{children}</main>

                            <Footer />
                            <BackToTop />
                        </div>
                    </ReCaptchaProvider>
                    <Analytics />
                    <SpeedInsights />

                </ThemeProvider>

            </body>
        </html>
    );
}
