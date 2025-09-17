# Aplicación de Gestión de Turnos (Full-Stack)

Esta es una aplicación Full-Stack para la gestión de turnos, personal y logística, construida con el stack MERN (MongoDB, Express, React, Node.js).

## Arquitectura del Proyecto

Este proyecto está organizado como un **monorepo**, conteniendo tanto la aplicación cliente (frontend) como la API del servidor (backend) en un solo repositorio para facilitar el desarrollo y la gestión.

-   `./FrontTurnos/`: Contiene la aplicación de React (cliente). Para más detalles, consulta el README dentro de esa carpeta.
-   `./BackendTurnos/`: Contiene la API RESTful hecha con Node.js, Express y Mongoose.

### Cómo ejecutar el proyecto

**IMPORTANTE:** Necesitarás dos terminales para ejecutar el frontend y el backend simultáneamente. Se utiliza `pnpm` como gestor de paquetes.

#### 1. Iniciar el Backend (API)

```bash
# Navega a la carpeta del backend
cd BackendTurnos

# Instala las dependencias (solo la primera vez)
pnpm install

# Inicia el servidor
pnpm start
```

El servidor del backend se ejecutará en `http://localhost:5000`.

#### 2. Iniciar el Frontend (Cliente)

```bash
# Navega a la carpeta del frontend
cd FrontTurnos

# Instala las dependencias (si no lo has hecho)
pnpm install

# Inicia la aplicación de React
pnpm start
```

La aplicación de React se abrirá en `http://localhost:3000`.
