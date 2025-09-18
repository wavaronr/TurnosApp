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

/**
 * Icono de Spinner: Un icono de carga animado.
 */
export const SpinnerIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/>
        <path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75A11,11,0,0,0,12,1Z">
            <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
        </path>
    </svg>
);
