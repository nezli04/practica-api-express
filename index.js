
const express = require('express');

const app = express();
const PORT = 3000;

// Permite recibir solicitudes con datos JSON
app.use(express.json());

// Arreglo en memoria que simula una base de datos
let libros = [
  {
    id: 1,
    nombre: 'Cien años de soledad',
    autor: 'Gabriel García Márquez',
    genero: 'Novela'
  },
  {
    id: 2,
    nombre: 'El principito',
    autor: 'Antoine de Saint-Exupéry',
    genero: 'Fábula'
  },
  {
    id: 3,
    nombre: 'Don Quijote de la Mancha',
    autor: 'Miguel de Cervantes',
    genero: 'Clásico'
  }
];

// Ruta base para comprobar que el servidor funciona
app.get('/', (req, res) => {
  res.send('Servidor API REST en línea');
});

// 1. GET: obtener todos los libros
app.get('/api/recursos', (req, res) => {
  res.status(200).json(libros);
});

// 2. GET por ID: obtener un libro específico
app.get('/api/recursos/:id', (req, res) => {
  const id = Number(req.params.id);
  const libro = libros.find(item => item.id === id);

  if (!libro) {
    return res.status(404).json({
      mensaje: 'Libro no encontrado'
    });
  }

  res.status(200).json(libro);
});

// 3. POST: agregar un libro nuevo
app.post('/api/recursos', (req, res) => {
  const { nombre, autor, genero } = req.body;

  if (!nombre || !autor || !genero) {
    return res.status(400).json({
      mensaje: 'Debes enviar nombre, autor y genero'
    });
  }

  const nuevoId = libros.length > 0
    ? Math.max(...libros.map(item => item.id)) + 1
    : 1;

  const nuevoLibro = {
    id: nuevoId,
    nombre,
    autor,
    genero
  };

  libros.push(nuevoLibro);

  res.status(201).json(nuevoLibro);
});

// 4. PUT: actualizar un libro existente
app.put('/api/recursos/:id', (req, res) => {
  const id = Number(req.params.id);
  const indice = libros.findIndex(item => item.id === id);

  if (indice === -1) {
    return res.status(404).json({
      mensaje: 'Libro no encontrado'
    });
  }

  const { nombre, autor, genero } = req.body;

  libros[indice] = {
    ...libros[indice],
    ...(nombre !== undefined && { nombre }),
    ...(autor !== undefined && { autor }),
    ...(genero !== undefined && { genero })
  };

  res.status(200).json(libros[indice]);
});

// 5. DELETE: eliminar un libro
app.delete('/api/recursos/:id', (req, res) => {
  const id = Number(req.params.id);
  const indice = libros.findIndex(item => item.id === id);

  if (indice === -1) {
    return res.status(404).json({
      mensaje: 'Libro no encontrado'
    });
  }

  libros.splice(indice, 1);

  res.status(200).json({
    mensaje: 'Libro eliminado correctamente',
    id
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
