export function getMondayNumbers(month, year) {
  const mondays = [];
  const date = new Date(year, month, 1);

  while (date.getMonth() === month) {
    if (date.getDay() === 1) { // 1 representa el lunes
      mondays.push(date.getDate());
    }
    date.setDate(date.getDate() + 1);
  }

  return mondays;
}
