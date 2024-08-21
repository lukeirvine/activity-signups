
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
  throw new Error(`Invalid day: ${day}`);
}

export function stringToDate(date: string): Date {
  return new Date(date);
}

export function getEndDateFromStartDate(startDate: Date): Date {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  return endDate;
}

export function downloadCSV(data: string, filename: string): void {
  const blob = new Blob([data], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
}

export function getInitials(name: string): string {
  const names = name.split(" ");
  return names.map((name) => (name[0] || "").toUpperCase()).join("");
}