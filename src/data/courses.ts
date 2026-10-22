export const courseGroups = ["Engineering Foundations", "Industry Applications"] as const;
export type CourseGroup = typeof courseGroups[number];
export type CourseVisual = { src: string; quadrant: number; alt: string };
export type RecordedCourse = {
  slug: string; title: string; group: CourseGroup; summary: string; audience: string;
  prerequisites: string; modules: string[]; curriculumNotes: string[]; outcome: string; project: string;
  resources: string[]; note?: string; visual: CourseVisual;
};
const foundationPhoto = (quadrant: number, alt: string): CourseVisual => ({ src: "/images/courses/foundations.png", quadrant, alt });
const industryPhoto = (industry: string, quadrant: number, alt: string): CourseVisual => ({ src: `/images/industries/${industry}.png`, quadrant, alt });

export const recordedCourses: RecordedCourse[] = [
  {
    slug: "drone-technology-fundamentals", title: "Drone Technology Fundamentals", group: "Engineering Foundations",
    summary: "Get to know the components, principles, and connected systems behind a drone.",
    audience: "Beginners, students, and professionals exploring drone technology.", prerequisites: "None. Start here if you are new to drone technology.",
    modules: ["Drone types and applications", "Flight principles", "Components and their roles", "How hardware, software, and control work together"],
    curriculumNotes: ["Compare drone types and connect their design to the work they are used for.", "Explore lift, thrust, movement, and the principles that make controlled flight possible.", "Identify the frame, propulsion, power, sensors, and controller, and explain what each contributes.", "Trace the connections between physical components, program instructions, and control decisions as one working system."],
    outcome: "Explain how a drone works and recognise the relationships between its major systems.",
    project: "Create an annotated drone system diagram and justify component choices for a simple use case.",
    resources: ["A computer with internet access", "Proposed activities use component references and diagrams; drone ownership is not required"],
    visual: foundationPhoto(0, "A flat-lay of motors, propellers, electronics, and a drone battery"),
  },
  {
    slug: "drone-electronics-assembly-troubleshooting", title: "Drone Electronics, Assembly & Troubleshooting", group: "Engineering Foundations",
    summary: "Understand connections, investigate faults, and develop a methodical approach to drone hardware.",
    audience: "Learners interested in hardware, maintenance, and repair.", prerequisites: "Drone Technology Fundamentals or equivalent knowledge.",
    modules: ["Power and electrical basics", "Motors, controllers, and sensors", "Wiring and assembly principles", "Systematic fault diagnosis"],
    curriculumNotes: ["Explore electrical quantities and follow how power reaches the components of a drone.", "Understand the roles of motors, controllers, and sensors and the connections between them.", "Read basic wiring diagrams and follow assembly demonstrations to understand how components fit together.", "Use supplied schematics, measurements, and inspection evidence to investigate a documented fault and explain your diagnosis."],
    outcome: "Read a basic wiring diagram, explain component connections, and approach faults methodically.",
    project: "Diagnose a documented drone fault using schematics, measurements, and inspection evidence; produce a troubleshooting report.",
    resources: ["A computer with internet access", "The planned project uses supplied schematics, measurements, and inspection evidence"],
    note: "Physical assembly demonstrations are planned for the lessons. A purchased kit is not required for the recorded-course project. Any optional hardware exercises will have separate equipment requirements.",
    visual: industryPhoto("engineering", 0, "Hands inspecting a quadcopter on an electronics workbench"),
  },
  {
    slug: "esp32-programming-drone-systems", title: "ESP32 Programming for Drone Systems", group: "Engineering Foundations",
    summary: "Connect programming foundations with sensors, electronics, and controlled outputs.",
    audience: "Beginners who want to connect programming with electronics.", prerequisites: "Drone Technology Fundamentals. Basic electronics knowledge is helpful.",
    modules: ["Programming foundations", "Reading sensor inputs", "Communication between components", "Turning readings into control instructions"],
    curriculumNotes: ["Build up programming concepts progressively through small embedded-system examples.", "Read sensor values and make those readings understandable through a status display or log.", "Explore how an embedded program exchanges information with connected components.", "Use input readings to produce a controlled output in a simulated sensor-to-output project."],
    outcome: "Write and explain a small program that reads an input and produces a controlled output.",
    project: "Build a simulated sensor-to-output system with a simple status display or log.",
    resources: ["A computer with internet access", "The planned project uses simulation; a physical ESP32 board or drone is not required"],
    note: "The proposed course introduces embedded programming progressively. It does not promise complete flight-firmware development.",
    visual: foundationPhoto(1, "A laptop and ESP32 sensor project on a programming desk"),
  },
  {
    slug: "flight-control-simulation", title: "Flight Control & Simulation", group: "Engineering Foundations",
    summary: "Explore feedback, stability, and the adjustments that help a drone respond.",
    audience: "Learners curious about how drones balance and respond.", prerequisites: "Drone Technology Fundamentals, basic programming, and introductory maths.",
    modules: ["Orientation and movement", "Sensor feedback", "Control loops and introductory PID", "Testing and comparing simulated responses"],
    curriculumNotes: ["Describe drone orientation and movement as the starting point for understanding stabilisation.", "Explore how sensor readings describe the state of a drone and provide feedback to a controller.", "Follow a feedback loop and investigate how introductory PID parameters affect its behaviour.", "Tune a simulated stabilisation system and use before-and-after response plots to explain the changes."],
    outcome: "Explain feedback control and investigate how parameter changes affect stability.",
    project: "Tune a simulated stabilisation system and present before-and-after response plots.",
    resources: ["A computer with internet access", "The planned activities use simulation and response plots; a drone is not required"],
    visual: foundationPhoto(2, "A control response plot on a laptop beside a small quadcopter"),
  },
  {
    slug: "drone-mapping-photogrammetry", title: "Drone Mapping & Photogrammetry", group: "Industry Applications",
    summary: "Follow the journey from overlapping aerial imagery to maps and models.",
    audience: "Learners exploring surveying, construction, and mapping workflows.", prerequisites: "Drone Technology Fundamentals and basic computer skills.",
    modules: ["Mapping objectives and capture planning", "Image overlap and quality", "Processing imagery into maps or models", "Interpreting and presenting results"],
    curriculumNotes: ["Define a mapping objective and connect it to a plan for collecting useful aerial imagery.", "Examine image overlap and quality and explain their effect on the mapping workflow.", "Follow the processing workflow using supplied practice imagery to create a basic map or model.", "Present the output with a clear explanation of what it shows and the limitations of the dataset and process."],
    outcome: "Explain the mapping workflow and produce a basic output from supplied imagery.",
    project: "Process a practice dataset into a map or model and document its limitations.",
    resources: ["A computer with internet access", "Practice imagery is planned for the course; drone ownership is not required", "Software and computer requirements will be confirmed before enrolment opens"],
    visual: industryPhoto("construction", 3, "A terrain model being reviewed on a laptop"),
  },
  {
    slug: "drone-imagery-data-analysis", title: "Drone Imagery & Data Analysis", group: "Industry Applications",
    summary: "Read aerial images, compare observations, and communicate what the evidence shows.",
    audience: "Learners interested in agriculture, environmental monitoring, and interpreting aerial information.", prerequisites: "Drone Technology Fundamentals. Mapping knowledge is helpful.",
    modules: ["Understanding aerial datasets", "Organising and checking imagery", "Identifying patterns and comparing observations", "Communicating findings and uncertainty"],
    curriculumNotes: ["Explore the context of aerial datasets and the questions they can help investigate.", "Organise supplied imagery and check its quality before beginning an interpretation.", "Identify visible patterns and compare observations in a field or environmental dataset.", "Create an illustrated observation report that separates evidence, interpretation, and uncertainty."],
    outcome: "Move from aerial images to a structured, evidence-based interpretation.",
    project: "Use a supplied field or environmental dataset to produce an illustrated observation report.",
    resources: ["A computer with internet access", "The planned project uses supplied field or environmental imagery; a drone is not required"],
    note: "The initial course focuses on imagery interpretation. Specialist sensor analysis is outside this proposed outline.",
    visual: industryPhoto("agriculture", 3, "A learner examining an agricultural imagery map on a laptop"),
  },
  {
    slug: "drone-inspection-workflows", title: "Drone Inspection Workflows", group: "Industry Applications",
    summary: "Organise inspection imagery into a clear, traceable record of observations.",
    audience: "Learners exploring infrastructure inspection and technical reporting.", prerequisites: "Drone Technology Fundamentals and basic image interpretation.",
    modules: ["Defining inspection objectives", "Planning image coverage", "Organising and reviewing inspection evidence", "Reporting observations and limitations"],
    curriculumNotes: ["Define what an inspection is intended to observe and what evidence is needed.", "Plan image coverage so that inspection photographs can support a structured review.", "Organise supplied photographs into a traceable record and annotate observations.", "Assemble an inspection report with clear limitations and items that require further assessment."],
    outcome: "Understand the inspection workflow and assemble a clear evidence record.",
    project: "Create an inspection report from supplied photographs, with annotated observations and items requiring further assessment.",
    resources: ["A computer with internet access", "The planned project uses supplied inspection photographs; site access and drone ownership are not required"],
    visual: industryPhoto("energy", 2, "An inspection photograph of power infrastructure components"),
  },
  {
    slug: "aerial-photography-cinematography", title: "Aerial Photography & Cinematography", group: "Industry Applications",
    summary: "Explore composition, camera movement, and storytelling through aerial footage.",
    audience: "Learners interested in visual storytelling with drones.", prerequisites: "Drone Technology Fundamentals and basic computer skills.",
    modules: ["Composition and perspective", "Planning shots and camera movement", "Selecting and organising footage", "Editing an aerial sequence"],
    curriculumNotes: ["Explore how aerial perspective and composition influence visual storytelling.", "Build a shot plan and connect camera movement to the story you want to tell.", "Review supplied footage and organise useful shots into a coherent selection.", "Edit a short aerial sequence and explain the creative decisions behind the finished work."],
    outcome: "Plan an aerial shoot and explain the creative decisions behind a finished sequence.",
    project: "Produce a short edited sequence from supplied footage, accompanied by a shot plan.",
    resources: ["A computer with internet access", "Practice footage is planned for the course; drone ownership is not required", "Editing software and computer requirements will be confirmed before enrolment opens"],
    visual: industryPhoto("media", 2, "A cinematic aerial photograph of a coastline"),
  },
];

export function findRecordedCourse(slug: string) { return recordedCourses.find(course => course.slug === slug); }
