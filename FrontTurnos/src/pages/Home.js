import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';
import CalendarIcon from '../icons/CalendarIcon';
import ProfilesIcon from '../icons/ProfilesIcon';
import ProgrammingIcon from '../icons/ProgrammingIcon';
import RoutesIcon from '../icons/RoutesIcon';

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
              <CalendarIcon />
            </div>
            <h3 className="home-card-title">Gestionar Calendario</h3>
            <p className="home-card-description">Crea, asigna y visualiza los turnos de tu equipo en un calendario interactivo.</p>
          </Link>
          <Link to="/Perfiles" className="home-card">
            <div className="home-card-icon">
              <ProfilesIcon />
            </div>
            <h3 className="home-card-title">Administrar Perfiles</h3>
            <p className="home-card-description">Consulta y gestiona la información de los miembros de tu equipo.</p>
          </Link>
          <Link to="/programacion" className="home-card">
            <div className="home-card-icon">
              <ProgrammingIcon />
            </div>
            <h3 className="home-card-title">Ver Programación</h3>
            <p className="home-card-description">Visualiza la programación de turnos en un formato de calendario optimizado.</p>
          </Link>
          <Link to="/rutas" className="home-card">
            <div className="home-card-icon">
              <RoutesIcon />
            </div>
            <h3 className="home-card-title">Gestionar Rutas</h3>
            <p className="home-card-description">Planifica y visualiza las rutas de transporte del personal.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
