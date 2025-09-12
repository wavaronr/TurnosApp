import React from 'react';
import './App.css';

import Login from './components/Login.js';
import CardsCald from './components/CardsCald.js';
import Header from './components/Header.js';
import Home from './components/Home.js';
import CardProfile from './components/CardProfile.js';
import PersonOffCanvas from './components/PersonOffCanvas.js';
import PrivateRoute from './components/PrivateRoute.js';
import PublicRoute from './components/PublicRoute.js';
import Programming from './views/Programming.js';
import Rutas from './views/Rutas.js';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { CalendarProvider } from './context/CalendarContext.js';
import { ProfileProvider } from './context/ProfileContext.js'; // Importamos el nuevo proveedor

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ProfileProvider> {/* Envolvemos con el ProfileProvider */}
          <Header />
          <CalendarProvider>
            <Routes>
              {/* Rutas Públicas */}
              <Route 
                exact 
                path="/" 
                element={<PublicRoute><Login /></PublicRoute>} 
                key="login-root"
              />
              <Route 
                exact 
                path="/login" 
                element={<PublicRoute><Login /></PublicRoute>} 
                key="login-path"
              />

              {/* Rutas Privadas */}
              <Route 
                exact 
                path="/home" 
                element={<PrivateRoute><Home /></PrivateRoute>}
                key="home"
              />
              <Route 
                exact 
                path="/calendario" 
                element={<PrivateRoute><CardsCald /></PrivateRoute>}
                key="cardcalendario"
              />
              <Route
                exact
                path="/programacion"
                element={<PrivateRoute><Programming /></PrivateRoute>}
                key="programming"
              />
              <Route
                exact
                path="/perfiles"
                element={<PrivateRoute><CardProfile /></PrivateRoute>}
                key="profiles"
              />
              <Route
                exact
                path="/rutas"
                element={<PrivateRoute><Rutas /></PrivateRoute>}
                key="rutas"
              />
            </Routes>
            
            <PersonOffCanvas />

          </CalendarProvider>
        </ProfileProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
