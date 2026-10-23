import { notFound } from "next/navigation";
import { findRecordedCourse } from "@/data/courses";
import { courseSocialImage } from "@/lib/social-image";

export const alt = "Aerocadmy course preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = findRecordedCourse(slug);
  if (!course) notFound();
  return courseSocialImage(course);
}
