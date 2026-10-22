import { DroneComponent, LearningLesson, ProgramTrack } from "@/types";
import { ASSETS } from './assets';

export const LESSONS: LearningLesson[] = [
  {
    id: 0,
    title: "Start with curiosity.",
    description: "Explore what makes a drone fly and understand how its components work together. Every build begins with a question.",
    label: "Discover",
    milestone: 0,
    milestoneName: "Understand",
    focusComponent: "All Components",
  },
  {
    id: 1,
    title: "Build it with your own hands.",
    description: "Move from diagrams to a physical build. Explore structure, mounting, and how individual parts become a working frame.",
    label: "Build the foundation",
    milestone: 1,
    milestoneName: "Build",
    focusComponent: "Frame & Motors",
  },
  {
    id: 2,
    title: "Power your ideas.",
    description: "Understand batteries, power requirements, and the connections that bring a build to life.",
    label: "Connect the power",
    milestone: 1,
    milestoneName: "Build",
    focusComponent: "LiPo Battery & PDB",
  },
  {
    id: 3,
    title: "Give your build a brain.",
    description: "Connect electronics with programming. Discover how instructions become movement through the flight controller.",
    label: "Bring hardware and code together",
    milestone: 2,
    milestoneName: "Program",
    focusComponent: "Flight Controller MCU",
  },
  {
    id: 4,
    title: "Teach it to understand the world.",
    description: "Explore sensing and feedback. Learn how a drone measures its surroundings and responds to change.",
    label: "Explore sensing",
    milestone: 2,
    milestoneName: "Program",
    focusComponent: "IMU & Barometer Sensor",
  },
  {
    id: 5,
    title: "Build with a purpose.",
    description: "Bring the systems together and explore how a camera turns a technical build into a tool for real-world applications.",
    label: "Bring it all together",
    milestone: 2,
    milestoneName: "Program",
    focusComponent: "FPV Camera & Payload",
  },
  {
    id: 6,
    title: "Take your learning further.",
    description: "A complete build opens up new possibilities. Test, refine, and turn what you have learned into projects of your own.",
    label: "Ready for your next step",
    milestone: 3,
    milestoneName: "Fly",
    focusComponent: "Autonomous Flight System",
  },
];

