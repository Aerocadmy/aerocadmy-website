import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookOpen, Check, FileText, Laptop, Layers, Video } from "lucide-react";
import { findRecordedCourse, recordedCourses } from "@/data/courses";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { CourseWaitlist } from "@/components/programs/CourseWaitlist";
import { CourseAction, CourseCurriculum, CourseDetailLayout, CourseSummaryCard } from "@/components/programs/CourseDetailLayout";
import styles from "@/components/programs/CourseDetail.module.css";
import { pageMetadata } from "@/lib/page-metadata";

export const dynamicParams = false;
export function generateStaticParams() { return recordedCourses.map(course => ({ slug: course.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = findRecordedCourse(slug);
  if (!course) return { title: "Course not found | Aerocadmy", robots: { index: false, follow: false } };
  return pageMetadata({ title: `${course.title} — Course Preview | Aerocadmy`, description: `Explore the proposed outline for ${course.title}. ${course.summary} Join the waitlist for updates.`, path: `/courses/${course.slug}` });
}

export default async function RecordedCoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = findRecordedCourse(slug);
  if (!course) notFound();
  return <div className={styles.page}>
    <Navbar />
    <CourseDetailLayout title={course.title} category={course.group} eyebrow="Upcoming recorded course · In development" summary={course.summary}
      facts={[{ icon: "video", label: "Recorded · Online" }, { icon: "modules", label: `${course.modules.length} planned modules` }, { icon: "online", label: "No drone required" }]}
      sections={[{ id: "overview", label: "Overview" }, { id: "curriculum", label: "Curriculum" }, { id: "project", label: "Your project" }, { id: "requirements", label: "Requirements" }]}
      sidebar={<CourseSummaryCard visual={course.visual}>
        <p className={styles.eyebrow}>Planned recorded course</p>
        <h2 className={styles.cardTitle}>Start with curiosity.</h2>
        <p className={styles.cardDescription}>Explore the outline and let us know you’re interested. Get course updates as the program develops.</p>
        <CourseAction href="#waitlist">Join the waitlist</CourseAction>
        <p className={styles.actionNote}>Register your interest · No payment required</p>
        <h3 className={styles.includesTitle}>The proposed learning experience</h3>
        <ul className={styles.included}>
          <li><Video size={16} aria-hidden="true" />Recorded online lessons</li>
          <li><BookOpen size={16} aria-hidden="true" />{course.modules.length} focused modules</li>
          <li><FileText size={16} aria-hidden="true" />A practical course project</li>
          <li><Laptop size={16} aria-hidden="true" />Activities without owning a drone</li>
        </ul>
      </CourseSummaryCard>}>
      <section id="overview" className={styles.section}>
        <h2>What you’ll learn</h2>
        <p className={styles.outcome}>{course.outcome}</p>
        <ul className={styles.learningPoints}>{course.modules.map(module => <li key={module}><Check size={17} aria-hidden="true" /><span>{module}</span></li>)}</ul>
        <div className={styles.audience}>
          <div><h3>Who this is for</h3><p>{course.audience}</p></div>
          <div><h3>Before you start</h3><p>{course.prerequisites}</p></div>
        </div>
      </section>
      <section id="curriculum" className={styles.section}>
        <div className={styles.sectionHeader}><h2>Course curriculum</h2><span>{course.modules.length} proposed modules</span></div>
        <CourseCurriculum modules={course.modules.map((title, index) => ({ title, description: course.curriculumNotes[index] }))} />
        <p className={styles.curriculumNote}>A preview of the planned scope. Lesson details will be confirmed as the course is developed.</p>
      </section>
      <section id="project" className={`${styles.section} ${styles.project}`}>
        <div className={styles.projectIcon} aria-hidden="true"><Layers size={27} /></div>
        <div><p className={styles.eyebrow}>Put it into practice</p><h2>Your proposed project</h2><p>{course.project}</p><p className={styles.projectFootnote}>A piece of work you can explain and demonstrate.</p></div>
      </section>
      <section id="requirements" className={styles.section}>
        <h2>Requirements & resources</h2>
        <ul className={styles.resources}>{course.resources.map(resource => <li key={resource}>{resource}</li>)}</ul>
        {course.note && <p className={styles.note}>{course.note}</p>}
        <p className={styles.note}>Final software, computer requirements and learning resources will be confirmed before enrolment opens. Fees, duration, release dates, certificates and hardware bundles have not been announced.</p>
      </section>
      <CourseWaitlist key={course.slug} slug={course.slug} title={course.title} />
      <p className={styles.closing}>This is a planned course preview. Industry connections describe learning directions; completion does not guarantee employment or a professional qualification. The live internship’s kit and benefits apply to that program.</p>
    </CourseDetailLayout>
    <Footer />
  </div>;
}
