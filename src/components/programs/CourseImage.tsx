import Image from "next/image";
import type { CourseVisual } from "@/data/courses";
import styles from "./CourseCatalogue.module.css";

export function CourseImage({ visual, priority = false }: { visual: CourseVisual; priority?: boolean }) {
  return <div className={styles.image}>
    <Image src={visual.src} alt={`Illustrative learning scene: ${visual.alt}`} width={1536} height={1024} quality={100}
      sizes="(max-width: 600px) 180vw, (max-width: 1000px) 90vw, 680px" priority={priority}
      className={styles.atlas} style={{ left: visual.quadrant % 2 ? "-100%" : "0%", top: visual.quadrant < 2 ? "0%" : "-100%" }} />
  </div>;
}
