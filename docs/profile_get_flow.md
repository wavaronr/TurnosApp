# Modelado del Módulo de Perfiles (Flujo GET)

Este documento describe el flujo de datos para obtener y mostrar la lista de perfiles de usuario en la aplicación.

El flujo sigue un patrón claro desde la interfaz de usuario (React) hasta el backend, utilizando un contexto de React como intermediario para gestionar el estado.

## Diagrama del Flujo

```
+-----------------------+      +--------------------------+      +--------------------------+      +-----------------+
|     CardProfile.js    |----->|   CalendarContext.js     |----->|   getDataPersons.js      |----->|   Backend API   |
| (Componente de Vista) |      | (Gestor de Estado)       |      | (Servicio de Datos)      |      | (/api/personas) |
+-----------------------+      +--------------------------+      +--------------------------+      +-----------------+
          ^                                                                                             |
          |                                (5. Re-render con datos)                                     |
          +-------------------------------------------------------------------------------------------+
                                       (4. Retorna datos JSON)
```

## Pasos Detallados

1.  **Componente de Vista (`CardProfile.js`):**
    *   El ciclo de vida del componente comienza y necesita datos para mostrar.
    *   Llama al hook `useCalendar()` para conectarse al contexto y suscribirse a sus cambios.
    *   Intenta acceder a la variable de estado `people` que le provee el contexto.

2.  **Contexto (`CalendarContext.js`):**
    *   El `CalendarProvider` es el responsable de mantener el estado de los perfiles.
    *   Utiliza un hook `useEffect` que se ejecuta una sola vez (al montarse) para inicializar la carga de datos.
    *   Dentro del `useEffect`, llama a la función `getPersons()` (o una similar) importada desde el servicio de datos.

3.  **Servicio de Datos (`getDataPersons.js`):**
    *   Esta función contiene la lógica de comunicación con el backend.
    *   Ejecuta una llamada `fetch` o `axios` al endpoint del backend: `GET http://localhost:5000/api/personas`.
    *   Espera la respuesta y, si es exitosa, convierte los datos a formato JSON.
    *   Devuelve la lista de perfiles (un array de objetos) al `CalendarContext`.

4.  **Actualización de Estado en el Contexto:**
    *   La función asíncrona en `CalendarContext` recibe los datos del servicio.
    *   Llama a la función de actualización de estado (ej: `setPeople(datosRecibidos)`) para guardar los perfiles en su estado local.

5.  **Re-renderizado de la Vista:**
    *   Debido a que el estado en `CalendarContext` cambió, React automáticamente notifica a todos los componentes suscritos.
    *   `CardProfile.js` se vuelve a renderizar. En esta ocasión, el hook `useCalendar()` le entrega la variable `people` con los datos recién cargados.
    *   El componente itera sobre el array `people` y muestra un `profile-card` por cada usuario.
