// Creación del CRUD
const { db } = require('../db/database');

function getTareas(callback) {
  const query = 'SELECT * FROM tareas ORDER BY fechaCreacion DESC';
  db.all(query, [], callback);
}

function createTarea(titulo, descripcion, callback) {
  const now = new Date().toISOString();
  const query = `
    INSERT INTO tareas (titulo, descripcion, status, fechaCreacion, fechaActualizacion)
    VALUES (?, ?, 'pendiente', ?, ?)
  `;
  db.run(query, [titulo, descripcion || '', now, now], function (err) {
    if (err) return callback(err);
    db.get('SELECT * FROM tareas WHERE id = ?', [this.lastID], callback);
  });
}

function updateEstatus(id, status, callback) {
  const now = new Date().toISOString();
  const query = `
    UPDATE tareas SET status = ?, fechaActualizacion = ?
    WHERE id = ?
  `;
  db.run(query, [status, now, id], function (err) {
    if (err) return callback(err);
    callback(null, { id, status });
  });
}

function deleteTarea(id, callback) {
  const query = 'DELETE FROM tareas WHERE id = ?';
  db.run(query, [id], function (err) {
    if (err) return callback(err);
    callback(null, { deleted: this.changes > 0 });
  });
}

module.exports = {
  getTareas,
  createTarea,
  updateEstatus,
  deleteTarea
};
