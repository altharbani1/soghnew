import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/ThemeContext";
import MobileNav from "@/components/MobileNav";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "سوقه | منصة الإعلانات المبوبة في السعودية",
  description: "منصة سوقه للإعلانات المبوبة - بيع واشتري سيارات، عقارات، الكترونيات وأكثر في المملكة العربية السعودية",
  keywords: "إعلانات مبوبة، سيارات، عقارات، الكترونيات، السعودية، حراج، بيع، شراء",
  authors: [{ name: "Souqah" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "سوقه",
  },
  openGraph: {
    title: "سوقه | منصة الإعلانات المبوبة",
    description: "بيع واشتري بسهولة في المملكة العربية السعودية",
    locale: "ar_SA",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#6366f1",
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
