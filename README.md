# Proyecto - Wordle

Este es un proyecto para el juego **Wordle** que consta de dos partes principales: el **frontend** y el **backend**. El frontend está desarrollado con **React** y **TypeScript**, mientras que el backend está construido usando **Node.js**, **Express** y **MongoDB**. Este archivo README describe cómo ejecutar ambas partes por separado y simultáneamente.

## Estructura del Proyecto

/Proyecto-IW
├── /client # Frontend (React)
│ ├── /node_modules
│ ├── /public
│ ├── /src # Componentes y vistas de React
│ ├── package.json
│ ├── tsconfig.json
│ └── README.md
├── /server # Backend (Node.js/Express)
│ ├── /node_modules
│ ├── /api # Rutas y controladores del backend
│ ├── /build
│ ├── package.json
│ └── tsconfig.json
├── package.json # Script raíz para ejecutar ambos servicios
└── README.md

## Tecnologías Utilizadas

- **Frontend:**
  - React 18
  - TypeScript
  - React Router DOM
  - React Toastify
  - Bootstrap

- **Backend:**
  - Node.js
  - Express
  - TypeScript
  - MongoDB + Mongoose
  - JWT para autenticación
  - Dotenv para configuración

- **Desarrollo:**
  - Nodemon + ts-node
  - Concurrency (ejecución simultánea de frontend y backend)


## Ejecución del Proyecto

### Paso 1: Instalación de dependencias

npm install           # Instala dependencias del proyecto raíz
cd client && npm install   # Instala dependencias del frontend
cd ../server && npm install  # Instala dependencias del backend

### Paso 2: Ejecutar servidor y cliente simultáneamente

npm start # Desde la raiz del proyecto -> \Proyecto-IW>

Este comando lanzará:

El backend en http://localhost:4000
El frontend en http://localhost:3000 (o una IP local como 192.168.X.X)


### 📊 Estadísticas (/api/stats)
GET /api/stats/usuarios/estadisticas – 🔒 Obtener estadísticas del usuario autenticado

GET /api/stats/usuarios/historial – 🔒 Historial de partidas del usuario

GET /api/stats/ranking/global – 🔒 Ranking global de todos los usuarios
