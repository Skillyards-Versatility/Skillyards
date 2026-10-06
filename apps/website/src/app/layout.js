import { Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "@/app/styles/globals.css";

import { ThemeProvider } from "@/app/context/ThemeContext";
import ReCaptchaProvider from "@/components/providers/ReCaptchaProvider";
import GtmProvider from "@/components/providers/GtmProvider";
import BackToTop from "@/components/BackToTop";
import JsonLd from "@/components/JsonLd";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  organizationSchema,
  primaryLocationSchema,
  websiteSchema,
} from "@/lib/seo/schema/global";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||((!t||t==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}else{document.documentElement.classList.add('light')}}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />

        <link rel="author" href="/human.txt" type="text/plain" />
        <link rel="author" href="/humans.txt" type="text/plain" />

        <JsonLd data={organizationSchema} id="organization-schema" />
        <JsonLd data={primaryLocationSchema} id="primary-location-schema" />
        <JsonLd data={websiteSchema} id="website-schema" />
      </head>

      <body className={`antialiased bg-background text-foreground`}>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <GtmProvider gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER} />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
