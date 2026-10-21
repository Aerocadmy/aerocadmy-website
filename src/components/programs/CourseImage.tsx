import Image from "next/image";
import type { CourseVisual } from "@/data/courses";
import styles from "./CourseCatalogue.module.css";

export function CourseImage({ visual, priority = false }: { visual: CourseVisual; priority?: boolean }) {
  return <div className={styles.image}>
    <Image src={visual.src} alt={`Illustrative learning scene: ${visual.alt}`} width={1536} height={1024} quality={95}
      sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 340px" priority={priority}
      className={styles.atlas} style={{ left: visual.quadrant % 2 ? "-100%" : "0%", top: visual.quadrant < 2 ? "0%" : "-100%" }} />
  </div>;
}
