import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Bienvenido a tu Gestor de Turnos</h1>
        <p className="home-description">
          Organiza tus calendarios, gestiona los perfiles de tu equipo y optimiza la planificación de turnos de manera sencilla y eficiente.
        </p>
        <div className="home-cards-container">
          <Link to="/Calendario" className="home-card">
            <div className="home-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <h3 className="home-card-title">Gestionar Calendario</h3>
            <p className="home-card-description">Crea, asigna y visualiza los turnos de tu equipo en un calendario interactivo.</p>
          </Link>
          <Link to="/Perfiles" className="home-card">
            <div className="home-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="home-card-title">Administrar Perfiles</h3>
            <p className="home-card-description">Consulta y gestiona la información de los miembros de tu equipo.</p>
          </Link>
          <Link to="/programacion" className="home-card">
            <div className="home-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </div>
            <h3 className="home-card-title">Ver Programación</h3>
            <p className="home-card-description">Visualiza la programación de turnos en un formato de calendario optimizado.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
