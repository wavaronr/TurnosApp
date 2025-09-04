import { getISOWeek } from 'date-fns';

import { getMondayNumbers } from './getMondayNumbers';

function WeekCount({ monthCalendario, yearSet, setWeekNumber }) {
  const day = [
    1,
    ...getMondayNumbers(monthCalendario, yearSet).filter(
      (number) => number !== 1
    ),
  ];

  const handleClick = (selectedWeek) => {
    setWeekNumber(selectedWeek);
  };

  const weekNumbers = day.map((dayItem) => {
    const date = new Date(yearSet, monthCalendario, dayItem);
    const weekNumber = getISOWeek(date); // funcion de libreria date-fns que retorna numero de semana segun date

    return (
      <li className="numerW" key={weekNumber + '-' + monthCalendario}>
        <button
          className="btn numerW"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasWithBothOptions"
          aria-controls="offcanvasWithBothOptions"
          onClick={() => handleClick(weekNumber)}
        >
          {weekNumber}
        </button>
      </li>
    );
  });

  return (
    <>
      <ol className="numerWeek">
        <li className="numerW-title" key={'Sem'}>
          Sem
        </li>
        {weekNumbers}
      </ol>
    </>
  );
}

export default WeekCount;
