import { startOfISOWeek, addDays, setISOWeek, setYear } from 'date-fns';

export function getWeekDays(weekNumber, year) {
  let date = new Date(year, 0, 1);
  date = setISOWeek(date, weekNumber);

  const start = startOfISOWeek(date);

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const day = addDays(start, i);
    weekDays.push(day);
  }
  return weekDays;
}
