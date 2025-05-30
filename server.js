const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { db, initializeDatabase } = require('./db/database'); // Inicializa la base de datos y crea la tabla

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Inicializar Socket.IO con los eventos personalizados
const { initSocket } = require('./sockets/socketHandler');
initSocket(io);

// Inicializa base de datos
initializeDatabase();

// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos (frontend básico)
app.use(express.static('public'));

// Rutas REST para gestión de tareas
const routesTarea = require('./routes/tareas');
app.use('/tareas', routesTarea);

// Iniciar servidor
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
