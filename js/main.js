const combosDisponibles = document.getElementById("catalogo-combos");
const carritoContenedor = document.getElementById("contenedor-carrito");
const contadorCarrito = document.getElementById("contador-carrito");
const totalCompra = document.getElementById("total-dinero");
const vaciarCarrito = document.getElementById("vaciar-carrito");

vaciarCarrito.addEventListener("click", () => {
    Swal.fire({
        title: "Estas seguro que deseas vaciar el carrito",
        text: "Va a eliminar todos los combos del carrito",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "red",
        cancelButtonColor: "black",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
        showClass: {
            popup: "animate__animated animate__bounceIn"
        },
        hideClass: {
            popup: "animate__animated animate__bounceOut"
        }
    }).then((result) => {
        if (result.isConfirmed) {
            carrito.length = 0
            actualizarCarrito()
        }
    })
})

let carrito = [];

combosDisponibles.addEventListener("click", (e) => {
    if (e.target.classList.contains("agregar")){
        Toastify({
                text: "Agregado al carrito 🛒",
                duration: 2000,
                gravity: "bottom",
                style: {
                    background: "#dc3545",
                    color: "#fff"
                }
            }).showToast()
        validarComboAlCarrito(e.target.id)
    };
})

const validarComboAlCarrito = (comboId) => {
    const productoRepetido = carrito.find((combo) => combo.id == comboId)

    if (!productoRepetido) { //undefine => false
        const combo = combos.find(combo => combo.id == comboId)
        agregarAlCarrito(combo.id)
    } else {
        productoRepetido.cantidad++
        actualizarCarrito()
    }
}

combos.forEach((combo) => {
    const div = document.createElement("div");
    div.classList.add("dis-flex");
    div.innerHTML = `
        <div class="card tarjeta">
            <img src="${combo.img}" class="card-img-top catalogo-img" alt="Imagenes">
                <div class="card-body">
                  <h5 class="card-title">${combo.nombre}</h5>
                  <p class="card-text">${combo.descripcion}</p>
                    <div class="d-grid gap-2">
                        <button id="${combo.id}" class="btn btn-danger agregar" type="button">Agregar al carrito <i class="fa-solid fa-cart-plus"></i></button>
                    </div>
                </div>
        </div>
    `
    combosDisponibles.appendChild(div);
})

const actualizarCarrito = () => {
    carritoContenedor.innerHTML= "";
    
    carrito.forEach((combo) => {
        const div = document.createElement("div");
        div.classList.add("dis-flex");
        div.innerHTML = `
        <p class="font-monospace">Combo: ${combo.nombre}</p>
        <span class="font-monospace">Precio: ${combo.precio}</span>
        <p class="font-monospace">Cantidad: ${combo.cantidad}</p>
        <button type="button" class="btn btn-danger" onclick="eliminarDelCarrito(${combo.id})">Delete <i class="fa-solid fa-delete-left"></i></button>
        `
        carritoContenedor.appendChild(div)
    })
    contadorCarrito.innerHTML = carrito.length;
    totalCompra.innerHTML = carrito.reduce((acc, combo) => acc + (combo.precio * combo.cantidad), 0)
    guardarCarritoStorage(carrito)
}

const agregarAlCarrito = (comboId) =>{
    const item = combos.find((combo) => combo.id === comboId);
    carrito.push(item);
    actualizarCarrito()
}

const eliminarDelCarrito = (comboEliminar) => {
    const item = carrito.find((combo) => combo.id === comboEliminar);
    const indice = carrito.indexOf(item)
    carrito.splice(indice,1)
    actualizarCarrito()
}

const guardarCarritoStorage = (carrito) => {
    localStorage.setItem("carrito", JSON.stringify(carrito))
};

const obtenerCarritoStorage = () => {
    const carritoStorage = JSON.parse(localStorage.getItem("carrito"))
    return carritoStorage
}

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("carrito")){
        carrito = obtenerCarritoStorage()
        actualizarCarrito()  
    }
})