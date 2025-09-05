import React, { useState, useEffect } from 'react';
import './App.css';

import Login from './components/Login.js';
import CardsCald from './components/CardsCald.js';
import Header from './components/Header.js';
import Home from './components/Home.js';
import CardProfile from './components/CardProfile.js';
import PersonOffCanvas from './components/PersonOffCanvas.js';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { holidays } from './components/holidays.js';

function App() {
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [yearSet, setYearSet] = useState(new Date().getFullYear());
  const [monthCalendario, setMonthCalendario] = useState(new Date().getMonth());
  const [colombianHolidays, setColombianHolidays] = useState([]);
  const [people, setPeople] = useState([]); // Estado para almacenar las personas

  useEffect(() => {
    const fetchData = async () => {
      const holidaysData = await holidays(yearSet);
      setColombianHolidays(holidaysData);
    };

    fetchData();
  }, [yearSet]);

  useEffect(() => {
    // Carga los datos de las personas desde la base de datos
    const fetchPeople = async () => {
      try {
        const response = await fetch('http://localhost:5000/people');
        const data = await response.json();
        setPeople(data);
      } catch (error) {
        console.error("Error fetching people data:", error);
      }
    };

    fetchPeople();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route exact path="/" element={<Login />} key="login"></Route>

          <Route exact path="/Home" element={<Home />} key="Home"></Route>
          <Route
            exact
            path="/Calendario"
            element={<CardsCald setSelectedWeek={setSelectedWeek} yearSet={yearSet} setYearSet={setYearSet} setMonthCalendario={setMonthCalendario} colombianHolidays={colombianHolidays} />}
            key="cardcalendario"
          ></Route>
          <Route
            exact
            path="/Perfiles"
            element={<CardProfile />}
            key="profiles"
          ></Route>
        </Routes>
        <PersonOffCanvas 
          selectedWeek={selectedWeek} 
          yearSet={yearSet} 
          monthCalendario={monthCalendario} 
          colombianHolidays={colombianHolidays}
          people={people} // Pasa las personas al componente OffCanvas
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
