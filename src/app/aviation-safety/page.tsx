import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = {
  title: "Aviation Safety | Aerocadmy",
  description: "Safety guidance for learning and working with drone systems.",
};

export default function AviationSafetyPage() {
  return <LegalPage title="Aviation safety" intro="Drone technology is practical engineering, but it must always be used responsibly. This guidance is educational and does not replace current aviation rules or qualified supervision.">
    <h2>Before every flight</h2>
    <ul><li>Inspect the frame, propellers, motors, wiring and battery for damage.</li><li>Secure the flight area and keep people, animals and property clear.</li><li>Check weather, visibility, battery condition and failsafe settings.</li><li>Confirm that your aircraft, location and purpose comply with local aviation requirements.</li></ul>
    <h2>Learn within the rules</h2>
    <p>Regulations vary by country and can change. In India, consult the current Directorate General of Civil Aviation requirements and the Digital Sky platform before operating a drone. Do not rely on an old course, article or social post as legal advice.</p>
    <h2>Battery and workshop safety</h2>
    <p>Use the charger, storage method and protective equipment specified for your battery. Never use a swollen or damaged LiPo battery, leave charging unattended, or test spinning propellers near people. Disconnect power before changing wiring or working on a frame.</p>
    <h2>Responsible learning</h2>
    <p>Aerocadmy learning materials are for education. You are responsible for your equipment, flight decisions, permissions and compliance with the laws that apply where you operate.</p>
    <h2>Questions</h2>
    <p>For course or workshop safety questions, contact <a href="mailto:supportflight@aerocadmy.com">supportflight@aerocadmy.com</a>.</p>
  </LegalPage>;
}
