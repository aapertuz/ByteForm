import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import "@/shared/styles/brand-tokens.css";
import { PostHogProvider } from "@/shared/lib/analytics/PostHogProvider";
import { RouteTransition } from "@/shared/components/site/RouteTransition";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://byteform.io";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ByteForm — Forms your users actually want to fill",
    template: "%s · ByteForm",
  },
  description:
    "Create classic and conversational forms, share a link, and review responses in one place. Start building without signing up.",
  keywords: [
    "form builder",
    "conversational forms",
    "typeform alternative",
    "online forms",
    "survey builder",
    "form analytics",
  ],
  authors: [{ name: "ByteForm" }],
  creator: "ByteForm",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "ByteForm",
    title: "ByteForm — Forms your users actually want to fill",
    description:
      "Create classic and conversational forms, share a link, and review responses in one place. Start building without signing up.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ByteForm — Forms your users actually want to fill",
    description:
      "Create classic and conversational forms, share a link, and review responses in one place. Start building without signing up.",
    creator: "@byteform",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <PostHogProvider>
          <RouteTransition>{children}</RouteTransition>
        </PostHogProvider>
      </body>
    </html>
  );
}
