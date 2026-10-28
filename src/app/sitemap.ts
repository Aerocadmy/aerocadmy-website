import type { MetadataRoute } from "next";
import { recordedCourses } from "@/data/courses";

const siteUrl = "https://www.aerocadmy.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/programs/drone-technology-internship",
    "/courses",
    ...recordedCourses.map(course => `/courses/${course.slug}`),
    "/articles",
    "/articles/drone-components-for-beginners",
    "/events",
    "/aviation-safety",
    "/privacy-policy",
    "/terms-and-conditions",
  ];
  return paths.map(path => ({ url: `${siteUrl}${path === "/" ? "" : path}` }));
}
