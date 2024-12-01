import { Activities, Activity, EnhancedOccurrences, EnhancedOccurrence, Occurrence, Occurrences } from "@/types/firebase-types";

export const enhanceOccurrences = (occurrences: Occurrences, activities: Activities) => {
  const enhancedArray: EnhancedOccurrence[] = Object.values(occurrences).map(occurrence => {
    const activity = activities[occurrence.activityId];
    return {
      ...activity,
      ...occurrence,
    };
  });
  const enhancedObject: EnhancedOccurrences = {};
  enhancedArray.forEach(enhancedOccurrence => {
    enhancedObject[enhancedOccurrence.id || ""] = enhancedOccurrence;
  });
  return enhancedObject;
}

type ObjectWithId = {
  id?: string;
}
export const convertArrayToObject = <T extends ObjectWithId>(array: T[]) => {
  const object: { [key: string]: T } = {};
  array.forEach(item => {
    object[item["id"] || ""] = item;
  });
  return object;
}