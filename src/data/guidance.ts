export const professions = ["School student", "College student", "Working professional", "Self-employed / business owner", "Educator / researcher", "Between roles / exploring", "Other"] as const;
export const droneExperience = ["No experience yet", "Explored through reading or videos", "Flown a drone", "Built or repaired a drone", "Programmed drone or embedded systems"] as const;
export const learningInterests = ["Getting started with drone technology", "Building, electronics & repair", "Programming & flight control", "Mapping, imagery & data", "Photography & video", "Not sure yet"] as const;
export const learningGoals = ["Explore a technical career", "Build a personal project", "Develop skills for my current work", "Support studies or research", "Learn out of curiosity", "Help me figure this out"] as const;
export const learningFormats = ["Recorded courses at my own pace", "Live online learning", "Open to either / need guidance"] as const;
export const callbackWindows = ["No preference", "Morning", "Afternoon", "Evening"] as const;

export type CounsellingInput = {
  profession: string; fieldOfWork: string; experience: string; interest: string;
  goal: string; format: string; name: string; phone: string; email: string;
  callbackWindow: string; questions: string;
};
