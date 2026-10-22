export type DroneIndustry = {
  id: string;
  name: string;
  introduction: string;
  imageDescription: string;
  skills: string[];
  steps: { title: string; description: string; imageDescription: string }[];
};

export const droneIndustries: DroneIndustry[] = [
  {
    id: "agriculture", name: "Agriculture", introduction: "From flight to field insight.",
    imageDescription: "Aerial view of agricultural fields in soft morning light",
    skills: ["Mission planning", "Imaging", "Data analysis"],
    steps: [
      { title: "Flight operations", description: "Plan and carry out a mission.", imageDescription: "An operator using a drone controller beside a field" },
      { title: "Capture imagery", description: "Collect useful aerial images.", imageDescription: "An aerial crop image showing field boundaries" },
      { title: "Interpret data", description: "Turn observations into insight.", imageDescription: "A field map being reviewed on a laptop" },
    ],
  },
  {
    id: "construction", name: "Construction & Surveying", introduction: "See a site from a new perspective.",
    imageDescription: "A surveying engineer overlooking a construction site",
    skills: ["Survey planning", "Photogrammetry", "Site monitoring"],
    steps: [
      { title: "Plan the survey", description: "Define the area and flight route.", imageDescription: "A surveyor planning a drone survey on a tablet" },
      { title: "Map the site", description: "Capture overlapping site images.", imageDescription: "A straight-down aerial view of a construction site" },
      { title: "Read the model", description: "Explore terrain and site changes.", imageDescription: "An engineer reviewing a terrain model on a laptop" },
    ],
  },
  {
    id: "energy", name: "Energy & Infrastructure", introduction: "A closer look at essential systems.",
    imageDescription: "Electrical transmission infrastructure across an open landscape",
    skills: ["Inspection planning", "Flight operations", "Image analysis"],
    steps: [
      { title: "Plan an inspection", description: "Identify what needs a closer look.", imageDescription: "A drone operator inspecting power infrastructure from a distance" },
      { title: "Capture detail", description: "Observe components from the air.", imageDescription: "A photographic inspection view of powerline insulators" },
      { title: "Review findings", description: "Organise images for assessment.", imageDescription: "An engineer examining inspection photographs on a laptop" },
    ],
  },
  {
    id: "media", name: "Film & Media", introduction: "Turn a different viewpoint into a story.",
    imageDescription: "A drone cinematographer overlooking a coastal landscape",
    skills: ["Flight planning", "Aerial photography", "Video editing"],
    steps: [
      { title: "Plan the shot", description: "Choose a route and composition.", imageDescription: "An aerial filming route being planned on a tablet" },
      { title: "Create the image", description: "Explore movement and perspective.", imageDescription: "A cinematic aerial photograph of a coastline" },
      { title: "Shape the story", description: "Bring aerial footage into an edit.", imageDescription: "A video editor reviewing coastal drone footage" },
    ],
  },
  {
    id: "environment", name: "Environment & Public Safety", introduction: "Understand places. Support decisions.",
    imageDescription: "Aerial forest canopy and a winding river",
    skills: ["Mission operations", "Environmental monitoring", "Image interpretation"],
    steps: [
      { title: "Define the mission", description: "Decide what needs to be observed.", imageDescription: "An environmental monitoring survey being planned outdoors" },
      { title: "Observe the area", description: "Gather a wider view from above.", imageDescription: "Aerial monitoring imagery of a forest and river" },
      { title: "Make comparisons", description: "Look for patterns and changes.", imageDescription: "A researcher comparing forest imagery on a laptop" },
    ],
  },
  {
    id: "engineering", name: "Drone Engineering", introduction: "Build, program, and improve the system.",
    imageDescription: "Hands working on a quadcopter at an electronics workbench",
    skills: ["Electronics", "Embedded programming", "Testing & repair"],
    steps: [
      { title: "Connect the hardware", description: "Understand circuits and components.", imageDescription: "Drone electronics being checked with a multimeter" },
      { title: "Write the logic", description: "Connect code with physical systems.", imageDescription: "A developer modifying embedded code beside a drone" },
      { title: "Test and refine", description: "Find faults and improve the build.", imageDescription: "A technician testing a quadcopter on a workbench" },
    ],
  },
];
