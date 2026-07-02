import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AFNENE — Coffee • Drink • Snack | Premium Coffee Experience",
    template: "%s | AFNENE Coffee",
  },
  description:
    "Experience authentic coffee, delicious food and a warm atmosphere at AFNENE. Explore our premium menu, daily specials, and more.",
  keywords: [
    "AFNENE",
    "coffee shop",
    "restaurant",
    "Algeria",
    "premium coffee",
    "burgers",
    "desserts",
    "drinks",
  ],
  authors: [{ name: "AFNENE Coffee" }],
  creator: "AFNENE Coffee",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://afnene.com",
    siteName: "AFNENE Coffee",
    title: "AFNENE — Coffee • Drink • Snack",
    description:
      "Experience authentic coffee, delicious food and a warm atmosphere.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AFNENE Coffee Shop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AFNENE — Coffee • Drink • Snack",
    description:
      "Experience authentic coffee, delicious food and a warm atmosphere.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AFNENE Coffee",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F7F2" },
    { media: "(prefers-color-scheme: dark)", color: "#1B1B1B" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              name: "AFNENE Coffee",
              description:
                "Experience authentic coffee, delicious food and a warm atmosphere.",
              url: "https://afnene.com",
              servesCuisine: ["Coffee", "Fast Food", "Desserts"],
              priceRange: "$$",
              address: {
                "@type": "PostalAddress",
                addressCountry: "DZ",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
        style={{
          fontFamily: "var(--font-inter), var(--font-body)",
        }}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
