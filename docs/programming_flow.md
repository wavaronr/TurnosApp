# Plan de Arquitectura para la Gestión de Programación de Turnos

Este documento describe la arquitectura y el flujo de datos para la gestión de la programación de turnos, implementando un sistema de cache en el cliente y lógica de negocio para la persistencia de datos.

## 1. Objetivos

- **Eficiencia:** Minimizar las llamadas a la API mediante un cache en el cliente.
- **Integridad de Datos:** Impedir la modificación de programaciones de meses pasados.
- **Experiencia de Usuario Fluida:** Permitir la edición en tiempo real de una "programación temporal" sin bloquear la interfaz.

## 2. Flujo de Datos y Componentes Clave

### Estados en el Frontend (`CalendarContext`)

1.  **`schedulesCache` (Cache de Programaciones):**
    -   **Propósito:** Almacenar en memoria las programaciones de los meses ya consultados a la API.
    -   **Estructura:** Un objeto donde cada clave es una cadena `YYYY-M` (ej. `"2024-10"`) y el valor es el objeto de la programación para ese mes.
    -   **Beneficio:** Evita peticiones `GET` repetitivas al navegar entre meses.

2.  **`temporarySchedule` (Programación Temporal):**
    -   **Propósito:** Contener el estado actual de la programación que el usuario está editando para el mes seleccionado.
    -   **Funcionamiento:** Todas las operaciones de asignación y remoción de turnos (`assignShifts`, `removeShift`) modifican este estado. El calendario principal (`ProgrammingCalendar`) se renderiza basado en este objeto.
    -   **Beneficio:** Proporciona una respuesta visual inmediata a las acciones del usuario.

### API Endpoints (Backend)

1.  **`GET /api/programming/:year/:month`**
    -   **Responsabilidad:** Obtener la programación definitiva guardada en la base de datos para un año y mes específicos.
    -   **Respuesta:** Retorna el objeto de la programación o un `404 Not Found` si no existe.

2.  **`PUT /api/programming/:year/:month`**
    -   **Responsabilidad:** Crear o actualizar la programación de un mes.
    -   **Lógica de Negocio Crítica:** Antes de guardar, valida que el mes/año de la solicitud no sea anterior al mes/año actual. Si lo es, retorna un error `403 Forbidden` para garantizar la integridad del histórico.
    -   **Payload:** Recibe el objeto `schedule` desde el `temporarySchedule` del frontend.

### Flujograma

```mermaid
graph TD
    A[Usuario abre la página de Programación<br>para Mes/Año X] --> B{Llamar a<br>loadProgramming(Mes, Año)};

    subgraph "Frontend: CalendarContext"
        B --> CacheCheck{¿Existe 'Mes-Año'<br>en schedulesCache?};
        CacheCheck -- Sí --> CacheHit[Usa datos del cache<br>setTemporarySchedule(cache[key])];
        CacheCheck -- No --> C[fetch a GET /api/programming/:año/:mes];
    end

    subgraph "Backend: API"
        C --> D{¿Existe programación<br>en la BD?};
        D -- Sí --> E[Retorna la programación (JSON)];
        D -- No (404) --> F[Retorna null o vacío];
    end

    subgraph "Frontend: CalendarContext"
        E --> StoreCache[Actualiza schedulesCache<br>setSchedulesCache({...cache, key: datos})];
        F --> StoreEmptyCache[Actualiza schedulesCache con objeto vacío<br>setSchedulesCache({...cache, key: {}})];
        StoreCache --> G[setTemporarySchedule(datos)];
        StoreEmptyCache --> H[setTemporarySchedule({})];
    end

    CacheHit & G & H --> I[Renderiza el Calendario<br>mostrando 'temporarySchedule'];

    I --> J{Usuario interactúa<br>con un día 'D'};
    J --> K{¿isDateLocked(D) es true?};
    K -- Sí --> L[Acciones de edición<br>deshabilitadas en la UI];
    K -- No --> M[Abre DayOffcanvas];

    M --> N{Usuario añade/quita persona};
    N --> O[Se actualiza 'temporarySchedule'<br>isDirty = true];
    O --> P{Usuario hace clic<br>en "Guardar Cambios"};

    subgraph "Frontend: CalendarContext"
        P --> Q[Llama a saveChangesToAPI<br>con 'temporarySchedule'];
        Q --> R[PUT a /api/programming/:año/:mes<br>con datos de 'temporarySchedule'];
    end

    subgraph "Backend: API"
        R --> S{¿El Mes/Año a guardar<br>es anterior al actual?};
        S -- Sí --> T[Rechaza la petición (403 Forbidden)<br>Retorna error];
        S -- No --> U[Guarda/Actualiza los datos<br>en la BD];
        U --> V[Retorna éxito (200 OK)<br>y datos actualizados];
    end

    subgraph "Frontend: CalendarContext"
        T --> W[Muestra notificación de error al usuario];
        V --> X[Actualiza schedulesCache con los nuevos datos<br>y muestra notificación de éxito];
        X --> I; # Re-renderiza con datos sincronizados
    end

    L --> J;
```
