"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Menu, Search, X } from "lucide-react";
import { SearchModal } from "./SearchModal";
import { CourseCategories } from "./CourseCategories";
import { ComponentImage } from "@/components/ui/ComponentImage";
import { ASSETS } from "@/lib/assets";
import { courseCategories } from "@/data/course-categories";
import { recordedCourses } from "@/data/courses";
import styles from "./Navbar.module.css";

const sectionLinks = [
  { label: "Programs", href: "/courses" },
  { label: "Events", href: "/#events" },
  { label: "Career", href: "/#why-drone-technology" },
  { label: "Store", href: "/#store" },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const coursesButtonRef = useRef<HTMLButtonElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);

  const closeMenus = useCallback(() => {
    setMobileMenuOpen(false);
    setCoursesOpen(false);
    setMobileCoursesOpen(false);
    setMobileCategoryOpen(null);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) closeMenus();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (coursesOpen) coursesButtonRef.current?.focus();
      if (mobileMenuOpen) mobileButtonRef.current?.focus();
      closeMenus();
    };
    let lastWidth = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth !== lastWidth) { lastWidth = window.innerWidth; closeMenus(); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [coursesOpen, mobileMenuOpen, closeMenus]);

  const openSearch = () => {
    closeMenus();
    setIsSearchOpen(true);
  };

  return (
    <>
      <header ref={headerRef} className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
        <div className={styles.announcement}>
          <span className={styles.offerDot} aria-hidden="true" />
          <span>Get 50% off on your first course</span>
          <span className={styles.offerCode}>FIRST50</span>
        </div>
        <div className={styles.row}>
          <Link href="/" aria-label="Aerocadmy home" onClick={closeMenus} className={styles.logo}>
            <ComponentImage src={ASSETS.logo} alt="Aerocadmy" className={styles.logoImage} />
          </Link>

          <nav aria-label="Main navigation" className={styles.navigation}>
            <button ref={coursesButtonRef} type="button" className={`${styles.navLink} ${coursesOpen ? styles.active : ""}`} aria-expanded={coursesOpen} aria-controls="desktop-course-navigation" onClick={() => setCoursesOpen(open => !open)}>
              Courses<ChevronDown size={14} className={coursesOpen ? styles.rotated : undefined} aria-hidden="true" />
            </button>
            {sectionLinks.map(({ label, href }) => <Link key={label} href={href} onClick={closeMenus} className={styles.navLink}>{label}</Link>)}
          </nav>

          <div className={styles.actions}>
            <button type="button" onClick={openSearch} aria-label="Search courses and drone technology" className={styles.searchButton}><Search size={19} aria-hidden="true" /></button>
            <span className={styles.actionDivider} aria-hidden="true" />
            <Link href="/#counselling" className={`${styles.signup} light-action`} onClick={closeMenus}>Talk to a counsellor<ArrowRight size={16} aria-hidden="true" /></Link>
            <button ref={mobileButtonRef} type="button" className={styles.menuButton} aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation" onClick={() => setMobileMenuOpen(open => !open)}>
              {mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>

          {coursesOpen && <div id="desktop-course-navigation" className={styles.courseDropdown}><CourseCategories onNavigate={closeMenus} /></div>}
        </div>

        {mobileMenuOpen && (
          <nav id="mobile-navigation" aria-label="Mobile navigation" className={styles.mobileNavigation}>
            <div className={styles.mobileIntro}>EXPLORE AEROCADMY</div>
            <button type="button" onClick={() => setMobileCoursesOpen(open => !open)} aria-expanded={mobileCoursesOpen} aria-controls="mobile-course-navigation" className={styles.mobileLink}>
              Courses<ChevronDown size={17} className={mobileCoursesOpen ? styles.rotated : undefined} />
            </button>
            {mobileCoursesOpen && (
              <div id="mobile-course-navigation" className={styles.mobileCourses}>
                {courseCategories.map(category => (
                  <div key={category}>
                    <button type="button" onClick={() => setMobileCategoryOpen(open => open === category ? null : category)} aria-expanded={mobileCategoryOpen === category} className={styles.mobileCategory}>
                      {category}<ChevronDown size={14} className={mobileCategoryOpen === category ? styles.rotated : undefined} />
                    </button>
                    {mobileCategoryOpen === category && <ul className={styles.mobileCourseList}>{recordedCourses.filter(course => course.group === category).map(course => <li key={course.slug}><Link href={`/courses/${course.slug}`} onClick={closeMenus}>{course.title}</Link></li>)}</ul>}
                  </div>
                ))}
                <Link href="/programs/drone-technology-internship" onClick={closeMenus} className={styles.mobileInternship}><span className={styles.liveDot} aria-hidden="true" />Live drone technology internship<ArrowRight size={16} /></Link>
              </div>
            )}
            {sectionLinks.map(({ label, href }) => <Link key={label} href={href} onClick={closeMenus} className={styles.mobileLink}>{label}<ArrowRight size={16} /></Link>)}
            <div className={styles.mobileBottom}>
              <Link href="/#counselling" onClick={closeMenus}>Need help choosing?<ArrowRight size={16} /></Link>
            </div>
          </nav>
        )}
      </header>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
