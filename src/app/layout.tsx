import type { Metadata } from "next";
import Script from "next/script";
import {
  Anek_Bangla,
  IBM_Plex_Mono,
  Quicksand,
} from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GuidePreferencesProvider } from "@/contexts/guide-preferences";
import { bn } from "@/lib/i18n/bn";

const anekBangla = Anek_Bangla({
  variable: "--font-anek-bangla",
  subsets: ["bengali"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmMono = IBM_Plex_Mono({
  variable: "--font-ibm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: bn.meta.title,
    template: "%s — Server Deploy Guide",
  },
  description: bn.meta.description,
  openGraph: {
    title: bn.meta.title,
    description: bn.meta.description,
    type: "website",
    locale: "bn_BD",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: bn.meta.title,
    description: bn.meta.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      data-deploy-path="manual"
      className="dark"
      suppressHydrationWarning
    >
      <body
        className={`${anekBangla.variable} ${quicksand.variable} ${ibmMono.variable} min-h-screen bg-background antialiased`}
      >
        <Script
          id="guide-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement;var th=localStorage.getItem('guideTheme');if(th==='light')d.classList.remove('dark');else d.classList.add('dark');var l=localStorage.getItem('lang');if(l==='en'||l==='bn')d.setAttribute('lang',l==='bn'?'bn':'en');var p=localStorage.getItem('deployPath');if(p==='manual'||p==='docker')d.setAttribute('data-deploy-path',p);}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
        <GuidePreferencesProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </GuidePreferencesProvider>
      </body>
    </html>
  );
}
