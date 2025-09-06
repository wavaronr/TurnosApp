import { getISOWeek } from 'date-fns';
// Corregir la ruta de importación de getMondayNumbers
import { getMondayNumbers } from '../utils/getMondayNumbers.js';
// Corregir la importación del contexto añadiendo la extensión .js
import { useCalendar } from '../context/CalendarContext.js';

// El componente vuelve a aceptar la prop monthCalendario
function WeekCount({ monthCalendario }) { 
  // Se obtiene el año y los setters del contexto, pero se usa la prop para el mes
  const { yearSet, setSelectedWeek, setMonthCalendario } = useCalendar();

  const day = [
    1,
    ...getMondayNumbers(monthCalendario, yearSet).filter(
      (number) => number !== 1
    ),
  ];

  const handleClick = (selectedWeek) => {
    setSelectedWeek(selectedWeek);
    // Al hacer clic, se actualiza el mes en el contexto global
    setMonthCalendario(monthCalendario);
  };

  const weekNumbers = day.map((dayItem) => {
    const date = new Date(yearSet, monthCalendario, dayItem);
    const weekNumber = getISOWeek(date); 

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
      </ol
      >
    </>
  );
}

export default WeekCount;
