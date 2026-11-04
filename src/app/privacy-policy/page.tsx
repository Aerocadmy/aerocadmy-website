import { LegalPage } from "@/components/legal/LegalPage";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata({ title: "Privacy Policy | Aerocadmy", description: "How Aerocadmy collects and uses information.", path: "/privacy-policy" });

export default function PrivacyPolicyPage() {
  return <LegalPage title="Privacy policy" intro="Aerocadmy Education respects your privacy. This policy explains what we collect, why we use it and the choices available to you.">
    <h2>Information we collect</h2>
    <p>Depending on how you use the site, we may collect your name, email address, phone number, learning preferences, counselling answers and payment references. We may also receive basic device, browser and usage information needed to operate and improve the site.</p>
    <h2>How we use information</h2>
    <p>We use information to respond to questions, provide counselling, manage course waitlists and enrolments, process payments, provide support, improve our services and send updates where you have asked to receive them.</p>
    <h2>Security and sharing</h2>
    <p>We use reasonable technical and organisational safeguards. Information is shared only with service providers needed to operate the service, such as our database and payment providers, or where required by law. We do not provide public access to counselling, waitlist or payment records.</p>
    <h2>Cookies, analytics and advertising</h2>
    <p>Essential cookies keep the site working. With your permission, we also use: (1) analytics (PostHog and Google Analytics) to understand how the site is used, record anonymised sessions and test improvements; and (2) advertising (the Meta Pixel) to measure our Facebook and Instagram ads and show our programs to relevant people. If you choose “Essential only”, we do not set analytics or advertising cookies, and we do not load Google Analytics or the Meta Pixel. We still count page views and button clicks in an anonymous form that does not use cookies and does not store your IP address. Our analytics and advertising providers may process data on servers outside India.</p>
    <p>You can change or withdraw your choice at any time using “Cookie settings” in the footer. We record your choice and when you made it in your browser. Advertising features are intended for people aged 18 or older. Aerocadmy does not knowingly track or target advertising at children; if you are under 18, please choose “Essential only” or ask a parent or guardian to decide for you.</p>
    <h2>Your choices</h2>
    <p>You may ask us to access, correct or delete your personal information, or opt out of promotional communication. Email <a href="mailto:contact@aerocadmy.com">contact@aerocadmy.com</a> with your request.</p>
    <h2>Contact</h2>
    <p>For privacy questions, contact us at <a href="mailto:contact@aerocadmy.com">contact@aerocadmy.com</a>.</p>
  </LegalPage>;
}
