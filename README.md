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


### Endpoints del Backend

## 📡 Endpoints del Backend
### 🔐 Autenticación (/api/auth)
POST /api/auth/register – Registrar un nuevo usuario

POST /api/auth/login – Iniciar sesión y obtener JWT

POST /api/auth/logout – 🔒 Cerrar sesión (requiere token)

### 👥 Amistades (/api/friends)
POST /api/friends/solicitar – 🔒 Enviar solicitud de amistad

POST /api/friends/responder – 🔒 Responder a una solicitud de amistad

GET /api/friends – 🔒 Obtener lista de amigos

GET /api/friends/ranking – 🔒 Ranking entre amigos

### 🎮 Partidas (/api/game)
POST /api/game/guardar – 🔒 Guardar partida en curso

GET /api/game/pendiente – 🔒 Obtener partida pendiente

POST /api/game/finalizar – 🔒 Finalizar partida y guardar resultados

### 🧠 Juego Wordle (/)
(Rutas públicas y protegidas mezcladas)

### 📢 Públicas:
GET /ping – Verificar que el servidor responde

GET /api/wordle – Obtener la palabra del día

GET /api/wordle/checkword/:word – Comprobar si una palabra es válida

GET /api/wordle/updateword – Generar nueva palabra del día

GET /api/wordle/setword/:word – Establecer manualmente la palabra del día

GET /api/wordle/random – Obtener palabra aleatoria

POST /register – Registrar usuario (alternativo)

POST /login – Login (alternativo)

### 🔒 Protegida:
GET /protected – Ruta protegida de prueba para validar JWT

### 📊 Estadísticas (/api/stats)
GET /api/stats/usuarios/estadisticas – 🔒 Obtener estadísticas del usuario autenticado

GET /api/stats/usuarios/historial – 🔒 Historial de partidas del usuario

GET /api/stats/ranking/global – 🔒 Ranking global de todos los usuarios
