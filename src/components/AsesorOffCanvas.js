import WeekDetail from './WeekDetail';
import { getMonthsTitule } from '../utils/getMonthsTitule';

function AsesorOffCanvas({ selectedWeek, yearSet, monthCalendario, colombianHolidays }) {
  const months = getMonthsTitule();
  const monthName = months[monthCalendario];

  return (
    <div
      className="offcanvas offcanvas-start offcanvas-wide"
      data-bs-scroll="true"
      id="offcanvasWithBothOptions"
      aria-labelledby="offcanvasWithBothOptionsLabel"
    >
      <div className="offcanvas-header">
        <h4 className='monthToday' id='monthToday'>{monthName}</h4>
        <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">
          {selectedWeek ? `Semana ${selectedWeek}` : 'Detalles de la Semana'}
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body">
       <WeekDetail selectedWeek={selectedWeek} yearSet={yearSet} monthCalendario={monthCalendario} colombianHolidays={colombianHolidays} /> 
      </div>
    </div>
  );
}

export default AsesorOffCanvas;
