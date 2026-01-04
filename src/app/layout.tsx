import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/ThemeContext";
import MobileNav from "@/components/MobileNav";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://souqah.sa'),
  title: {
    default: "سوقه | منصة الإعلانات المبوبة في السعودية",
    template: "%s | سوقه",
  },
  description: "منصة سوقه للإعلانات المبوبة - بيع واشتري سيارات، عقارات، الكترونيات وأكثر في المملكة العربية السعودية. أكبر سوق إلكتروني في السعودية.",
  keywords: ["إعلانات مبوبة", "سيارات للبيع", "عقارات", "الكترونيات", "السعودية", "حراج", "بيع وشراء", "سوق", "أثاث", "وظائف", "خدمات"],
  authors: [{ name: "Souqah", url: "https://souqah.sa" }],
  creator: "Souqah",
  publisher: "Souqah",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "سوقه",
  },
  openGraph: {
    title: "سوقه | منصة الإعلانات المبوبة في السعودية",
    description: "بيع واشتري بسهولة في المملكة العربية السعودية - سيارات، عقارات، الكترونيات وأكثر",
    locale: "ar_SA",
    type: "website",
    siteName: "سوقه",
    url: "/",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "سوقه - منصة الإعلانات المبوبة",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "سوقه | منصة الإعلانات المبوبة في السعودية",
    description: "بيع واشتري بسهولة في المملكة العربية السعودية",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: "/",
    languages: {
      'ar-SA': '/',
    },
  },
  category: 'marketplace',
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6366f1" },
    { media: "(prefers-color-scheme: dark)", color: "#4f46e5" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ThemeProvider>
            {children}
            <MobileNav />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
