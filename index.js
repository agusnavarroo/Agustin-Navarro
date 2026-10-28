const productosJSON = `[
  { "id": 1, "nombre": "Cheeseburger", "descripcion": "Medallón de carne, cheddar, pepinos y ketchup", "categoria": "Clásicas", "precio": 7500, "stock": 10, "imagen": "img/1.jpg" },
  { "id": 2, "nombre": "Clásica Completa", "descripcion": "Carne, lechuga, tomate y cebolla", "categoria": "Clásicas", "precio": 8200, "stock": 8, "imagen": "img/2.jpg" },
  { "id": 3, "nombre": "Cuarto de Libra", "descripcion": "Carne de 200 g, cheddar, cebolla y tomate", "categoria": "Clásicas", "precio": 9900, "stock": 0, "imagen": "img/3.jpg" },
  { "id": 4, "nombre": "Bacon BBQ", "descripcion": "Carne, panceta crocante, cheddar y salsa barbacoa", "categoria": "Especiales", "precio": 12500, "stock": 5, "imagen": "img/4.jpg" },
  { "id": 5, "nombre": "Provoleta", "descripcion": "Carne, provoleta fundida y cebolla caramelizada", "categoria": "Especiales", "precio": 13200, "stock": 4, "imagen": "img/5.jpg" },
  { "id": 6, "nombre": "Doble Cheddar", "descripcion": "Doble carne, doble cheddar, cebolla y lechuga", "categoria": "Especiales", "precio": 14000, "stock": 3, "imagen": "img/6.jpg" },
  { "id": 7, "nombre": "Combo Clásico", "descripcion": "Hamburguesa completa con papas fritas", "categoria": "Combos", "precio": 15900, "stock": 6, "imagen": "img/7.jpg" },
  { "id": 8, "nombre": "Combo Crispy", "descripcion": "Pollo crispy, coleslaw y papas fritas", "categoria": "Combos", "precio": 16500, "stock": 2, "imagen": "img/8.jpg" },
  { "id": 9, "nombre": "Combo Onion", "descripcion": "Carne, aros de cebolla, cheddar y papas fritas", "categoria": "Combos", "precio": 17800, "stock": 1, "imagen": "img/9.jpg" }
]`;

const productos = JSON.parse(productosJSON);

//localStorage.setItem("productos", JSON.stringify(productos));

const productosGuardados = JSON.parse(localStorage.getItem("productos"));

console.table(productosGuardados);

const tituloBurgerHouse = document.getElementById("burger-house");
const sectionVacio = document.getElementById("products-container");
const inputBuscarProductos = document.getElementById("buscar-productos");

let carrito = [];

const carritoGuardado = JSON.parse(localStorage.getItem("carrito"));

if (carritoGuardado != null) {

  carrito = carritoGuardado;
}

const comidasSeleccionadas = document.getElementById("cart-list");
const precioTotal = document.getElementById("cart-total");
const botonVaciarCarrito = document.getElementById("vaciar-carrito");
const contadorCarrito = document.getElementById("contador-carrito");

function mostrarProductos(listaProductos) {

  if (listaProductos.length === 0) {

    sectionVacio.innerHTML = "No se encontraron productos";
    return;
  }

   const tarjetas = listaProductos.map(function(p) {

    let botonAgregarCarrito;

    if (p.stock === 0) {

      botonAgregarCarrito = `<button class = "boton-sin-stock" disabled>SIN STOCK</button>`;
    } else {

      botonAgregarCarrito = `<button class = "boton-agregar-carrito" id = "${p.id}">AGREGAR AL CARRITO</button>`;
    }

    return `<div class = "tarjetas">
              <img src = "${p.imagen}" alt = "${p.nombre}">
              <h3> ${p.nombre}</h3>
              <p>${p.descripcion}</p>
              <p class = "precio">$${p.precio}</p>
              ${botonAgregarCarrito}
            </div>`;
  })

  sectionVacio.innerHTML = tarjetas.join("");

  const botonesAgregarCarrito = document.querySelectorAll(".boton-agregar-carrito");

  botonesAgregarCarrito.forEach(function(b) {

    b.addEventListener("click", () => {

      const productoAgregadoCarrito = productosGuardados.find(function(p) {

        return p.id == b.id;
      })

      const productosEnCarrito = carrito.filter(function(p) {

        return p.id === productoAgregadoCarrito.id;
      })

      if (productosEnCarrito.length === 0) {

        carrito.push({id: productoAgregadoCarrito.id, nombre: productoAgregadoCarrito.nombre, precio: productoAgregadoCarrito.precio,
                      stock: productoAgregadoCarrito.stock, cantidad: 1
        });
      } else {

        const cantidadComprar = productosEnCarrito[0];

        if (cantidadComprar.cantidad >= cantidadComprar.stock) {

          alert("No hay mas stock disponible");
        } else {

          cantidadComprar.cantidad += 1;
        }
      }

      mostrarCarrito();

    })
  })

}

function mostrarCarrito() {

  const total = carrito.reduce(function(sumador, c) {

    return sumador + c.precio * c.cantidad;
  }, 0);

  const cantidadTotal = carrito.reduce(function(sumador, c) {

    return sumador + c.cantidad;
  }, 0);

  precioTotal.textContent = `Total: $${total}`;
  contadorCarrito.textContent = `Carrito (${cantidadTotal})`;

  localStorage.setItem("carrito", JSON.stringify(carrito));

  if (carrito.length === 0) {

    comidasSeleccionadas.innerHTML = "<li>Tu carrito esta vacio</li>";
    return;
  }

  const listasLi = carrito.map(function(c) {

    return `<li>${c.nombre} x${c.cantidad} - $${c.precio * c.cantidad}
              <button class = "boton-quitar" id = "quitar-${c.id}">Quitar</button>
            </li>`;
  })

  comidasSeleccionadas.innerHTML = listasLi.join("");

  const botonesQuitar = document.querySelectorAll(".boton-quitar");

  botonesQuitar.forEach(function(b) {

    b.addEventListener("click", () => {

      const borrarCarrito = carrito.find(function(c) {

        return `quitar-${c.id}` === b.id;
      })

      if (borrarCarrito.cantidad === 1) {

        carrito = carrito.filter(function(c) {

          return c.id !== borrarCarrito.id;
        })
      } else {

        borrarCarrito.cantidad -= 1;
      }

      mostrarCarrito();

    })
  })
}

tituloBurgerHouse.addEventListener("click", () => {

  mostrarProductos(productosGuardados);
})


inputBuscarProductos.addEventListener("keyup", () => {

  const textoIngresado = inputBuscarProductos.value.toLowerCase();

  const productosFiltrados = productosGuardados.filter(function(p) {

    return p.nombre.toLowerCase().includes(textoIngresado) || p.descripcion.toLowerCase().includes(textoIngresado)
  })

  mostrarProductos(productosFiltrados);
})

botonVaciarCarrito.addEventListener("click", () => {

  carrito = [];
  mostrarCarrito();
})

mostrarCarrito();