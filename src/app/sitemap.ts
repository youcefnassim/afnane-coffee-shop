import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://afnane-coffee-shop.vercel.app";

  const routes = [
    "",
    "/menu",
    "/gallery",
    "/promotions",
    "/about",
    "/contact",
    "/checkout",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
