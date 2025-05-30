// sockets/socketHandler.js
let io = null;

function initSocket(serverIo) {
  io = serverIo;

  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
    });
  });
}

function getIO() {
  return io || null; // ✅ Devuelve null si no está listo
}

module.exports = {
  initSocket,
  getIO
};
