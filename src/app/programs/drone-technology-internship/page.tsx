import type { Metadata } from "next";
import { Box, Check, Download, FileCheck2, FileText, HeartHandshake, Layers, Users, Video } from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { CourseAction, CourseCurriculum, CourseDetailLayout, CourseSummaryCard } from "@/components/programs/CourseDetailLayout";
import { InternshipInstructor } from "@/components/programs/InternshipInstructor";
import { InternshipEnrolment } from "@/components/programs/InternshipEnrolment";
import styles from "@/components/programs/CourseDetail.module.css";

export const metadata: Metadata = { title: "Six-week Live Drone Technology Internship | Aerocadmy", description: "Explore Aerocadmy’s six-week live online drone technology internship. ₹4,999 including an ESP32 drone kit to keep. Next batch starts 15 November 2026." };
const weeks = [
  { title: "Drone foundations & airspace", description: "Begin with drone foundations and the airspace context for practical learning." },
  { title: "Aerodynamics & virtual drone design", description: "Explore flight principles and connect them to a virtual drone design." },
  { title: "Electronics & drone hardware", description: "Understand the electronics and hardware that make up the drone system." },
  { title: "Flight control & programming", description: "Connect programming with flight control and explore how a drone responds." },
  { title: "Physical kit assembly & first flight", description: "Bring the components together through physical kit assembly and first-flight activities." },
  { title: "Flight improvement & final project", description: "Review flight behaviour, work on improvements, and present your final project." },
];
const learningPoints = ["Drone systems and flight principles", "Electronics and drone hardware", "Flight control and programming", "Kit assembly, testing and a final project"];

export default function InternshipPage() {
  return <div className={styles.page}><Navbar />
    <CourseDetailLayout title="Drone Technology Internship" category="Live online program" eyebrow="Live online · Enrolment open"
      summary="Build your understanding through live classes, practical activities, and an ESP32 drone kit you keep."
      facts={[{ icon: "calendar", label: "6 weeks" }, { icon: "video", label: "Live classes + recordings" }, { icon: "kit", label: "ESP32 kit included" }]}
      sections={[{ id: "overview", label: "Overview" }, { id: "curriculum", label: "Six-week journey" }, { id: "project", label: "Practical learning" }, { id: "kit", label: "Your kit" }, { id: "instructor", label: "Instructor" }]}
      sidebar={<CourseSummaryCard visual={{ src: "/images/courses/foundations.png", quadrant: 3, alt: "Hands assembling a compact educational micro-drone" }} caption="Illustrative learning scene · Final kit may differ">
        <p className={styles.eyebrow}>Training + ESP32 drone kit</p>
        <strong className={styles.price}>₹4,999</strong>
        <p className={styles.batch}>Next batch · 15 November 2026</p>
        <CourseAction href="#enrolment">Enrol now</CourseAction>
        <CourseAction href="/#counselling" secondary>Talk to a counsellor</CourseAction>
        <h2 className={styles.includesTitle}>Your internship includes</h2>
        <ul className={styles.included}>
          <li><Box size={16} aria-hidden="true" />An ESP32 drone kit to keep</li>
          <li><Video size={16} aria-hidden="true" />Live classes and recordings</li>
          <li><Users size={16} aria-hidden="true" />Lifetime community access</li>
          <li><HeartHandshake size={16} aria-hidden="true" />Career guidance and support</li>
        </ul>
      </CourseSummaryCard>}>
      <section id="overview" className={styles.section}>
        <h2>What you’ll explore</h2>
        <p className={styles.outcome}>Follow the connections between drone technology, programming and a physical build through six weeks of guided learning.</p>
        <ul className={styles.learningPoints}>{learningPoints.map(point => <li key={point}><Check size={17} aria-hidden="true" /><span>{point}</span></li>)}</ul>
      </section>
      <section id="curriculum" className={styles.section}>
        <div className={styles.sectionHeader}><h2>Your six-week journey</h2><span>6 weeks · Live online</span></div>
        <CourseCurriculum modules={weeks} label="Week" />
      </section>
      <section id="project" className={`${styles.section} ${styles.project}`}>
        <div className={styles.projectIcon} aria-hidden="true"><Layers size={27} /></div>
        <div><p className={styles.eyebrow}>From understanding to doing</p><h2>Build. Test. Explain.</h2><p>The program includes weekly activities, quizzes, practical submissions, and a final project presentation.</p><p className={styles.projectFootnote}>Bring your learning together in a project you can present.</p></div>
      </section>
      <section className={styles.section}>
        <h2>Practical learning & assessment</h2>
        <p>The internship certificate is based on attendance, submissions, flight milestones, and completion of the required practical activities.</p>
        <ul className={styles.learningPoints}>
          <li><FileCheck2 size={17} aria-hidden="true" /><span>Weekly activities and practical submissions</span></li>
          <li><FileCheck2 size={17} aria-hidden="true" /><span>A final project presentation</span></li>
        </ul>
      </section>
      <section id="kit" className={styles.section}>
        <h2>Your ESP32 kit & learning setup</h2>
        <p>The ₹4,999 fee includes an ESP32 drone kit that you keep. The kit is under development and is expected to be ready in October 2026.</p>
        <p className={styles.note}>Before enrolling, speak with the team to confirm kit delivery, class timings and equipment requirements for the batch starting 15 November 2026.</p>
      </section>
      <InternshipInstructor />
      <section id="brochure" className={styles.brochure} aria-labelledby="brochure-title">
        <div className={styles.brochureIcon} aria-hidden="true"><FileText size={32} strokeWidth={1.5} /><span>PDF</span></div>
        <div className={styles.brochureCopy}>
          <p className={styles.eyebrow}>Keep the details with you</p>
          <h2 id="brochure-title">Your internship, at a glance.</h2>
          <p>Download the internship brochure to read through the program details in your own time.</p>
          <a className={styles.brochureDownload} href="/Aerocadmy_Internship_Details.pdf" download="Aerocadmy_Internship_Brochure.pdf">Download brochure <Download size={18} aria-hidden="true" /></a>
          <span className={styles.brochureMeta}>PDF · 7.3 MB</span>
        </div>
      </section>
      <InternshipEnrolment />
      <p className={styles.closing}>The included kit, fee and benefits on this page apply to the live internship. Upcoming recorded courses are separate offerings. Career guidance does not guarantee employment.</p>
    </CourseDetailLayout>
    <Footer />
  </div>;
}
