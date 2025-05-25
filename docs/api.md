# API REST - Documentación de Endpoints

Base URL: `http://localhost:5000`

## 🔐 Autenticación
- `POST /api/register` → Registrar usuario
- `POST /api/login` → Iniciar sesión
- `POST /api/logout` → Cerrar sesión

## Gestión de cuenta
- `PUT  /api/usuarios/modificarPerfil` → Modificar perfil
- `DELETE /api/usuarios` → Eliminar cuenta
- `GET  /api/usuarios/verPerfil` → Ver perfil
- `POST /api/usuarios/recover-password` → Recuperar contraseña
- `PUT /api/usuarios/preferences` → Añadir preferencias de palabra generada
- `GET /api/usuarios/preferences` → Ver preferencias del usuario

## 👥 Amigos
- `POST /api/amigos/solicitar` -> Solicitar amistad
- `POST /api/amigos/responder` -> Aceptar o denegar solicitud amistad
- `GET /api/amigos` -> Ver amigos
- `GET /api/amigos/ranking` -> Ranking entre amigos

## 🎮 Partidas
- `POST /api/partidas/guardar` –> Guardar progreso
- `GET /api/partidas/pendiente` –> Obtener partida pendiente
- `POST /api/partidas/finalizar` –> Finalizar partida
- `POST /api/partidas/nueva` –> Nueva palabra

## 📊 Estadísticas
- `GET /api/stats/usuarios/estadisticas` –> Tus estadísticas
- `GET /api/stats/usuarios/historial` –> Historial
- `GET /api/stats/ranking/global` –> Ranking global

## 🧠 Wordle (Públicos)
- `GET /ping` – Test
- `GET /api/wordle` – Palabra del día
- `GET /api/wordle/checkword/:word`
- `GET /api/wordle/random`
- `POST /register` / `POST /login` – Alternativos
