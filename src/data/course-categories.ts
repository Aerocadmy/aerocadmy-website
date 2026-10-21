import { courseGroups, recordedCourses } from "./courses";

export const courseCategories = courseGroups;
export const courseCategoryTopics = recordedCourses.map(course => course.title);
