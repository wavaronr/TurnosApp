import { getISOWeek } from 'date-fns';
import { getMondayNumbers } from './getMondayNumbers';
import { useCalendar } from '../context/CalendarContext'; // Importar hook

// Limpiar la firma, solo necesita monthCalendario
function WeekCount({ monthCalendario }) { 
  // Obtener todo lo necesario del contexto
  const { yearSet, setSelectedWeek, setMonthCalendario } = useCalendar();

  const day = [
    1,
    ...getMondayNumbers(monthCalendario, yearSet).filter(
      (number) => number !== 1
    ),
  ];

  const handleClick = (selectedWeek) => {
    setSelectedWeek(selectedWeek);
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
