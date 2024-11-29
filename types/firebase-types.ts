export interface Week {
  id?: string;
  name: string;
  startDate: string;
}

export interface Day {
  id?: string;
  date: string;
  weekId: string;
}

export interface Activity {
  id?: string;
  // index: number;
  name: string;
  cost: string;
  highlightedText: string;
  department: string;
  headcount: number;
  // dayId: string;
  // weekId: string;
  secondaryHeadcountName: string;
  secondaryHeadcount: number;
  notes: string[];
}

export interface Occurrence {
  id?: string;
  activityId: string;
  period: number[];
  dayId: string;
  weekId: string;
}

export type EnhancedOccurrence = Occurrence & Activity;

export type EnumItem = {
  id?: string;
  name: string;
}

export interface Department extends EnumItem {}

export interface ActivitySet extends EnumItem {}

export type Activities = { [key: string]: Activity };

export type ActivitySets = { [key: string]: ActivitySet };

export type Departments = { [key: string]: Department };

export type Occurrences = { [key: string]: Occurrence };

export type EnhancedOccurrences = { [key: string]: EnhancedOccurrence };