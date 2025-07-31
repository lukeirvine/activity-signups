export type DeepDuplicateDayRequest = {
  weekId: string;
  dayId: string;
  destWeekId: string;
  destDate: string;
}

export type DeepDuplicateDayResponse = {
  success: boolean;
  newDayId: string;
  message: string;
}
