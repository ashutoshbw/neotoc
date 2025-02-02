import { lastModified } from "./learn/learn.mdx";

import type { MetadataRoute } from "next";

export const baseURL = "https://neotoc.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseURL,
      lastModified: lastModified,
    },
    {
      url: `${baseURL}/learn`,
      lastModified: lastModified,
    },
    {
      url: baseURL,
      videos: [
        {
          title: "Neotoc Demo",
          thumbnail_loc: `${baseURL}/twitter-image.jpg`,
          description:
            "Neotoc is a tool for easily generating beautiful table of contents with JavaScript.",
          content_loc: `${baseURL}/neotoc-dark.mp4`,
        },
      ],
    },
  ];
}
