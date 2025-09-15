import React from 'react';

// --- Iconos SVG Centralizados y Reutilizables ---

/**
 * Icono de Éxito: Un círculo verde con un check blanco.
 * Más impactante y alineado con la estética moderna.
 */
export const SuccessIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" >
    <circle cx="12" cy="12" r="11" fill="#28a745"/>
    <path d="M8 11.8571L10.8 14.4L16 9.6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/**
 * Icono de Error: Un círculo rojo con una 'X' blanca.
 * Visualmente claro y consistente con el icono de éxito.
 */
export const ErrorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="#dc3545"/>
    <path d="M15 9L9 15" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 9L15 15" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
