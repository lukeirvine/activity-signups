export interface Week {
  id?: string;
  name: string;
  startDate: string;
  activitySetId: string;
  timeCreated: string;
  timeUpdated: string;
}

export interface Day {
  id?: string;
  date: string;
  weekId: string;
  timeCreated: string;
  timeUpdated: string;
}

export interface Activity {
  id?: string;
  // index: number;
  activitySetId: string;
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
  timeCreated: string;
  timeUpdated: string;
}

export interface Occurrence {
  id?: string;
  activityId: string;
  period: number[];
  dayId: string;
  weekId: string;
  timeCreated: string;
  timeUpdated: string;
}

export type EnhancedOccurrence = Occurrence & Activity;

export interface Department {
  id?: string;
  name: string;
  timeCreated: string;
  timeUpdated: string;
}

export interface ActivitySet {
  id?: string;
  name: string;
  timeCreated: string;
  timeUpdated: string;
}

export type Activities = { [key: string]: Activity };

export type ActivitySets = { [key: string]: ActivitySet };

export type Departments = { [key: string]: Department };

export type Occurrences = { [key: string]: Occurrence };

export type EnhancedOccurrences = { [key: string]: EnhancedOccurrence };