export const DRONE_COMPONENTS: DroneComponent[] = [
  {
    id: "motors",
    name: "Brushless DC Motors",
    subtitle: "High-Torque Propulsion",
    category: "propulsion",
    image: ASSETS.motor,
    role: "Generate thrust",
    description:
      "Precision-wound 2205 brushless motors equipped with N52SH neodymium curved magnets and stainless steel Japanese bearings, converting electrical pulses into rapid angular velocity.",
    specs: [
      { label: "Stator Size", value: "2205" },
      { label: "KV Rating", value: "2300 KV" },
      { label: "Max Thrust", value: "850g / axis" },
      { label: "Working Voltage", value: "3S - 4S LiPo" },
      { label: "Shaft Diameter", value: "M5 Titanium" },
      { label: "Weight", value: "28.5g" },
    ],
    engineeringHighlights: [
      "Dynamic precision balancing down to 0.005g for vibration-free gyro signals",
      "0.15mm silicon steel laminations for superior magnetic permeability",
      "High temperature oxygen-free copper windings tested up to 220°C",
    ],
  },
  {
    id: "propellers",
    name: "Aerodynamic Propellers",
    subtitle: "Airfoil Lift Generation",
    category: "propulsion",
    image: ASSETS.propeller,
    role: "Create lift",
    description:
      "Glass-fiber reinforced tri-blade propellers optimized for high chord laminar airflow, reducing acoustic drag while producing instantaneous rotational response.",
    specs: [
      { label: "Diameter & Pitch", value: "5.0 x 4.5 Tri-blade" },
      { label: "Material", value: "Bayer Polycarbonate" },
      { label: "Blade Configuration", value: "CW & CCW Pair" },
      { label: "Efficiency Ratio", value: "4.2 g/W" },
      { label: "Max RPM", value: "32,000 RPM" },
    ],
    engineeringHighlights: [
      "Optimized tip vortex winglets for minimal blade-wake aerodynamic turbulence",
      "High impact resistance against blade strike with ductile deformation memory",
      "Precision hub molding matching M5 knurled lock nuts",
    ],
  },
  {
    id: "flight-controller",
    name: "Flight Controller (FC)",
    subtitle: "32-Bit Microcontroller Brain",
    category: "avionics",
    image: ASSETS.controller,
    role: "The brain",
    description:
      "The central nervous system of the drone. Powered by a high-frequency STM32 MCU running real-time RTOS firmware to execute PID stabilization loops at 8kHz.",
    specs: [
      { label: "MCU", value: "STM32F405 @ 168MHz" },
      { label: "Gyro/Accel", value: "ICM-42688-P 6-Axis" },
      { label: "OSD Support", value: "AT7456E Chip" },
      { label: "Blackbox Memory", value: "16MB Flash" },
      { label: "BEC Output", value: "5V@2.5A & 9V@2A" },
      { label: "Input Voltage", value: "2S - 6S (7V - 26V)" },
    ],
    engineeringHighlights: [
      "Integrated hardware low-pass filtering on analog power rails",
      "Direct telemetry passthrough for telemetry RSSI, battery voltage & current sensing",
      "Multi-UART interfaces for GPS, receiver, optical flow & companion AI computers",
    ],
  },
  {
    id: "battery",
    name: "Lithium Polymer Battery",
    subtitle: "High-Discharge Power System",
    category: "power",
    image: ASSETS.battery,
    role: "Powers your ideas",
    description:
      "High-energy density graphene LiPo cells delivering continuous current for explosive throttle punches with minimal voltage sag.",
    specs: [
      { label: "Chemistry", value: "Lithium Polymer Graphene" },
      { label: "Capacity", value: "1500 mAh" },
      { label: "Cell Configuration", value: "4S1P (14.8V Nominal)" },
      { label: "Discharge Rate", value: "100C Continuous / 150C Burst" },
      { label: "Connector", value: "Amass XT60 Gold-Plated" },
      { label: "Weight", value: "178g" },
    ],
    engineeringHighlights: [
      "Nano-graphene conductive matrix for reduced internal impedance (<1.8mΩ/cell)",
      "Reinforced aluminum side protection plates preventing puncture damage",
      "High silicon content balance leads for accurate cell-level voltage monitoring",
    ],
  },
  {
    id: "camera",
    name: "HD FPV Optical Camera",
    subtitle: "Real-Time Visual Feedback",
    category: "optics",
    image: ASSETS.camera,
    role: "Capture the world",
    description:
      "Ultra-low latency wide dynamic range (WDR) optical sensor providing pilots and autonomous systems with continuous visual spatial awareness.",
    specs: [
      { label: "Sensor Type", value: '1/3" Sony STARVIS CMOS' },
      { label: "Resolution", value: "1200 TVL HD" },
      { label: "Field of View", value: "165° Diagonal FOV" },
      { label: "Latency", value: "< 4.5ms Global Shutter" },
      { label: "Min Illumination", value: "0.0001 Lux Starlight" },
      { label: "Input Voltage", value: "DC 5V - 36V" },
    ],
    engineeringHighlights: [
      "Dynamic WDR algorithms balancing bright skies against dark terrain in microseconds",
      "All-weather sealed magnesium alloy casing for shock resistance",
      "Compatible with CV vision streams for object tracking & optical flow odometry",
    ],
  },
  {
    id: "frame-arms",
    name: "Carbon Fiber Structural Arms",
    subtitle: "True-X Rigid Airframe",
    category: "structure",
    image: ASSETS.arm,
    role: "Structural support",
    description:
      "CNC milled 3K quasi-isotropic twill carbon fiber weave engineered for torsional stiffness and extreme high-G maneuver resistance.",
    specs: [
      { label: "Wheelbase", value: "220mm (True-X)" },
      { label: "Arm Thickness", value: "4.0mm Chamfered" },
      { label: "Material", value: "Toray T700 3K Carbon" },
      { label: "Plate Thickness", value: "2.0mm Top & Base" },
      { label: "Hardware", value: "12.9 Grade High-Tensile Steel" },
    ],
    engineeringHighlights: [
      "Chamfered edge treatment preventing delamination during ground impacts",
      "Natural resonance tuned away from 200Hz - 400Hz motor harmonics",
      "Modular single-bolt arm replacement architecture for rapid field repairs",
    ],
  },
  {
    id: "sensors",
    name: "Sensors & Telemetry Array",
    subtitle: "Spatial Awareness Suite",
    category: "avionics",
    image: ASSETS.sensor,
    role: "See and stabilize",
    description:
      "Multi-sensor telemetry module encompassing digital barometers, magnetometers, and inertial measurement units communicating via I2C and SPI buses.",
    specs: [
      { label: "IMU", value: "6-DOF BMI270 High-BW" },
      { label: "Barometer", value: "DPS310 (10cm Altitude Delta)" },
      { label: "Compass", value: "QMC5883L 3-Axis Mag" },
      { label: "Interface", value: "Dual I2C + High-Speed SPI" },
      { label: "Operating Temp", value: "-40°C to +85°C" },
    ],
    engineeringHighlights: [
      "Real-time sensor fusion with extended Kalman filter (EKF2) algorithms",
      "Onboard silicon gel dampeners isolating acoustic motor vibrations",
      "Thermal drift self-calibration for consistent altitude holding",
    ],
  },
];

