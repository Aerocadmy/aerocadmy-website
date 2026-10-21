import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = {
  title: "Terms & Conditions | Aerocadmy",
  description: "Terms governing use of the Aerocadmy website and learning services.",
};

export default function TermsAndConditionsPage() {
  return <LegalPage title="Terms & conditions" intro="These terms explain the rules for using the Aerocadmy website, learning content and services. By using the site, you agree to them.">
    <h2>Using our content</h2>
    <p>Aerocadmy grants you permission to view and use website materials for personal, non-commercial learning. You may not copy, modify, redistribute, commercially reuse, reverse engineer or remove ownership notices from our content without written permission.</p>
    <h2>Accuracy and availability</h2>
    <p>We work to keep our information useful and current, but course plans, imagery, schedules and technical information may change. The website and its materials are provided as available, without warranties beyond those required by applicable law.</p>
    <h2>External links</h2>
    <p>Links to third-party websites are provided for convenience. Aerocadmy does not control those sites and is not responsible for their content, availability or practices.</p>
    <h2>Changes and governing law</h2>
    <p>We may update these terms when our services change. These terms are governed by the laws of India, and disputes are subject to the jurisdiction of the applicable courts in India.</p>
    <h2>Contact</h2>
    <p>Questions about these terms can be sent to <a href="mailto:supportflight@aerocadmy.com">supportflight@aerocadmy.com</a>.</p>
  </LegalPage>;
}
