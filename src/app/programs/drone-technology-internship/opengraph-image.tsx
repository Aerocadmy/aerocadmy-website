import { internshipSocialImage } from "@/lib/social-image";

export const alt = "Aerocadmy six-week live Drone Technology Internship";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return internshipSocialImage();
}
