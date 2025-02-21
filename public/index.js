fetch('http://localhost:3000/api/ropa')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('productos');

    data.forEach(producto => {
      const div = document.createElement('div');
      div.innerHTML = `
        <h3>${producto.nombre}</h3>
        <p>Precio: $${producto.precio}</p>
        <img src="http://localhost:3000${producto.imagen}" alt="${producto.nombre}" width="200">
      `;
      container.appendChild(div);
    });
  })
  .catch(error => console.error('Error cargando productos:', error));
