import React, { useState, useEffect } from 'react';
import './App.css';

import Login from './components/Login.js';
import CardsCald from './components/CardsCald.js';
import Header from './components/Header.js';
import Home from './components/Home.js';
import CardProfile from './components/CardProfile.js';
import PersonOffCanvas from './components/PersonOffCanvas.js';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { CalendarProvider } from './context/CalendarContext'; // 1. Importar el Provider
import peopleData from './data/dataPerson.json'; 

function App() {
  // El estado de las personas sigue viviendo aquí, lo cual es correcto.
  const [people, setPeople] = useState([]);

  useEffect(() => {
    setPeople(peopleData);
  }, []);

  const handleSavePerson = (formData) => {
    if (formData.id) {
      setPeople(people.map(p => p.id === formData.id ? formData : p));
    } else {
      const newId = people.length > 0 ? Math.max(...people.map(p => p.id)) + 1 : 1;
      setPeople([...people, { ...formData, id: newId }]);
    }
  };

  const handleDeletePerson = (personId) => {
    setPeople(people.filter(p => p.id !== personId));
  };

  // 2. Toda la lógica del calendario (useState, useEffect) se ha ido de aquí.

  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        {/* 3. Envolver los componentes con el Provider */}
        <CalendarProvider>
          <Routes>
            <Route exact path="/" element={<Login />} key="login"></Route>
            <Route exact path="/Home" element={<Home />} key="Home"></Route>
            <Route
              exact
              path="/Calendario"
              // 4. Ya no se pasan props del calendario!
              element={<CardsCald />}
              key="cardcalendario"
            ></Route>
            <Route
              exact
              path="/Perfiles"
              element={<CardProfile people={people} onSave={handleSavePerson} onDelete={handleDeletePerson} />}
              key="profiles"
            ></Route>
          </Routes>
          {/* El OffCanvas también necesita acceso al contexto y a las personas */}
          <PersonOffCanvas people={people} />
        </CalendarProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
