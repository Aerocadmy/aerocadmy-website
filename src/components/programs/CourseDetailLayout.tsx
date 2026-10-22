import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Box, CalendarDays, ChevronDown, ChevronRight, Home, Laptop, Video } from "lucide-react";
import type { CourseVisual } from "@/data/courses";
import { CourseImage } from "./CourseImage";
import { ReviewRating } from "@/components/testimonials/ReviewRating";
import styles from "./CourseDetail.module.css";

const factIcons = { video: Video, modules: BookOpen, kit: Box, calendar: CalendarDays, online: Laptop };
type Fact = { icon: keyof typeof factIcons; label: string };

export function CourseDetailLayout({ title, category, eyebrow, summary, facts, sections, sidebar, children }: {
  title: string; category: string; eyebrow: string; summary: string; facts: Fact[];
  sections: { id: string; label: string }[]; sidebar: ReactNode; children: ReactNode;
}) {
  return <main className={styles.container}>
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <Link href="/" aria-label="Home"><Home size={15} aria-hidden="true" /></Link>
      <ChevronRight size={13} aria-hidden="true" /><Link href="/courses">Programs</Link>
      <ChevronRight size={13} aria-hidden="true" /><span>{category}</span>
    </nav>
    <div className={styles.layout}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}><span className={styles.statusDot} aria-hidden="true" />{eyebrow}</p>
        <h1>{title}</h1>
        <ReviewRating />
        <p className={styles.summary}>{summary}</p>
        <ul className={styles.facts} aria-label="Course at a glance">{facts.map(fact => {
          const Icon = factIcons[fact.icon];
          return <li key={fact.label}><Icon size={17} aria-hidden="true" />{fact.label}</li>;
        })}</ul>
        <nav className={styles.sectionNav} aria-label="On this page">{sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.label}</a>)}</nav>
      </header>
      {sidebar}
      <div className={styles.content}>{children}</div>
    </div>
  </main>;
}

export function CourseSummaryCard({ visual, caption = "Illustrative learning scene", featuredVisual = false, children }: { visual: CourseVisual; caption?: string; featuredVisual?: boolean; children: ReactNode }) {
  return <aside className={styles.rail} aria-label="Course summary">
    <div className={`${styles.summaryCard} ${featuredVisual ? styles.featuredSummaryCard : ""}`}>
      <figure className={`${styles.cardVisual} ${featuredVisual ? styles.featuredCardVisual : ""}`}><CourseImage visual={visual} priority /><figcaption>{caption}</figcaption></figure>
      <div className={styles.cardBody}>{children}</div>
    </div>
  </aside>;
}

export function CourseAction({ href, children, secondary = false, centered = false }: { href: string; children: ReactNode; secondary?: boolean; centered?: boolean }) {
  return <a href={href} className={`${secondary ? `${styles.secondaryAction} light-action` : styles.heroAction} ${centered ? styles.centeredAction : ""}`}>{children}<ArrowUpRight size={18} aria-hidden="true" /></a>;
}

export function CourseCurriculum({ modules, label = "Module" }: { modules: { title: string; description?: string; topics?: string[] }[]; label?: string }) {
  return <div className={styles.curriculum}>{modules.map((module, index) => <details className={styles.module} key={module.title} open={index === 0}>
    <summary><span className={styles.moduleNumber}>{String(index + 1).padStart(2, "0")}</span><span className={styles.moduleHeading}><small>{label} {index + 1}</small>{module.title}</span><ChevronDown size={19} className={styles.moduleChevron} aria-hidden="true" /></summary>
    <div className={styles.moduleBody}>{module.topics?.length ? <ul className={styles.moduleTopics}>{module.topics.map(topic => <li key={topic}>{topic}</li>)}</ul> : <p>{module.description}</p>}</div>
  </details>)}</div>;
}
