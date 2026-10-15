export interface DroneComponent {
  id: string;
  name: string;
  subtitle: string;
  category: 'propulsion' | 'avionics' | 'power' | 'structure' | 'optics' | 'telemetry';
  image: string;
  description: string;
  specs: { label: string; value: string }[];
  engineeringHighlights: string[];
  role: string;
}

export interface LearningLesson {
  id: number;
  title: string;
  description: string;
  label: string;
  milestone: number;
  milestoneName: 'Understand' | 'Build' | 'Program' | 'Fly';
  focusComponent: string;
}

export interface ProgramTrack {
  id: string;
  title: string;
  tagline: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  curriculum: string[];
  description: string;
  badge: string;
  projects: string[];
  iconName: string;
}

