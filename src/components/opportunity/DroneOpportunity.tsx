"use client";

import Image from "next/image";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight } from "lucide-react";
import { droneIndustries } from "@/data/drone-industries";
import styles from "./DroneOpportunity.module.css";

// Each generated atlas contains a lead photograph and three skill photographs.
// CSS displays one quadrant at a time without modifying the source image.
function IndustryPhoto({ industry, quadrant, alt, lead = false }: {
  industry: string; quadrant: number; alt: string; lead?: boolean;
}) {
  return (
    <div className={`${styles.photo} ${lead ? styles.leadPhoto : ""}`}>
      <Image
        src={`/images/industries/${industry}.png`}
        alt={`Illustrative scene: ${alt}`}
        width={1536}
        height={1024}
        sizes={lead ? "(max-width: 640px) 90vw, (max-width: 1000px) 36vw, 420px" : "(max-width: 640px) 90vw, (max-width: 1000px) 24vw, 290px"}
        className={styles.atlas}
        style={{ left: quadrant % 2 === 0 ? "0%" : "-100%", top: quadrant < 2 ? "0%" : "-100%" }}
      />
    </div>
  );
}

export function DroneOpportunity() {
  const [active, setActive] = useState(0);
  const instanceId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const industry = droneIndustries[active];

  function selectIndustry(index: number, focus = false) {
    setActive(index);
    const tab = tabRefs.current[index];
    if (focus) tab?.focus({ preventScroll: true });
    if (tab && tab.parentElement) {
      const strip = tab.parentElement;
      const left = tab.offsetLeft - strip.offsetLeft;
      if (left < strip.scrollLeft || left + tab.offsetWidth > strip.scrollLeft + strip.clientWidth) {
        strip.scrollTo({ left: left - (strip.clientWidth - tab.offsetWidth) / 2,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
      }
    }
  }

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === "ArrowRight") next = (index + 1) % droneIndustries.length;
    else if (event.key === "ArrowLeft") next = (index + droneIndustries.length - 1) % droneIndustries.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = droneIndustries.length - 1;
    else return;
    event.preventDefault();
    selectIndustry(next, true);
  }

  return (
    <section id="why-drone-technology" aria-labelledby={`${instanceId}-heading`} className={styles.section}>
      <div className={styles.container}>
        <header className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>The drone ecosystem</p>
            <h2 id={`${instanceId}-heading`}>Drone technology.<br />Where could it take you?</h2>
          </div>
          <p className={styles.introduction}>Explore an industry. Discover the work.<br className={styles.desktopBreak} /> Find the skills behind it.</p>
        </header>

        <div className={styles.industryPicker}>
          <p className={styles.pickerLabel}>Choose a direction <ArrowRight size={14} aria-hidden="true" /></p>
          <div role="tablist" aria-label="Explore drone industries" className={styles.tabs}>
            {droneIndustries.map((item, index) => (
              <button
                ref={element => { tabRefs.current[index] = element; }}
                key={item.id} id={`${instanceId}-tab-${item.id}`} type="button" role="tab"
                aria-selected={active === index} aria-controls={`${instanceId}-panel`}
                tabIndex={active === index ? 0 : -1}
                onClick={() => selectIndustry(index)} onKeyDown={event => navigate(event, index)}
                className={active === index ? styles.activeTab : undefined}
              >{item.name}</button>
            ))}
          </div>
        </div>

        <div id={`${instanceId}-panel`} role="tabpanel" aria-labelledby={`${instanceId}-tab-${industry.id}`} tabIndex={0} className={styles.panel}>
          <div key={industry.id} className={styles.content}>
            <div className={styles.industry}>
              <IndustryPhoto industry={industry.id} quadrant={0} alt={industry.imageDescription} lead />
              <div className={styles.industryCaption}>
                <h3>{industry.name}</h3>
                <p>{industry.introduction}</p>
              </div>
            </div>

            <div className={styles.pathway}>
              <p className={styles.pathwayLabel}>The work. The skills. The possibilities.</p>
              <ol className={styles.steps} aria-label={`Skills used in ${industry.name}`}>
                {industry.steps.map((step, index) => (
                  <li key={step.title} className={styles.step}>
                    <div className={styles.stepVisual}>
                      <IndustryPhoto industry={industry.id} quadrant={index + 1} alt={step.imageDescription} />
                      {index < industry.steps.length - 1 && <span className={styles.connector} aria-hidden="true"><span /></span>}
                    </div>
                    <div className={styles.stepCaption}>
                      <h4><span>{String(index + 1).padStart(2, "0")} /</span> {step.title}</h4>
                      <p>{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className={styles.skills}>
                <p className={styles.skillsLabel}>Skills to explore</p>
                <ul aria-label="Related skills">{industry.skills.map(skill => <li key={skill}>{skill}</li>)}</ul>
              </div>
            </div>
          </div>
        </div>
        <p className={styles.note}>Illustrative industry scenes and possible learning directions.</p>
      </div>
    </section>
  );
}
