import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/private/", "/studio/"],
      },
    ],
    sitemap: "https://andrewck24.vercel.app/sitemap.xml",
    host: "https://andrewck24.vercel.app",
  };
}
