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

/**
 * Icono de Guardar: Un disquete estilizado para la acción de guardar.
 */
export const SaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338A2.25 2.25 0 0017.088 3.75H15M12 3.75v12m-3-3l3 3 3-3" />
    </svg>
);
