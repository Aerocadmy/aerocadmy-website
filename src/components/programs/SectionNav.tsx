"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CourseDetail.module.css";

/** Sticky "on this page" tabs that highlight the section currently being read. */
export function SectionNav({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState("");
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const update = () => {
      let current = "";
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= 210) current = section.id;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [sections]);

  // Keep the active tab in view when the tabs scroll sideways (phones).
  useEffect(() => {
    const nav = navRef.current;
    const link = nav?.querySelector<HTMLElement>('[aria-current="true"]');
    if (nav && link) nav.scrollTo({ left: link.offsetLeft - nav.clientWidth / 2 + link.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  return <nav ref={navRef} className={styles.sectionNav} aria-label="On this page">
    {sections.map(section => <a key={section.id} href={`#${section.id}`} aria-current={active === section.id ? "true" : undefined}>{section.label}</a>)}
  </nav>;
}
