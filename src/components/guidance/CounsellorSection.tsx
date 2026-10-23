"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, MessageCircle, Phone } from "lucide-react";
import { callbackWindows, droneExperience, learningFormats, learningGoals, learningInterests, professions, type CounsellingInput } from "@/data/guidance";
import styles from "./LearningGuidance.module.css";

const emptyForm: CounsellingInput = { profession: "", fieldOfWork: "", experience: "", interest: "", goal: "", format: "", name: "", phone: "", email: "", callbackWindow: "No preference", questions: "" };
const stepNames = ["Your background", "Your direction", "Let’s connect"];

export function CounsellorSection() {
  const id = useId();
  const [step, setStep] = useState(0);
  const [fields, setFields] = useState<CounsellingInput>(emptyForm);
  const [status, setStatus] = useState<"idle" | "saving" | "error" | "success">("idle");
  const [error, setError] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  function change(field: keyof CounsellingInput, value: string) { setFields(previous => ({ ...previous, [field]: value })); }
  function moveStep(next: number) { setStep(next); setStatus("idle"); setError(""); requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true })); }
  function select(field: keyof CounsellingInput, label: string, options: readonly string[]) {
    return <label htmlFor={`${id}-${field}`}>{label}<select id={`${id}-${field}`} value={fields[field]} onChange={event => change(field, event.target.value)} required><option value="" disabled>Select an option</option>{options.map(option => <option key={option} value={option}>{option}</option>)}</select></label>;
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "saving") return;
    if (step < 2) { moveStep(step + 1); return; }
    setStatus("saving"); setError("");
    try {
      const response = await fetch("/api/counselling", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(fields) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We couldn't save your request. Please try again.");
      setStatus("success");
    } catch (failure) { setStatus("error"); setError(failure instanceof Error ? failure.message : "We couldn't connect. Please try again."); }
  }

  return <section id="counselling" aria-labelledby={`${id}-heading`} className={styles.counselling}>
    <div className={`${styles.container} ${styles.counsellingGrid}`}>
      <div className={styles.counsellingIntro}>
        <p className={styles.eyebrow}>A conversation can help</p><h2 id={`${id}-heading`}>Still confused<br /> where to start?</h2>
        <p className={styles.counsellingDescription}>Connect with an Aerocadmy counsellor. Share a little about yourself so the conversation can start with what matters to you.</p>
        <div className={styles.conversationMap} aria-hidden="true"><span className={styles.youNode}>You</span><div><span>{fields.profession || "Your background"}</span><span>{fields.interest || "Your interests"}</span><span>{fields.goal || "Your goals"}</span></div><span className={styles.directionNode}>A clearer next step<ArrowUpRight size={15} /></span></div>
        <div className={styles.callNote}><MessageCircle size={20} aria-hidden="true" /><p>A few questions before we connect.<br /><span>No course commitment or payment required.</span></p></div>
      </div>
      <div className={styles.counsellingForm}>
        {status === "success" ? <div className={styles.success} role="status"><CheckCircle2 size={32} aria-hidden="true" /><p className={styles.eyebrow}>Request saved</p><h3>We have your starting point.</h3><p>Your callback request and answers have been saved for the Aerocadmy team. Your preferred time is a request, not a confirmed appointment.</p><p className={styles.savedSummary}>Interest: {fields.interest}<br />Goal: {fields.goal}<br />Preferred call time: {fields.callbackWindow} (IST)</p></div> : <>
          <ol className={styles.formSteps} aria-label="Counselling request steps">{stepNames.map((name, index) => <li key={name} aria-current={step === index ? "step" : undefined}><span>{index < step ? <CheckCircle2 size={16} aria-hidden="true" /> : `0${index + 1}`}</span>{name}</li>)}</ol>
          <h3 ref={headingRef} tabIndex={-1} className={styles.formHeading}>{stepNames[step]}</h3>
          <p className={styles.stepDescription}>{step === 0 ? "Help us understand where you’re starting from." : step === 1 ? "Tell us what you’d like to explore. It’s fine to be unsure." : "Where can the team reach you?"}</p>
          <form onSubmit={submit} className={styles.form} aria-busy={status === "saving"}>
            <fieldset disabled={status === "saving"}>
              {step === 0 && <>
                {select("profession", "What are you doing right now?", professions)}
                <label htmlFor={`${id}-fieldOfWork`}>Your field of study or work <span>(optional)</span><input id={`${id}-fieldOfWork`} value={fields.fieldOfWork} onChange={event => change("fieldOfWork", event.target.value)} maxLength={150} placeholder="For example, mechanical engineering or IT" /></label>
                {select("experience", "Which best describes your drone experience?", droneExperience)}
              </>}
              {step === 1 && <>
                {select("interest", "What interests you most?", learningInterests)}
                {select("goal", "What would you like this learning to help you do?", learningGoals)}
                {select("format", "How would you prefer to learn?", learningFormats)}
              </>}
              {step === 2 && <>
                <label htmlFor={`${id}-name`}>Your name<input id={`${id}-name`} autoComplete="name" value={fields.name} onChange={event => change("name", event.target.value)} required minLength={2} maxLength={100} placeholder="Your full name" /></label>
                <div className={styles.formRow}><label htmlFor={`${id}-phone`}>Phone number<input id={`${id}-phone`} type="tel" inputMode="tel" autoComplete="tel" value={fields.phone} onChange={event => change("phone", event.target.value)} required maxLength={32} placeholder="Include country code" /></label><label htmlFor={`${id}-email`}>Email address<input id={`${id}-email`} type="email" autoComplete="email" value={fields.email} onChange={event => change("email", event.target.value)} required maxLength={254} placeholder="you@example.com" /></label></div>
                <label htmlFor={`${id}-callbackWindow`}>Preferred call time <span>(IST · optional)</span><select id={`${id}-callbackWindow`} value={fields.callbackWindow} onChange={event => change("callbackWindow", event.target.value)}>{callbackWindows.map(value => <option key={value}>{value}</option>)}</select></label>
                <label htmlFor={`${id}-questions`}>Anything you’d like to ask the counsellor? <span>(optional)</span><textarea id={`${id}-questions`} rows={3} maxLength={1000} value={fields.questions} onChange={event => change("questions", event.target.value)} placeholder="Tell us about a project, a course question, or what you’re unsure about." /></label>
                <p className={styles.contactNotice}>By requesting a call, you ask Aerocadmy to contact you about your learning enquiry using these details. The team will confirm availability.</p>
              </>}
              {status === "error" && <p role="alert" className={styles.error}>{error}</p>}
              <div className={styles.formActions}>{step > 0 && <button type="button" className={styles.backButton} onClick={() => moveStep(step - 1)}><ArrowLeft size={15} aria-hidden="true" />Back</button>}<button type="submit" className={`${styles.submitButton} dark-action`}>{status === "saving" ? "Saving your request…" : step === 2 ? "Request a counsellor call" : "Continue"}{step === 2 ? <Phone size={15} aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}</button></div>
            </fieldset>
          </form>
        </>}
      </div>
    </div>
  </section>;
}
