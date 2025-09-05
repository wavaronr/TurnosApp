import React, { useState } from 'react';
import './App.css';

import Login from './components/Login.js';
import CardsCald from './components/CardsCald.js';
import Header from './components/Header.js';
import Home from './components/Home.js';
import CardProfile from './components/CardProfile.js';
import AsesorOffCanvas from './components/AsesorOffCanvas.js';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

// BrowserRouter as Router,
function App() {
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [yearSet, setYearSet] = useState(new Date().getFullYear());
  const [monthCalendario, setMonthCalendario] = useState(new Date().getMonth());

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
            element={<CardsCald setSelectedWeek={setSelectedWeek} yearSet={yearSet} setYearSet={setYearSet} setMonthCalendario={setMonthCalendario} />}
            key="cardcalendario"
          ></Route>
          <Route
            exact
            path="/Perfiles"
            element={<CardProfile />}
            key="profiles"
          ></Route>
        </Routes>
        <AsesorOffCanvas selectedWeek={selectedWeek} yearSet={yearSet} monthCalendario={monthCalendario} />
      </BrowserRouter>
    </div>
  );
}

export default App;
