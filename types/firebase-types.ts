export interface Week {
  id?: string;
  name: string;
  startDate: string;
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
  name: string;
  cost: string;
  highlightedText: string;
  department: string;
  period: number[];
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

export interface Department {
  id?: string;
  name: string;
  timeCreated: string;
  timeUpdated: string;
}

export type Activities = { [key: string]: Activity };

export type Departments = { [key: string]: Department };

export type Occurrences = { [key: string]: Occurrence };