"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, CalendarDays, Package, Radio } from "lucide-react";
import { courseGroups, recordedCourses, type CourseGroup } from "@/data/courses";
import { CourseImage } from "./CourseImage";
import styles from "./CourseCatalogue.module.css";

export function CourseCatalogue({ headingAs = "h2", initialGroup = "All recorded courses" }: { headingAs?: "h1" | "h2"; initialGroup?: CourseGroup | "All recorded courses" }) {
  const Heading = headingAs;
  const [group, setGroup] = useState<CourseGroup | "All recorded courses">(initialGroup);
  const id = useId();
  const visible = recordedCourses.filter(course => group === "All recorded courses" || course.group === group);
  return <section id="programs" aria-labelledby={`${id}-title`} className={styles.section}>
    <div className={styles.container}>
      <header className={styles.header}>
        <div><p className={styles.eyebrow}>Learning with Aerocadmy</p><Heading id={`${id}-title`} className={styles.title}>Explore our programs</Heading><p className={styles.subtitle}>Understand the technology. Explore where you can take it.</p></div>
        <div className={styles.filters} role="group" aria-label="Filter recorded courses">
          {(["All recorded courses", ...courseGroups] as const).map(value => <button type="button" key={value} aria-pressed={group === value} onClick={() => setGroup(value)}>{value}</button>)}
        </div>
      </header>
      <aside className={styles.live} aria-label="Live internship program">
        <figure className={styles.liveVisual}>
          <Link href="/programs/drone-technology-internship" aria-label="Explore the drone kit and live internship">
            <CourseImage visual={{ src: "/images/courses/foundations.png", quadrant: 3, alt: "Hands assembling an educational ESP32 micro-drone on a workbench" }} />
            <span className={styles.kitBadge}><Package size={12} aria-hidden="true" />Kit + training</span>
          </Link>
          <figcaption>Illustrative kit and learning scene</figcaption>
        </figure>
        <div className={styles.liveBody}>
          <span className={styles.liveLabel}><Radio size={13} aria-hidden="true" />Live online · Enrolment open</span>
          <h3><Link href="/programs/drone-technology-internship">Drone Technology Internship</Link></h3>
          <p>Understand the technology. Build with your own kit.</p>
          <ul className={styles.liveMeta} aria-label="Program highlights">
            <li><CalendarDays size={14} aria-hidden="true" />6 weeks</li>
            <li><Package size={14} aria-hidden="true" />ESP32 kit to keep</li>
            <li><BookOpen size={14} aria-hidden="true" />Live classes + recordings</li>
          </ul>
          <p className={styles.batchDate}>Next batch starts 15 November 2026</p>
        </div>
        <div className={styles.liveAction}><span className={styles.feeLabel}>Training + ESP32 kit</span><strong>₹6,999</strong><Link href="/programs/drone-technology-internship">Explore program <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
      </aside>
      <p className={styles.catalogueNote}>Upcoming recorded courses. Explore the proposed outlines and join a course waitlist.</p>
      <p className={styles.resultCount} role="status">{visible.length} planned courses{group !== "All recorded courses" ? ` · ${group}` : " · Two learning paths"}</p>
      <div className={styles.grid}>
        {visible.map(course => <article key={course.slug} className={styles.card}>
          <Link href={`/courses/${course.slug}`} className={styles.imageLink} tabIndex={-1} aria-hidden="true"><CourseImage visual={course.visual} /><span className={styles.badge}>Planned</span></Link>
          <p className={styles.meta}><BookOpen size={13} aria-hidden="true" />Recorded course<span aria-hidden="true">|</span>{course.group === "Engineering Foundations" ? "Foundations" : "Applications"}</p>
          <h3><Link href={`/courses/${course.slug}`}>{course.title}</Link></h3>
          <p className={styles.summary}>{course.summary}</p>
          <div className={styles.cardFooter}><span>Upcoming</span><Link href={`/courses/${course.slug}`}>Preview course <ArrowUpRight size={16} aria-hidden="true" /><span className={styles.srOnly}>: {course.title}</span></Link></div>
        </article>)}
      </div>
      <p className={styles.caption}>Illustrative learning scenes. Course details may develop as the recorded programs are created.</p>
    </div>
  </section>;
}
