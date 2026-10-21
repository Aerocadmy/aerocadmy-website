import Link from "next/link";
import { ArrowRight, CircuitBoard, Layers, Radio } from "lucide-react";
import { courseCategories } from "@/data/course-categories";
import { recordedCourses } from "@/data/courses";
import styles from "./Navbar.module.css";

export function CourseCategories({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className={styles.courseMenu}>
      <div className={styles.menuHeading}><span>FIND YOUR NEXT STEP</span><Link href="/courses" onClick={onNavigate}>All programs<ArrowRight size={15} /></Link></div>
      <div className={styles.courseColumns}>
        {courseCategories.map((category, index) => (
          <div key={category} className={styles.courseGroup}>
            <h2>{index === 0 ? <CircuitBoard size={20} /> : <Layers size={20} />}{category}</h2>
            <p>Upcoming recorded courses</p>
            <ul>{recordedCourses.filter(course => course.group === category).map(course => <li key={course.slug}><Link href={`/courses/${course.slug}`} onClick={onNavigate}>{course.title}<ArrowRight size={14} /></Link></li>)}</ul>
          </div>
        ))}
        <div className={styles.liveProgram}>
          <span className={styles.liveLabel}><span className={styles.liveDot} />LIVE ONLINE · ENROLMENT OPEN</span>
          <Radio size={30} strokeWidth={1.4} className={styles.liveIcon} aria-hidden="true" />
          <h2>Learn together.<br />Build your drone.</h2>
          <p>Explore the six-week Drone Technology Internship.</p>
          <Link href="/programs/drone-technology-internship" onClick={onNavigate}>Explore internship<ArrowRight size={17} /></Link>
        </div>
      </div>
    </div>
  );
}
