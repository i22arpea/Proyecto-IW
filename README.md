# Proyecto - Wordle

Este es un proyecto para el juego **Wordle** que consta de dos partes principales: el **frontend** y el **backend**. El frontend está desarrollado con **React** y **TypeScript**, mientras que el backend está construido usando **Node.js**, **Express** y **MongoDB**.

## Estructura del Proyecto

```plaintext
/Proyecto-IW
├── client/             # Frontend en React + TypeScript
│   ├── public/
│   ├── src/            # Componentes, vistas, rutas
│   └── package.json
├── server/             # Backend en Node.js + Express
│   ├── api/            # Rutas y controladores
│   ├── models/         # Esquemas de Mongoose
│   ├── middlewares/
│   └── package.json
├── package.json        # Script raíz para ejecutar
└── README.md
```

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

npm start # Desde la raiz del proyecto -> \Proyecto-IW

Este comando lanzará:

El backend en http://localhost:5000
El frontend en http://localhost:3000 (o una IP local como 192.168.X.X)

# Funcionalidades Implementadas

## 👤 Gestión de Usuario
- Registro y login
- Modificar perfil
- Ver perfil
- Recuperar contraseña
- Cerrar sesión
- Eliminar cuenta

## 👥 Amigos
- Enviar solicitud de amistad
- Aceptar o rechazar solicitud
- Listar amigos

## 📊 Estadísticas
- Mostrar historial de partidas
- Mostrar estadísticas personales
- Ranking global (pendiente)

## 🎮 Partidas
- Guardar partida en curso
- Recuperar partida pendiente
- Finalizar partida
- Continuar partida guardada
- Jugar partida (en desarrollo o pendiente de pruebas)


