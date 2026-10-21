"use client";

import { useId, useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import styles from "./CourseDetail.module.css";

export function CourseWaitlist({ slug, title }: { slug: string; title: string }) {
  const id = useId();
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "saving") return;
    const form = event.currentTarget;
    const values = new FormData(form);
    setStatus("saving"); setError("");
    try {
      const response = await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug: slug, name: values.get("name"), phone: values.get("phone"), email: values.get("email") }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We couldn't save your request. Please try again.");
      setStatus("success"); form.reset();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "We couldn't connect. Please try again."); setStatus("error");
    }
  }
  return <section id="waitlist" className={styles.waitlist} aria-labelledby={`${id}-heading`}>
    <p className={styles.eyebrow}>Help shape what comes next</p>
    <h2 id={`${id}-heading`}>Join the waitlist</h2>
    <p>Register your interest in <strong>{title}</strong>. We’ll use your details for updates about this course.</p>
    {status === "success" ? <div className={styles.success} role="status"><CheckCircle2 size={24} aria-hidden="true" /><div><h3>You’re on the waitlist.</h3><p>Your interest in this course has been saved. Joining the waitlist does not enrol you or require payment.</p></div></div> :
      <form onSubmit={submit} className={styles.form} aria-busy={status === "saving"}>
        <label htmlFor={`${id}-course`}>Selected course<input id={`${id}-course`} value={title} readOnly className={styles.selectedCourse} /></label>
        <label htmlFor={`${id}-name`}>Your name<input id={`${id}-name`} name="name" autoComplete="name" required minLength={2} maxLength={100} placeholder="Your full name" /></label>
        <div className={styles.formRow}>
          <label htmlFor={`${id}-phone`}>Phone number<input id={`${id}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={32} placeholder="Include country code" /></label>
          <label htmlFor={`${id}-email`}>Email address<input id={`${id}-email`} name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" /></label>
        </div>
        {status === "error" && <p className={styles.error} role="alert">{error}</p>}
        <button type="submit" disabled={status === "saving"}>{status === "saving" ? "Saving your interest…" : "Join the waitlist"}<ArrowUpRight size={17} aria-hidden="true" /></button>
        <p className={styles.formNote}>This course is being planned. Pricing, duration, software, and release dates will be shared once confirmed.</p>
      </form>}
  </section>;
}
