import { lastModified } from "./docs.mdx";

import type { MetadataRoute } from "next";

export const baseURL = "https://neotoc.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseURL,
      lastModified: lastModified,
    },
  ];
}
