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
  name: string;
  period: number;
  headcount: number;
  dayId: string;
  weekId: string;
  secondaryHeadcountName: string;
  secondaryHeadcount: number;
  notes: string;
}