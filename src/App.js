import React from 'react';
import './App.css';

import Login from './components/Login.js';
import CardsCald from './components/CardsCald.js';
import Header from './components/Header.js';
import Home from './components/Home.js';
import CardProfile from './components/CardProfile.js';
import PersonOffCanvas from './components/PersonOffCanvas.js';
import PrivateRoute from './components/PrivateRoute.js';
// Se elimina la importación de PeopleManager
import { Routes, Route, BrowserRouter } from 'react-router-dom';
// Corregir la importación añadiendo la extensión .js
import { CalendarProvider } from './context/CalendarContext.js';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <CalendarProvider>
          <Routes>
            <Route exact path="/" element={<Login />} key="login"></Route>
            <Route exact path="/Home" element={<PrivateRoute><Home /></PrivateRoute>} key="Home"></Route>
            <Route 
              exact 
              path="/Calendario" 
              element={<PrivateRoute><CardsCald /></PrivateRoute>}
              key="cardcalendario">
            </Route>
            <Route
              exact
              path="/Perfiles"
              element={<PrivateRoute><CardProfile /></PrivateRoute>}
              key="profiles"
            ></Route>
            {/* Se elimina la ruta /Personal */}
          </Routes>
          
          <PersonOffCanvas />

        </CalendarProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