export const PROGRAMS: ProgramTrack[] = [
  {
    id: "understand",
    title: "Drone Fundamentals & Aero-Physics",
    tagline: "Explore the foundations",
    level: "Beginner",
    duration: "4 Weeks · 16 Hours",
    description:
      "Demystify flight physics, brushless motor electromagnetics, aerodynamic lift equations, and drone circuit layouts through intuitive interactive visual models.",
    badge: "01 / UNDERSTAND",
    curriculum: [
      "Aerodynamics of multirotor quadcopters & Bernoulli principle",
      "Brushless motor physics, KV ratings & ESC commutations",
      "Lithium chemistry, safety, C-ratings & power budgeting",
      "Schematic reading, wire gauges & solderless vs soldered joints",
    ],
    projects: [
      "Interactive thrust-to-weight calculation simulator",
      "Power consumption budget model for endurance optimization",
      "Propeller efficiency bench-test analysis",
    ],
    iconName: "Compass",
  },
  {
    id: "build-program",
    title: "Avionics, Assembly & Embedded Control",
    tagline: "Connect your ideas",
    level: "Intermediate",
    duration: "6 Weeks · 24 Hours",
    description:
      "Assemble physical hardware from the ground up, flash flight controller firmware, configure PID feedback loops, and write Python scripts to read sensor telemetry.",
    badge: "02 / BUILD & PROGRAM",
    curriculum: [
      "Airframe mechanical assembly, fastener torques & threadlocker",
      "Flight controller wiring: UARTs, SPI sensors & power distribution",
      "Firmware flashing (Betaflight / PX4) & OSD telemetry setup",
      "PID loop tuning: Proportional, Integral & Derivative damping",
      "Python serial interface for reading real-time gyro and attitude data",
    ],
    projects: [
      "Complete physical 5-inch quadcopter build & benchmark",
      "Custom PID tuning profile for wind gust stability",
      "Telemetry dashboard in Python reading live sensor telemetry",
    ],
    iconName: "Cpu",
  },
  {
    id: "apply",
    title: "Autonomous Flight, AI & Real-World Tech",
    tagline: "Make it your own",
    level: "Advanced",
    duration: "8 Weeks · 32 Hours",
    description:
      "Bridge drone engineering into real-world autonomous missions, GPS waypoint navigation, companion computer vision with OpenCV, and automated survey mapping.",
    badge: "03 / APPLY",
    curriculum: [
      "MAVLink protocol & ROS 2 (Robot Operating System) fundamentals",
      "GPS waypoint navigation, geofencing & fail-safe protocols",
      "OpenCV on companion SBC (Raspberry Pi / Jetson) for visual tracking",
      "Aerial photogrammetry, orthomosaic creation & 3D mesh reconstruction",
      "Aviation safety regulations, DGCA / FAA Part 107 compliance",
    ],
    projects: [
      "Autonomous search-and-rescue waypoint mission with geofencing",
      "Target-following computer vision payload tracking demo",
      "High-precision 3D aerial digital elevation model (DEM) generation",
    ],
    iconName: "Rocket",
  },
];

export const STATS = [
  { label: "Engineers & Students Trained", value: "2,400+" },
  { label: "Hands-on Build Completion Rate", value: "99.2%" },
  { label: "STEM Academies & Universities", value: "50+" },
  { label: "Commercial Flight Certifications", value: "100%" },
];

export const FAQS = [
  {
    question: "Do I need prior electronics or coding experience to start?",
    answer:
      "Not at all. Track 01 (Understand) starts from core foundational physics and intuitive visual analogies. We guide you step-by-step from beginner tools and circuit basics to advanced embedded C and Python telemetry.",
  },
  {
    question: "Is physical hardware included with the programs?",
    answer:
      "Yes! When you enroll in Track 02 or Track 03, you receive the full Aerocadmy Hardware Kit containing the carbon fiber True-X frame, brushless motors, flight controller, sensors, LiPo battery, telemetry tools, and safety gear delivered to your door.",
  },
  {
    question: "What software and programming languages are taught?",
    answer:
      "You will work with industry-standard tools including Betaflight Configurator, QGroundControl, PX4 Autopilot, Embedded C/C++ on STM32 microcontrollers, and Python with OpenCV and MAVLink for autonomous missions.",
  },
  {
    question: "Are the certifications recognized by industry bodies?",
    answer:
      "Yes, Aerocadmy certificates are aligned with standard aerospace engineering competency frameworks and provide direct credits toward professional drone pilot and technician accreditations.",
  },
];

