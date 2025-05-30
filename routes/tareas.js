// Creación de rutas
const express = require('express');
const router = express.Router();
const {
  getTareas,
  createTarea,
  updateEstatus,
  deleteTarea
} = require('../models/Tarea');

// Acceder al objeto `io` a través de una variable global compartida
const io = require('../sockets/socketHandler').getIO();

// Obtener tareas
router.get('/', (req, res) => {
  getTareas((err, tareas) => {
    if (err) return res.status(500).json({ error: 'Error al obtener tareas' });
    res.json(tareas);
  });
});

// Creación tarea
router.post('/', (req, res) => {
  const { titulo, descripcion } = req.body;
  if (!titulo || titulo.length > 100) {
    return res.status(400).json({ error: 'El título es obligatorio y debe tener máximo 100 caracteres' });
  }
  if (descripcion && descripcion.length > 500) {
    return res.status(400).json({ error: 'La descripción no debe exceder los 500 caracteres' });
  }

  createTarea(titulo, descripcion, (err, nuevaTarea) => {
    if (err) return res.status(500).json({ error: 'Error al crear tarea' });

    io.emit('nuevaTarea', nuevaTarea);
    res.status(201).json(nuevaTarea);
  });
});

// Actualizar estatus de tarea
router.put('/:id', (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!status) {
    return res.status(400).json({ error: 'El campo status es obligatorio' });
  }

  updateEstatus(id, status, (err, updated) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar tarea' });

    io.emit('updateTarea', updated);
    res.json(updated);
  });
});

// Eliminar tarea
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  deleteTarea(id, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar tarea' });

    if (result.deleted) {
      io.emit('deleteTarea', { id: parseInt(id) });
      res.json({ mensaje: 'Tarea eliminada' });
    } else {
      res.status(404).json({ error: 'Tarea no encontrada' });
    }
  });
});

module.exports = router;
