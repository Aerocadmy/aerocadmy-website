"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Check, Compass, GraduationCap, Users, Wrench } from "lucide-react";
import { recordedCourses } from "@/data/courses";
import { CourseImage } from "@/components/programs/CourseImage";
import styles from "./LearningGuidance.module.css";

const interests = [
  { title: "I’m new to drones", hint: "Start with the fundamentals", icon: GraduationCap,
    heading: "Drone Technology Fundamentals", label: "A suggested first step", status: "Planned recorded course",
    description: "A starting point for understanding drone components, flight principles and connected systems.",
    detail: "No prior drone knowledge needed", cta: "Preview course", href: "/courses/drone-technology-fundamentals", image: recordedCourses[0].visual, links: [] as { label: string; href: string }[] },
  { title: "I want to build, code or repair", hint: "Explore engineering foundations", icon: Wrench,
    heading: "Engineering Foundations", label: "A path to explore", status: "Planned recorded courses",
    description: "Explore the hardware, programming and feedback that make a drone work. Pick a course based on the foundations you already have.",
    detail: "Check each course’s prerequisites before choosing", cta: "Explore this path", href: "/courses?path=engineering", image: recordedCourses[1].visual,
    links: [{ label: "Electronics & troubleshooting", href: `/courses/${recordedCourses[1].slug}` }, { label: "ESP32 programming", href: `/courses/${recordedCourses[2].slug}` }, { label: "Flight control & simulation", href: `/courses/${recordedCourses[3].slug}` }] },
  { title: "I’m interested in industry applications", hint: "Discover mapping, imagery, inspection and media", icon: Compass,
    heading: "Industry Applications", label: "A path to explore", status: "Planned recorded courses",
    description: "Connect drone knowledge to mapping, imagery, inspection or visual storytelling. Explore the work and the foundations each course expects.",
    detail: "Drone fundamentals are the starting point for this path", cta: "Explore this path", href: "/courses?path=applications", image: recordedCourses[4].visual,
    links: [{ label: "Mapping & photogrammetry", href: `/courses/${recordedCourses[4].slug}` }, { label: "Imagery & data", href: `/courses/${recordedCourses[5].slug}` }, { label: "Inspection workflows", href: `/courses/${recordedCourses[6].slug}` }, { label: "Aerial photography", href: `/courses/${recordedCourses[7].slug}` }] },
  { title: "I prefer live guidance with a kit", hint: "Explore the live internship", icon: Users,
    heading: "Drone Technology Internship", label: "A live learning option", status: "Live online · Enrolment open",
    description: "Explore the six-week live online internship, with an ESP32 drone kit to keep, class recordings and community access.",
    detail: "₹4,999 including training and the ESP32 kit", cta: "Explore program", href: "/programs/drone-technology-internship",
    image: { src: "/images/courses/foundations.png", quadrant: 3, alt: "Hands assembling an educational ESP32 micro-drone" }, links: [] },
];

export function CourseFinder() {
  const id = useId();
  const [active, setActive] = useState(0);
  const [connection, setConnection] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const choices = useRef<(HTMLButtonElement | null)[]>([]);
  const selected = interests[active];

  useEffect(() => {
    const grid = gridRef.current, image = imageRef.current;
    if (!grid || !image) return;
    const measure = () => {
      const button = choices.current[active];
      if (!button) return;
      const box = grid.getBoundingClientRect(), start = button.getBoundingClientRect(), end = image.getBoundingClientRect();
      const x1 = start.right - box.left, y1 = start.top + start.height / 2 - box.top;
      const x2 = end.left - box.left, y2 = end.top + end.height / 2 - box.top;
      const middle = (x1 + x2) / 2;
      setConnection(`M${x1} ${y1} C${middle} ${y1},${middle} ${y2},${x2} ${y2}`);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(grid); observer.observe(image); measure();
    return () => observer.disconnect();
  }, [active]);

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % interests.length;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (index + interests.length - 1) % interests.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = interests.length - 1;
    else return;
    event.preventDefault(); setActive(next); choices.current[next]?.focus({ preventScroll: true });
  }

  return <section id="find-your-path" aria-labelledby={`${id}-heading`} className={styles.finder}>
    <div className={styles.container}>
      <header className={styles.finderHeader}><p className={styles.eyebrow}>A little direction</p><h2 id={`${id}-heading`}>Find your starting point.</h2><p>Tell us what interests you. Explore a path that fits.</p></header>
      <div className={styles.finderGrid} ref={gridRef}>
        <div><p className={styles.choiceHint}>Choose an interest below.</p>
          <div className={styles.choices} role="radiogroup" aria-label="What interests you?">
            {interests.map((interest, index) => <button key={interest.title} type="button" role="radio" aria-checked={active === index} aria-controls={`${id}-result`} tabIndex={active === index ? 0 : -1} ref={element => { choices.current[index] = element; }} onClick={() => setActive(index)} onKeyDown={event => navigate(event, index)} className={styles.choice}>
              <interest.icon size={29} strokeWidth={1.4} aria-hidden="true" /><span><strong>{interest.title}</strong><span>{interest.hint}</span></span>{active === index && <span className={styles.check}><Check size={13} aria-hidden="true" /></span>}
            </button>)}
          </div>
        </div>
        <svg className={styles.connection} aria-hidden="true"><path d={connection} fill="none" stroke="#11b786" strokeWidth="1.5" /></svg>
        <div id={`${id}-result`} className={styles.recommendation} role="region" aria-label="Suggested learning direction">
          <div ref={imageRef} className={styles.recommendationImage}><CourseImage visual={selected.image} /><span className={styles.photoBadge}>{selected.status}</span></div>
          <div key={active} className={styles.resultCopy}><p className={styles.eyebrow}>{selected.label}</p><h3>{selected.heading}</h3><p className={styles.resultDescription}>{selected.description}</p><p className={styles.resultDetail}><BookOpen size={15} aria-hidden="true" />{selected.detail}</p>
            {selected.links.length > 0 && <ul className={styles.pathLinks}>{selected.links.map(link => <li key={link.href}><Link href={link.href}>{link.label}<ArrowUpRight size={12} aria-hidden="true" /></Link></li>)}</ul>}
            <div className={styles.resultAction}><Link href={selected.href}>{selected.cta}<ArrowUpRight size={17} aria-hidden="true" /></Link><p>{active === 3 ? "See the program details before deciding." : "Join a course waitlist on its preview page."}</p></div>
          </div>
        </div>
      </div>
      <p className={styles.srOnly} role="status">Suggested learning direction: {selected.heading}</p>
      <div className={styles.finderFooter}><p>Your interest is a starting point, not a fixed track.</p><Link href="/courses">Browse all programs<ArrowUpRight size={14} aria-hidden="true" /></Link></div>
    </div>
  </section>;
}
