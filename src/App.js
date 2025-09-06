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
import peopleData from './data/dataPerson.json'; // Importamos los datos locales

function App() {
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [yearSet, setYearSet] = useState(new Date().getFullYear());
  const [monthCalendario, setMonthCalendario] = useState(new Date().getMonth());
  const [colombianHolidays, setColombianHolidays] = useState([]);
  const [people, setPeople] = useState([]); // Estado único para las personas

  useEffect(() => {
    const fetchData = async () => {
      const holidaysData = await holidays(yearSet);
      setColombianHolidays(holidaysData);
    };
    fetchData();
  }, [yearSet]);

  useEffect(() => {
    // Carga los datos de las personas desde el archivo JSON
    setPeople(peopleData);
  }, []);

  // --- Funciones del CRUD para manejar el estado 'people' ---

  const handleSavePerson = (formData) => {
    if (formData.id) { 
      // Actualizar persona existente
      setPeople(people.map(p => p.id === formData.id ? formData : p));
    } else { 
      // Crear nueva persona
      const newId = people.length > 0 ? Math.max(...people.map(p => p.id)) + 1 : 1;
      setPeople([...people, { ...formData, id: newId }]);
    }
  };

  const handleDeletePerson = (personId) => {
    // Eliminar persona
    setPeople(people.filter(p => p.id !== personId));
  };

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
            // Pasamos los datos y las funciones a CardProfile
            element={<CardProfile people={people} onSave={handleSavePerson} onDelete={handleDeletePerson} />}
            key="profiles"
          ></Route>
        </Routes>
        <PersonOffCanvas 
          selectedWeek={selectedWeek} 
          yearSet={yearSet} 
          monthCalendario={monthCalendario} 
          colombianHolidays={colombianHolidays}
          // Pasamos los mismos datos a PersonOffCanvas
          people={people} 
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
