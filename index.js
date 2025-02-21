const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Cargar productos desde el archivo JSON
const productosPath = path.join(__dirname, 'productos.json');
let productos = require(productosPath) || {}; // Evita errores si el JSON está vacío

app.use(cors());
app.use(express.json());

// Servir la carpeta de imágenes
app.use('/api/images', express.static('public/images'));

// Función para guardar cambios en productos.json
const guardarProductos = () => {
  fs.writeFileSync(productosPath, JSON.stringify(productos, null, 2), 'utf-8');
};

// Endpoints individuales por categoría
app.get('/api/ropa', (req, res) => res.json(productos.ropa || []));
app.get('/api/calzado', (req, res) => res.json(productos.calzado || []));
app.get('/api/accesorios', (req, res) => res.json(productos.accesorios || []));

// Obtener todos los productos con su categoría
app.get('/api/productos', (req, res) => {
  const todasLasCategorias = Object.keys(productos);
  const todosLosProductos = todasLasCategorias.flatMap(categoria =>
    (productos[categoria] || []).map(item => ({ ...item, categoria }))
  );
  res.json(todosLosProductos);
});

// Agregar un nuevo producto
app.post('/api/productos', (req, res) => {
  const { categoria, ...nuevoProducto } = req.body;

  if (!productos[categoria]) {
    return res.status(400).json({ error: 'Categoría no válida' });
  }

  // Verificar que los campos principales existen
  if (!nuevoProducto.nombre || !nuevoProducto.precio || !nuevoProducto.marca) {
    return res.status(400).json({ error: 'Faltan datos obligatorios (nombre, precio, marca)' });
  }

  nuevoProducto.id = Date.now(); // ID único
  productos[categoria].push(nuevoProducto);
  guardarProductos();

  res.status(201).json(nuevoProducto);
});

// Eliminar un producto
app.delete('/api/productos/:categoria/:id', (req, res) => {
  const { categoria, id } = req.params;

  if (!productos[categoria]) {
    return res.status(400).json({ error: 'Categoría no válida' });
  }

  const indice = productos[categoria].findIndex(item => item.id === parseInt(id, 10));
  if (indice === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const [productoEliminado] = productos[categoria].splice(indice, 1);
  guardarProductos();

  res.json(productoEliminado);
});

// Actualizar un producto
app.put('/api/productos/:categoria/:id', (req, res) => {
  const { categoria, id } = req.params;
  const { categoria: _, ...datosActualizados } = req.body;

  if (!productos[categoria]) {
    return res.status(400).json({ error: 'Categoría no válida' });
  }

  const indice = productos[categoria].findIndex(item => item.id === parseInt(id, 10));
  if (indice === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  productos[categoria][indice] = { ...productos[categoria][indice], ...datosActualizados };
  guardarProductos();

  res.json(productos[categoria][indice]);
});

// 🔍 Buscar producto por ID dentro de una categoría específica
app.get('/api/productos/:categoria/:id', (req, res) => {
  const { categoria, id } = req.params;
  const idNumerico = parseInt(id, 10);

  if (!productos[categoria]) {
    return res.status(404).json({ error: 'Categoría no encontrada' });
  }

  const producto = productos[categoria].find(item => item.id === idNumerico);
  
  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado en esta categoría' });
  }

  res.json(producto);
});

// 🔍 Buscar producto por ID en cualquier categoría
app.get('/api/productos/id/:id', (req, res) => {
  const idNumerico = parseInt(req.params.id, 10);

  for (const categoria in productos) {
    if (Array.isArray(productos[categoria])) {
      const producto = productos[categoria].find(item => item.id === idNumerico);
      if (producto) {
        return res.json({ ...producto, categoria });
      }
    }
  }

  res.status(404).json({ error: 'Producto no encontrado en ninguna categoría' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
