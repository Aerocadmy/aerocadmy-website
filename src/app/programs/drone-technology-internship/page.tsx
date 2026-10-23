import type { Metadata } from "next";
import { Box, Check, Download, FileCheck2, HeartHandshake, Layers, Users, Video } from "lucide-react";
import Image from "next/image";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { CourseAction, CourseCurriculum, CourseDetailLayout, CourseSummaryCard } from "@/components/programs/CourseDetailLayout";
import { InternshipInstructor } from "@/components/programs/InternshipInstructor";
import { InternshipEnrolment } from "@/components/programs/InternshipEnrolment";
import { InternshipEnrollButton } from "@/components/programs/InternshipEnrollButton";
import { StudentShowcase } from "@/components/testimonials/StudentShowcase";
import { ReviewRating } from "@/components/testimonials/ReviewRating";
import styles from "@/components/programs/CourseDetail.module.css";
import { publicStorageUrl } from "@/lib/supabase";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({ title: "Six-week Live Drone Technology Internship | Aerocadmy", description: "Explore Aerocadmy’s six-week live online drone technology internship. ₹6,999 including an ESP32 drone kit to keep. Next batch starts 15 November 2026.", path: "/programs/drone-technology-internship", image: { url: "/programs/drone-technology-internship/opengraph-image", alt: "Six-week live Drone Technology Internship with Aerocadmy" } });
const brochureUrl = publicStorageUrl("internships/drone-technology/Aerocadmy_Internship_Details.pdf");
const brochurePreviewUrl = publicStorageUrl("internships/drone-technology/brochure-preview.jpg");
const weeks = [
  { title: "Drone foundations & airspace", topics: ["Drone types & components", "Lift, thrust & stability", "Introduction to DGCA rules & Digital Sky", "Mission planning & waypoints", "Live quiz & airspace exploration"] },
  { title: "Aerodynamics & virtual drone design", topics: ["Thrust-to-weight ratio", "Motor, propeller & battery selection", "Frame layouts, weight distribution & balance", "3D modelling in Tinkercad", "Virtual flight physics experiments"] },
  { title: "Electronics & drone hardware", topics: ["Motors, batteries, IMUs & flight controllers", "Circuit building in Tinkercad Circuits", "Power distribution, wiring & safety", "ESP32 drone architecture", "Introduction to firmware flashing"] },
  { title: "Flight control & programming", topics: ["Gyroscope & accelerometer basics", "How a flight controller works", "PID tuning in a simulator", "Arduino IDE & ESP32 programming basics", "Modify, upload & run simple drone code"] },
  { title: "Physical kit assembly & first flight", topics: ["Kit unboxing, assembly & safety inspection", "Mobile app connection & controls", "Sensor calibration", "Motor testing & rotation checks", "First hover, throttle control & landing"] },
  { title: "Flight improvement & final project", topics: ["Trim & drift correction", "Basic tuning & performance improvement", "Mini drone project", "Flight demonstration video", "Final presentation, mentor feedback & career roadmap"] },
];
const learningPoints = ["Drone systems and flight principles", "Electronics and drone hardware", "Flight control and programming", "Kit assembly, testing and a final project"];

export default function InternshipPage() {
  return <div className={styles.page}><Navbar />
    <CourseDetailLayout title="Drone Technology Internship" category="Live online program" eyebrow="Live online · Enrolment open"
      reviewSummary={<ReviewRating />}
      summary="Build your understanding through live classes, practical activities, and an ESP32 drone kit you keep."
      facts={[{ icon: "calendar", label: "6 weeks" }, { icon: "video", label: "Live classes + recordings" }, { icon: "kit", label: "ESP32 kit included" }]}
      sections={[{ id: "overview", label: "Overview" }, { id: "curriculum", label: "Six-week journey" }, { id: "brochure", label: "Brochure" }, { id: "project", label: "Practical learning" }, { id: "kit", label: "Your kit" }, { id: "instructor", label: "Instructor" }, { id: "reviews", label: "Reviews" }]}
      sidebar={<CourseSummaryCard featuredVisual visual={{ src: "/images/courses/foundations.png", quadrant: 3, alt: "Hands assembling a compact educational micro-drone" }} caption="Illustrative learning scene · Final kit may differ">
        <p className={styles.eyebrow}>Training + ESP32 drone kit</p>
        <div className={styles.discountPrice}><del className={styles.oldPrice}>₹11,999</del><strong className={styles.price}>₹6,999</strong></div>
        <p className={styles.batch}>Next batch · 15 November 2026</p>
        <InternshipEnrollButton className={`${styles.heroAction} ${styles.centeredAction}`}>Enroll now</InternshipEnrollButton>
        <CourseAction href="/#counselling" secondary centered>Talk to a counsellor</CourseAction>
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
      <section id="brochure" className={styles.brochure} aria-labelledby="brochure-title">
        <a className={styles.brochurePreview} href={brochureUrl} target="_blank" rel="noreferrer" aria-label="Open the internship brochure PDF">
          <Image src={brochurePreviewUrl} alt="Cropped 16:9 preview of the Aerocadmy six-week drone internship brochure cover" width={1620} height={911} quality={100} sizes="(max-width: 600px) 100vw, (max-width: 900px) 80vw, 40vw" />
          <span>Preview brochure</span>
        </a>
        <div className={styles.brochureCopy}>
          <p className={styles.eyebrow}>Keep the details with you</p>
          <h2 id="brochure-title">Your internship, at a glance.</h2>
          <p>See the six-week plan, learning activities and program highlights in the brochure.</p>
          <div className={styles.brochureActions}>
            <a className={`${styles.brochureDownload} dark-action`} href={brochureUrl} download="Aerocadmy_Internship_Brochure.pdf"><span>Download brochure</span><Download size={18} aria-hidden="true" /></a>
            <span className={styles.brochureMeta}>PDF · 7.3 MB</span>
          </div>
        </div>
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
        <p>The ₹6,999 fee includes an ESP32 drone kit that you keep. The kit is under development and is expected to be ready in October 2026.</p>
        <p className={styles.note}>Before enrolling, speak with the team to confirm kit delivery, class timings and equipment requirements for the batch starting 15 November 2026.</p>
      </section>
      <InternshipInstructor />
      <StudentShowcase />
      <p className={styles.closing}>The included kit, fee and benefits on this page apply to the live internship. Upcoming recorded courses are separate offerings. Career guidance does not guarantee employment.</p>
    </CourseDetailLayout>
    <InternshipEnrolment />
    <Footer />
  </div>;
}
