export const participantReviews = [
  {
    name: "Priya Verma", role: "Mechanical Engineering", college: "BITS Pilani", rating: 5,
    avatar: "/images/reviews/priya-verma.jpg",
    quote: "The aerodynamics sessions made the numbers practical. I can now work through thrust-to-weight, motor and propeller selection, and frame balance instead of guessing when designing a drone.",
  },
  {
    name: "Arjun Desai", role: "Computer Science", college: "IIT Bombay", rating: 5,
    avatar: "/images/reviews/arjun-desai.jpg",
    quote: "I went from writing code on a screen to understanding how it affects a real flight controller. Programming the ESP32 through Arduino IDE and testing sensor behaviour made the hardware-software connection click.",
  },
  {
    name: "Ishi Gupta", role: "ECE", college: "Christ University", rating: 5,
    avatar: "/images/reviews/ishi-gupta.jpeg",
    quote: "The live guidance made the electronics approachable. Building the circuit, checking the power distribution, and learning wiring safety gave me the confidence to work with drone hardware hands-on.",
  },
  {
    name: "Vikram Singh", role: "B.Sc. Agriculture", college: "Vellore Institute", rating: 5,
    avatar: "/images/reviews/vikram-singh.jpg",
    quote: "Mission planning, waypoints, and the virtual flight experiments helped me see how drones can solve real field problems. The final project also gave me something concrete to explain and present.",
  },
  {
    name: "Simran Sharma", role: "Electronics & Communication", college: "BITS Hyderabad", rating: 4,
    avatar: "/images/reviews/simran-sharma.jpeg",
    quote: "Assembling the ESP32 kit, calibrating the sensors, and completing the first hover made the theory memorable. The simulator practice with PID tuning helped me understand how to improve flight performance.",
  },
  {
    name: "Aditya Kumar", role: "Mechanical Engineering", college: "NIT Rourkee", rating: 4,
    avatar: "/images/reviews/aditya-kumar.jpg",
    quote: "The six-week structure takes you from drone fundamentals to a working build and flight demonstration. Keeping the kit and receiving mentor feedback on the final project made the learning feel genuinely useful.",
  },
];

export const reviewAverage = participantReviews.reduce((total, review) => total + review.rating, 0) / participantReviews.length;
