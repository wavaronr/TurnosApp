import React, { useState } from "react";
import "../css/calendario.css";

function YearInput({ onYearChange }) {
    const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);

  // captura el evento para renderizar segun el año ingresado y envia por props para recalcular 
  const handleYearChange = (event) => {
    const newYear = event.target.value;
    setYear(newYear);
    onYearChange(newYear);
  };

  return (
    <input className="year-input" type="number" value={year} onChange={handleYearChange} />
  );
}

export default YearInput;


























//<button type="submit">Enviar</button>