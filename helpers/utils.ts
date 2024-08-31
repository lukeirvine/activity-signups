
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

export function verifyPeriodInput(inputString: string): boolean {
  // Trim spaces and normalize the input by replacing spaces around commas with just a comma
  inputString = inputString.trim().replace(/\s*,\s*/g, ',');

  // Split the input string by commas
  const numbers = inputString.split(',').map(Number);

  // Ensure all numbers are between 0 and 6 and there are no invalid numbers
  if (!numbers.every(num => num >= 0 && num <= 6 && !isNaN(num))) {
    return false;
  }

  // Check if the numbers are consecutive
  for (let i = 0; i < numbers.length - 1; i++) {
    if (numbers[i] + 1 !== numbers[i + 1]) {
      return false; // Not consecutive
    }
  }

  return true;
}