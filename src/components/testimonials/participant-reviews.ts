// Supplied by the site owner from D:/aerocadmy-website/src/components/Testimonials.tsx.
// Feedback concerns earlier drone career webinars, not these course offerings.
export const participantReviews = [
  {
    name: "Priya Verma", role: "Mechanical Engineering", college: "BITS Pilani", rating: 5,
    avatar: "/images/reviews/priya-verma.jpg",
    quote: "I always thought my Mech background didn't fit into the drone space. Learning about payload design, structures, and materials engineering made me realize I'm actually in high demand. Best ₹49 I spent.",
  },
  {
    name: "Arjun Desai", role: "Computer Science", college: "IIT Bombay", rating: 5,
    avatar: "/images/reviews/arjun-desai.jpg",
    quote: "As a CS student, I didn't know where I fit. Now I see autonomy, computer vision, and AI are the future. The webinar showed me the exact skills I need to build flying robots.",
  },
  {
    name: "Ishi Gupta", role: "ECE", college: "Christ University", rating: 5,
    avatar: "/images/reviews/ishi-gupta.jpeg",
    quote: "I came in thinking drones were only for engineers. The session broke down operations, vendor management, and growth roles so clearly that I could finally see where a business student like me fits.",
  },
  {
    name: "Vikram Singh", role: "B.Sc. Agriculture", college: "Vellore Institute", rating: 5,
    avatar: "/images/reviews/vikram-singh.jpg",
    quote: "I was only looking at drones from an agriculture use-case angle. This session showed me how mapping, spraying, and field analytics create real opportunities even if your background is not traditional engineering.",
  },
  {
    name: "Simran Sharma", role: "Electronics & Communication", college: "BITS Hyderabad", rating: 4,
    avatar: "/images/reviews/simran-sharma.jpeg",
    quote: "I thought I had to choose between hardware or software. Learned every component is a career by itself. Now planning to specialize in flight controller design, which opens ₹8-15L+ opportunities.",
  },
  {
    name: "Aditya Kumar", role: "Mechanical Engineering", college: "NIT Rourkee", rating: 4,
    avatar: "/images/reviews/aditya-kumar.jpg",
    quote: "The industry reality session was eye-opening. Agriculture, logistics, defence, infrastructure — drones are everywhere. I now have a clear roadmap on which sector to enter based on my interests.",
  },
];

export const reviewAverage = participantReviews.reduce((total, review) => total + review.rating, 0) / participantReviews.length;
