import React, { createContext, useState, useEffect } from 'react';

// 1. Crear el Contexto
export const ProfileContext = createContext();

// 2. Crear el Proveedor del Contexto
export const ProfileProvider = ({ children }) => {
  // 3. Crear el estado para el perfil
  const [profile, setProfile] = useState(null);

  // 6. Efecto para cargar el perfil desde localStorage al iniciar la app
  useEffect(() => {
    const storedProfile = localStorage.getItem('profile');
    if (storedProfile) {
      try {
        // Intentamos convertir el string a un objeto JSON
        const profileObject = JSON.parse(storedProfile);
        setProfile(profileObject);
      } catch (error) {
        // Si falla (ej. es un string como "ADM"), lo ignoramos y limpiamos
        console.warn("Perfil en localStorage no era un objeto JSON válido, se ignora.");
        localStorage.removeItem('profile');
      }
    }
  }, []);

  // 4. Función de Login
  const login = (profileData, token) => {
    const profileObject = {
      role: profileData.role,
      email: profileData.email
    };
    // Guardamos el objeto como string JSON en localStorage
    localStorage.setItem('profile', JSON.stringify(profileObject));
    localStorage.setItem('token', token);
    // Actualizamos el estado de React
    setProfile(profileObject);
  };

  // 5. Función de Logout
  const logout = () => {
    // Limpiamos localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    localStorage.removeItem('email'); // También limpiamos el email por si acaso
    // Limpiamos el estado de React a null
    setProfile(null);
  };

  // Exponemos el estado y las funciones a los componentes hijos
  const value = { profile, login, logout };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};
