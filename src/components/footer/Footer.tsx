"use client";

import Link from "next/link";
import { ArrowRight, ArrowUp, Mail, Phone } from "lucide-react";
import { ComponentImage } from "@/components/ui/ComponentImage";
import { ASSETS } from "@/lib/assets";
import styles from "./Footer.module.css";

const learningLinks = [
  { label: "Live drone internship", href: "/programs/drone-technology-internship", live: true },
  { label: "Drone Technology Fundamentals", href: "/courses/drone-technology-fundamentals" },
  { label: "Engineering Foundations", href: "/courses?path=engineering" },
  { label: "Industry Applications", href: "/courses?path=applications" },
];

const resourceLinks = [
  { label: "Articles & guides", href: "/articles" },
  { label: "Drone opportunities", href: "/#why-drone-technology" },
  { label: "Find your starting point", href: "/#find-your-path" },
  { label: "Connect with a counsellor", href: "/#counselling" },
];

export function Footer() {
  const backToTop = () => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });

  return (
    <footer id="footer" className={styles.footer}>
      <div className={styles.pattern} aria-hidden="true" />
      <div className={styles.container}>
        <div className={styles.topline}>
          <span className={styles.eyebrow}><span aria-hidden="true" />LEARN WITH AEROCADMY</span>
          <span className={styles.format}>Online learning. Hands-on thinking.</span>
        </div>

        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link href="/" aria-label="Aerocadmy home" className={styles.logo}>
              <ComponentImage src={ASSETS.logo} alt="Aerocadmy" className={styles.logoImage} />
            </Link>
            <p className={styles.statement}>Learn the systems.<br /><span>Build your skills.</span></p>
            <p className={styles.description}>Explore drone technology through electronics, programming and practical learning.</p>
            <Link href="/courses" className={styles.brandAction}>Explore programs<ArrowRight size={17} aria-hidden="true" /></Link>
          </div>

          <nav aria-label="Learning paths" className={styles.linkGroup}>
            <h2>Start learning<span>01</span></h2>
            <ul>{learningLinks.map(link => <li key={link.href}><Link href={link.href}>{link.label}{link.live && <span className={styles.liveTag}>LIVE</span>}</Link></li>)}</ul>
            <p className={styles.courseNote}>Recorded courses are upcoming.</p>
          </nav>

          <nav aria-label="Resources" className={styles.linkGroup}>
            <h2>Resources<span>02</span></h2>
            <ul>{resourceLinks.map(link => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul>
          </nav>

          <div className={styles.contact}>
            <h2>Let’s talk drones.<span>03</span></h2>
            <p>A question, an idea, or a little direction. Start a conversation.</p>
            <a href="tel:+918851478459" className={styles.contactLink}><Phone size={17} aria-hidden="true" /><span>+91 8851478459</span></a>
            <a href="mailto:supportflight@aerocadmy.com" className={styles.contactLink}><Mail size={17} aria-hidden="true" /><span>supportflight@aerocadmy.com</span></a>
            <Link href="/#counselling" className={styles.counsellorLink}>Talk to a counsellor<ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} Aerocadmy. All rights reserved.</p>
          <span className={styles.signature}>Understand. Build. Explore.</span>
          <button type="button" onClick={backToTop} className={styles.backToTop}>Back to top<span><ArrowUp size={16} aria-hidden="true" /></span></button>
        </div>
      </div>
    </footer>
  );
}
