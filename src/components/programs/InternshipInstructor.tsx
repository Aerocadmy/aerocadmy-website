import Image from "next/image";
import styles from "./InternshipInstructor.module.css";

const experience = [
  { company: "Qonevo / Synergy Global", role: "Product & training", detail: "STEM and aeromodelling teaching, practical activities and lesson development." },
  { company: "AITMC Ventures", role: "Drone testing & support", detail: "Flight testing, controller calibration, tuning and flight-log analysis." },
  { company: "Garuda Aerospace", role: "Drone hardware & operations", detail: "Multirotor assembly, troubleshooting and agricultural drone systems." },
];

const workshops = [
  { title: "IIT Guwahati", topic: "Drone/UAV building workshop", image: "/images/instructors/yash-kansal/iit-guwahati-workshop.jpg", width: 1024, height: 768, alt: "Drone components being demonstrated to participants at an IIT Guwahati workshop" },
  { title: "CIMAGE, Patna", topic: "Programmable AI drone workshop", image: "/images/instructors/yash-kansal/cimage-patna-workshop.jpg", width: 1024, height: 575, alt: "A classroom session during the programmable AI drone workshop at CIMAGE, Patna" },
];

export function InternshipInstructor() {
  return <section id="instructor" className={styles.section} aria-labelledby="internship-instructor-title">
    <p className={styles.eyebrow}>The person behind the sessions</p>
    <h2 id="internship-instructor-title">Meet your instructor</h2>

    <div className={styles.profile}>
      <figure className={styles.portrait}>
        <Image src="/images/instructors/yash-kansal/portrait.webp" alt="Yash Kansal with FPV goggles and a drone controller" width={1024} height={768} quality={100} sizes="(max-width: 600px) 160px, 180px" />
      </figure>
      <div className={styles.bio}>
        <h3>Yash Kansal</h3>
        <p className={styles.role}>Drone instructor · UAV & robotics engineer</p>
        <p>Yash brings together practical UAV engineering and experience teaching drone technology. His work spans drone assembly, flight testing, controller tuning and troubleshooting, alongside workshops for students and professionals.</p>
        <ul className={styles.focus} aria-label="Areas of experience"><li>UAV systems</li><li>Flight control</li><li>Embedded electronics</li></ul>
      </div>
    </div>

    <div className={styles.experience}>
      <h3>Industry & teaching experience</h3>
      <ul>{experience.map(item => <li key={item.company}><p className={styles.experienceRole}>{item.role}</p><h4>{item.company}</h4><p>{item.detail}</p></li>)}</ul>
    </div>

    <div className={styles.teaching}>
      <h3>Teaching in practice</h3>
      <p>A look at his previous in-person workshops. Your Aerocadmy internship is delivered online.</p>
      <div className={styles.gallery}>{workshops.map(workshop => <figure key={workshop.title}>
          <div className={styles.workshopPhoto}><Image src={workshop.image} alt={workshop.alt} width={workshop.width} height={workshop.height} quality={100} sizes="(max-width: 600px) 90vw, (max-width: 900px) 44vw, 360px" /></div>
          <figcaption><span><strong>{workshop.title}</strong><span>{workshop.topic}</span></span></figcaption>
      </figure>)}</div>
      <p className={styles.credit}>Examples of the instructor’s previous in-person workshops.</p>
    </div>
  </section>;
}
