
export function convertDateToDay(date: Date): string {
  const day = date.getDay();
  switch (day) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
  }
  throw new Error("Invalid day");
}

export function stringToDate(date: string): Date {
  return new Date(parseInt(date));
}

export function getEndDateFromStartDate(startDate: Date): Date {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  return endDate;
}