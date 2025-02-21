const fs = require('fs');
const { fakerES: faker } = require('@faker-js/faker');

// Subcategorías y nombres reales
const subcategoriasRopa = [
  { subcategoria: 'Polos', nombres: ['Polo básico', 'Polo estampado', 'Polo deportivo'] },
  { subcategoria: 'Camisas', nombres: ['Camisa manga larga', 'Camisa casual', 'Camisa formal'] },
  { subcategoria: 'Pantalones', nombres: ['Jean clásico', 'Pantalón cargo', 'Jogger urbano'] },
  { subcategoria: 'Chompas', nombres: ['Chompa tejida', 'Suéter oversize', 'Cárdigan casual'] },
  { subcategoria: 'Casacas', nombres: ['Casaca de cuero', 'Casaca deportiva', 'Parka impermeable'] },
  { subcategoria: 'Vestidos', nombres: ['Vestido floral', 'Vestido largo', 'Vestido casual'] },
  { subcategoria: 'Faldas', nombres: ['Falda midi', 'Falda de mezclilla', 'Minifalda'] }
];

const subcategoriasCalzado = [
  { subcategoria: 'Zapatillas', nombres: ['Zapatilla deportiva', 'Zapatilla casual', 'Sneakers urbanos'] },
  { subcategoria: 'Zapatos', nombres: ['Zapato formal', 'Mocasines de cuero', 'Zapatos oxford'] },
  { subcategoria: 'Botas', nombres: ['Bota de cuero', 'Bota casual', 'Bota impermeable'] },
  { subcategoria: 'Sandalias', nombres: ['Sandalia playera', 'Sandalia de cuero', 'Sandalia urbana'] }
];

const subcategoriasAccesorios = [
  { subcategoria: 'Gorras', nombres: ['Gorra plana', 'Gorra trucker', 'Gorra deportiva'] },
  { subcategoria: 'Sombreros', nombres: ['Sombrero de paja', 'Sombrero Panamá', 'Sombrero casual'] },
  { subcategoria: 'Billeteras', nombres: ['Billetera de cuero', 'Billetera clásica', 'Billetera plegable'] },
  { subcategoria: 'Relojes', nombres: ['Reloj analógico', 'Reloj deportivo', 'Reloj elegante'] }
];

// Marcas reales por categoría
const marcasRopa = ['Zara', 'H&M', 'Levi\'s', 'Adidas', 'Nike', 'Puma', 'Bershka'];
const marcasCalzado = ['Nike', 'Adidas', 'Puma', 'Converse', 'Vans', 'Reebok', 'Timberland'];
const marcasAccesorios = ['Casio', 'Fossil', 'Ray-Ban', 'Oakley', 'Tommy Hilfiger', 'Michael Kors'];

const descripcionesEspanol = [
  'Producto de alta calidad y durabilidad.',
  'Diseñado para ofrecer comodidad todo el día.',
  'Material resistente y de excelente acabado.',
  'Perfecto para cualquier ocasión casual o formal.',
  'Ligero, elegante y fácil de combinar.',
  'Ideal para climas cálidos y fríos.',
  'Ajuste perfecto y gran flexibilidad.',
  'Diseño moderno con detalles exclusivos.',
  'Tejido suave y transpirable.',
  'Estilo urbano con un toque sofisticado.'
];

const generarProductos = (cantidad, subcategorias, marcas) => {
  const productos = [];
  for (let i = 0; i < cantidad; i++) {
    const subcatSeleccionada = faker.helpers.arrayElement(subcategorias);
    const nombre = faker.helpers.arrayElement(subcatSeleccionada.nombres);
    const marca = faker.helpers.arrayElement(marcas);

    productos.push({
      id: i + 1,
      nombre: `${nombre} - ${marca}`,
      precio: parseFloat(faker.commerce.price({ min: 50, max: 500 })),
      genero: faker.helpers.arrayElement(['Hombre', 'Mujer', 'Unisex']),
      imagen: faker.image.urlLoremFlickr({ category: 'fashion' }),
      descripcion: faker.helpers.arrayElement(descripcionesEspanol),
      talla: faker.helpers.arrayElements(['S', 'M', 'L', 'XL', 'Única'], 2),
      color: faker.helpers.arrayElements(['Negro', 'Blanco', 'Rojo', 'Azul', 'Verde']),
      subcategoria: subcatSeleccionada.subcategoria,
      marca: marca
    });
  }
  return productos;
};

// Generar cada categoría
const ropa = generarProductos(1050, subcategoriasRopa, marcasRopa);
const calzado = generarProductos(1700, subcategoriasCalzado, marcasCalzado);
const accesorios = generarProductos(1355, subcategoriasAccesorios, marcasAccesorios);

// Crear el objeto final en el formato esperado
const productosFinal = {
  ropa,
  calzado,
  accesorios
};

// Exportar a JSON
fs.writeFileSync('productos.json', JSON.stringify(productosFinal, null, 2));

console.log('✅ Productos generados y guardados en productos.json en formato por categoría.');
