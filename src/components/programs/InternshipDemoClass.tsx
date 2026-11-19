import { Clock, Radio, Sparkles, Users } from "lucide-react";
import { BATCH } from "@/lib/batch";
import { InternshipTrailer } from "./InternshipTrailer";
import { InternshipEnrollButton } from "./InternshipEnrollButton";
import { publicStorageUrl } from "@/lib/supabase";
import styles from "./InternshipDemoClass.module.css";

const videoUrl = publicStorageUrl("internships/drone-technology/Aerocadmy_Drone_Demo_Class_Telemetry.mp4");
const posterUrl = publicStorageUrl("internships/drone-technology/demo-class-poster.jpg");

const seeing = [
  { icon: Radio, title: "Real live classroom", text: "A clip from an actual Aerocadmy session, not a polished promo." },
  { icon: Users, title: "Learn with a cohort", text: "See how the instructor teaches and how students take part." },
  { icon: Sparkles, title: "Hands-on, not slides", text: "Watch drone telemetry explained with real hardware in mind." },
];

/** "Sit in on a class" section: a real class recording, played on demand. */
export function InternshipDemoClass() {
  return <section id="demo-class" className={styles.demo} aria-labelledby="demo-class-title">
    <div className={styles.glow} aria-hidden="true" />
    <header className={styles.head}>
      <p className={styles.eyebrow}><span className={styles.live} aria-hidden="true" />Demo class</p>
      <h2 id="demo-class-title">Take a seat in our classroom <em>before you enrol.</em></h2>
      <p className={styles.lead}>Not sure what a live Aerocadmy class feels like? Watch a short clip from a real session and judge how we teach for yourself.</p>
    </header>

    <div className={styles.frame}>
      <InternshipTrailer
        src={videoUrl}
        poster={posterUrl}
        posterAlt="Aerocadmy live drone class on Google Meet: the instructor explains telemetry modules on a shared screen"
        label="Play the Aerocadmy demo class on drone telemetry (4 min 50 s)"
        aspect="20 / 9"
        sizes="(max-width: 900px) 100vw, 760px"
        event="demo_class_played"
      />
      <div className={styles.caption}>
        <span><Clock size={14} aria-hidden="true" />4 min 50 s</span>
        <span className={styles.dot} aria-hidden="true" />
        <span>Class clip · Drone telemetry</span>
      </div>
    </div>

    <ul className={styles.points}>
      {seeing.map(({ icon: Icon, title, text }) => <li key={title}>
        <span className={styles.icon} aria-hidden="true"><Icon size={18} /></span>
        <div><h3>{title}</h3><p>{text}</p></div>
      </li>)}
    </ul>

    <div className={styles.cta}>
      <p>Like what you see? The next batch starts {BATCH.startLabel}.</p>
      <InternshipEnrollButton source="demo_class" className={styles.enroll}>Enroll now</InternshipEnrollButton>
    </div>
  </section>;
}
