import { ImageResponse } from "next/og";

export const alt = "Aerocadmy — Engineered to Inspire";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(125deg, #f7fcfa 0%, #e4f5ef 56%, #c8eee2 100%)",
          color: "#081c2b",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ position: "absolute", right: -95, top: -180, width: 660, height: 660, borderRadius: 999, background: "rgba(24,203,150,.12)", display: "flex" }} />
        <div style={{ position: "absolute", right: 62, top: 54, width: 475, height: 475, borderRadius: 999, border: "1px solid rgba(8,121,87,.16)", display: "flex" }} />
        <div style={{ position: "absolute", right: 0, bottom: -70, width: 440, height: 240, background: "rgba(255,255,255,.28)", transform: "rotate(-16deg)", display: "flex" }} />
        <div style={{ position: "relative", zIndex: 2, width: 650, padding: "70px 0 66px 76px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 25, fontWeight: 800, letterSpacing: "-1px" }}>
            <div style={{ width: 14, height: 14, borderRadius: 99, background: "#087957", display: "flex" }} />
            AEROCADMY
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: "#087957", fontSize: 18, fontWeight: 700, letterSpacing: "4px", textTransform: "uppercase", marginBottom: 22 }}>Drone technology academy</div>
            <div style={{ fontSize: 68, lineHeight: 1.04, fontWeight: 800, letterSpacing: "-3px", maxWidth: 580 }}>Engineered to inspire.</div>
            <div style={{ marginTop: 24, color: "#45636a", fontSize: 24, lineHeight: 1.45, maxWidth: 480 }}>Learn by building, understanding and flying.</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#087957", fontSize: 18, fontWeight: 700 }}>
            <div style={{ width: 34, height: 2, background: "#18cb96", display: "flex" }} />
            AEROCADMY.COM
          </div>
        </div>
        <div style={{ position: "absolute", right: 26, top: 130, width: 540, height: 370, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src="https://aerocadmy.com/component%20images/final-drone.webp" width="540" height="370" style={{ objectFit: "contain", filter: "drop-shadow(0 28px 28px rgba(8,28,43,.17))" }} />
        </div>
        <div style={{ position: "absolute", right: 96, bottom: 42, padding: "12px 18px", borderRadius: 999, background: "rgba(255,255,255,.78)", color: "#087957", fontSize: 15, fontWeight: 700, letterSpacing: "1px", display: "flex" }}>BUILD · CODE · FLY</div>
      </div>
    ),
    { ...size },
  );
}
