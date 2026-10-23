import { ImageResponse } from "next/og";

const size = { width: 1200, height: 630 };

function card({
  label,
  category,
  title,
  description,
  highlights,
  footer,
}: {
  label: string;
  category: string;
  title: string;
  description: string;
  highlights: string[];
  footer: string;
}) {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", overflow: "hidden", background: "#f4faf7", color: "#132636", fontFamily: "Arial, sans-serif" }}>
      <div style={{ position: "absolute", right: -115, top: -220, width: 650, height: 650, borderRadius: 999, background: "#e2f4ec", display: "flex" }} />
      <div style={{ position: "absolute", right: 28, top: 62, width: 465, height: 465, borderRadius: 999, border: "1px solid #b9ded0", display: "flex" }} />
      <div style={{ position: "absolute", right: 95, top: 130, width: 330, height: 330, borderRadius: 999, border: "1px solid #cce7dc", display: "flex" }} />
      <div style={{ width: 760, padding: "58px 28px 50px 74px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 21, fontWeight: 800, letterSpacing: "1px" }}>
          <div style={{ width: 12, height: 12, borderRadius: 99, background: "#087957", display: "flex" }} />
          AEROCADMY
          <span style={{ color: "#8aa097", fontSize: 13, fontWeight: 500, letterSpacing: "0px", marginLeft: 4 }}>DRONE TECHNOLOGY ACADEMY</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 660 }}>
          <div style={{ color: "#087957", fontSize: 15, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 14 }}>{label}</div>
          <div style={{ color: "#62766f", fontSize: 16, fontWeight: 600, marginBottom: 10 }}>{category}</div>
          <div style={{ fontSize: title.length > 38 ? 43 : 52, lineHeight: 1.08, fontWeight: 750, letterSpacing: "-1.5px", maxWidth: 650 }}>{title}</div>
          <div style={{ marginTop: 18, color: "#536a65", fontSize: 19, lineHeight: 1.42, maxWidth: 630 }}>{description}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 11, color: "#087957", fontSize: 15, fontWeight: 700, letterSpacing: "1px" }}>
          <div style={{ width: 30, height: 2, background: "#18cb96", display: "flex" }} />
          AEROCADMY.COM <span style={{ color: "#8aa097", fontWeight: 400, letterSpacing: "0px" }}>· {footer}</span>
        </div>
      </div>
      <div style={{ position: "absolute", right: 70, top: 178, width: 410, display: "flex", flexDirection: "column", gap: 17 }}>
        <div style={{ borderRadius: 20, background: "rgba(255,255,255,.88)", border: "1px solid #d9ebe3", padding: "25px 27px", display: "flex", flexDirection: "column", boxShadow: "0 18px 50px rgba(19,38,54,.08)" }}>
          <div style={{ color: "#087957", fontSize: 13, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 19 }}>LEARNING PREVIEW</div>
          {highlights.map((highlight, index) => (
            <div key={highlight} style={{ display: "flex", alignItems: "center", gap: 12, borderTop: "1px solid #e8f0ec", padding: "14px 0", color: "#304a43", fontSize: 17 }}>
              <div style={{ width: 25, height: 25, borderRadius: 99, background: "#e7f6ef", color: "#087957", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{String(index + 1).padStart(2, "0")}</div>
              {highlight}
            </div>
          ))}
        </div>
        <div style={{ alignSelf: "flex-start", padding: "10px 15px", borderRadius: 99, background: "#e4f4ec", color: "#087957", fontSize: 13, fontWeight: 700, letterSpacing: ".6px" }}>{footer}</div>
      </div>
    </div>,
    size,
  );
}

export function courseSocialImage(course: { title: string; group: string; summary: string; modules: string[] }) {
  return card({
    label: "COURSE PREVIEW · IN DEVELOPMENT",
    category: course.group,
    title: course.title,
    description: course.summary,
    highlights: course.modules.slice(0, 3),
    footer: "Join the waitlist",
  });
}

export function internshipSocialImage() {
  return card({
    label: "SIX-WEEK LIVE PROGRAM · ENROLMENT OPEN",
    category: "Live online · Training + ESP32 drone kit",
    title: "Drone Technology Internship",
    description: "Build your understanding through live classes, practical activities, and an ESP32 drone kit you keep.",
    highlights: ["Six weeks of guided learning", "Live classes and recordings", "ESP32 drone kit included"],
    footer: "Next batch · 15 November 2026",
  });
}
