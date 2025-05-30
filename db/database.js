// Creación de la base de datos y tabla para almacenar las tareas.
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'tareas.db');
const db = new sqlite3.Database(dbPath);

function initializeDatabase() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS tareas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL CHECK(length(titulo) <= 100),
        descripcion TEXT CHECK(length(descripcion) <= 500),
        status TEXT DEFAULT 'pendiente',
        fechaCreacion TEXT NOT NULL,
        fechaActualizacion TEXT NOT NULL
      )
    `);
  });
}

module.exports = {
  db,
  initializeDatabase
};
