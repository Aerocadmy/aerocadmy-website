import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import styles from "./events.module.css";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({ title: "Drone Workshops & Events | Aerocadmy", description: "Explore hands-on drone workshops, AI drone sessions, classroom builds and field demonstrations from Aerocadmy instructor Yash Kansal's event portfolio.", path: "/events" });

const events = [
  {
    title: "Programmable AI drone workshop",
    place: "CIMAGE, Patna",
    format: "Three-day hands-on workshop",
    description:
      "Students explored programmable drone systems through a practical workshop built around learning, building, flying and analysing.",
    image: "/images/events/cimage-ai-drone-workshop.jpeg",
    alt: "CIMAGE programmable AI drone workshop poster and student event",
    className: styles.featureImage,
    featured: true,
  },
  {
    title: "From components to flight",
    place: "IIT Guwahati",
    format: "Drone and UAV building workshop",
    description:
      "A practical introduction to drone components, UAV building, flight dynamics and control, based on the instructor's workshop portfolio.",
    image: "/images/instructors/yash-kansal/iit-guwahati-workshop.jpg",
    alt: "Students taking part in a drone and UAV building workshop",
    className: styles.fieldImage,
  },
  {
    title: "Inside the drone build",
    place: "Hands-on learning",
    format: "Assembly session",
    description:
      "Participants work through the hardware together, seeing how the pieces connect before taking a drone into the field.",
    image: "/images/events/hands-on-assembly.jpeg",
    alt: "Workshop participants assembling and examining drone hardware together",
    className: styles.assemblyImage,
  },
  {
    title: "A closer look at the aircraft",
    place: "CIMAGE, Patna",
    format: "Live demonstration",
    description:
      "A classroom demonstration brings the aircraft into the room and gives students a chance to see the hardware up close.",
    image: "/images/events/cimage-drone-demo.jpeg",
    alt: "Instructor holding a drone during a classroom demonstration",
    className: styles.demoImage,
  },
  {
    title: "Robotics and drones bootcamp",
    place: "Student workshop",
    format: "Group learning",
    description:
      "A group workshop focused on exploring robotics and drone technology through shared, practical learning.",
    image: "/images/events/robotics-drone-bootcamp.jpeg",
    alt: "Workshop group gathered outside beneath a robotics and drones bootcamp banner",
    className: styles.groupImage,
  },
  {
    title: "Taking the build outdoors",
    place: "Field session",
    format: "Flight demonstration",
    description:
      "A field session connects the build with flight, giving learners a view of drones operating in an open environment.",
    image: "/images/events/field-flight-demo.webp",
    alt: "Drone flight demonstration in an open grassy field",
    className: styles.flightImage,
  },
];

export default function EventsPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      <main>
        <section className={styles.intro} aria-labelledby="events-title">
          <div className={styles.introCopy}>
            <p className={styles.kicker}>Events &amp; workshops</p>
            <h1 id="events-title">Drone learning, <span>out in the world.</span></h1>
            <p className={styles.lede}>
              A look at the workshops, classroom builds and field sessions where students get closer to how drones work.
            </p>
            <a className={styles.introLink} href="#workshops">Explore the event photos <ArrowRight size={17} aria-hidden="true" /></a>
          </div>
          <div className={styles.introPhoto}>
            <Image
              src="/images/events/cimage-drone-demo.jpeg"
              alt="An instructor presents a drone to students during a workshop"
              fill
              priority
              sizes="(max-width: 760px) 100vw, 45vw"
              quality={95}
            />
            <span className={styles.photoNote}>Learning by seeing, building and testing</span>
          </div>
          <span className={styles.introMark} aria-hidden="true">AEROCADMY&nbsp; / &nbsp;FIELD NOTES</span>
        </section>

        <section id="workshops" className={styles.collection} aria-labelledby="collection-title">
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.kicker}>A few moments from the field</p>
              <h2 id="collection-title">Workshops in action</h2>
            </div>
            <p>Past workshops and demonstrations led by instructor Yash Kansal, alongside hands-on learning sessions.</p>
          </div>

          <div className={styles.grid}>
            {events.map((event) => (
              <article key={event.title} className={`${styles.card} ${event.featured ? styles.featured : ""}`}>
                <div className={`${styles.imageFrame} ${event.className}`}>
                  <Image
                    src={event.image}
                    alt={event.alt}
                    fill
                    sizes={event.featured ? "(max-width: 760px) 100vw, 58vw" : "(max-width: 760px) 100vw, 38vw"}
                    quality={95}
                  />
                </div>
                <div className={styles.cardCopy}>
                  <div className={styles.cardMeta}><span>{event.place}</span><span>{event.format}</span></div>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.closing}>
          <div>
            <p className={styles.kicker}>Keep learning</p>
            <h2>Ready to get hands-on with drones?</h2>
            <p>Explore Aerocadmy’s learning paths and find a good place to begin.</p>
          </div>
          <Link href="/courses" className={styles.cta}>Explore programs <ArrowRight size={17} aria-hidden="true" /></Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
