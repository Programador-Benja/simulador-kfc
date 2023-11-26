const combosDisponibles = document.getElementById("catalogo-combos");
const carritoContenedor = document.getElementById("contenedor-carrito");
const contadorCarrito = document.getElementById("contador-carrito");
const totalCompra = document.getElementById("total-dinero");
const vaciarCarrito = document.getElementById("vaciar-carrito");
const finalizarCompra = document.getElementById("finalizar-pago");
const nombreCliente = document.getElementById("nombre");
const apellidoCliente = document.getElementById("apellido");

let carrito = [];

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

finalizarCompra.addEventListener("click", () => {
    if (nombreCliente.value === "" || apellidoCliente.value === "") {
        Toastify({
            text: "Faltan datos por completar ⚠️",
            duration: 1500,
            gravity: "top",
            style: {
                background: "#dc3545",
                color: "#fff"
            }
        }).showToast()
    } else {
        Swal.fire({
            title: "¿Deseas realizar la siguiente compra?",
            text: "El total es de: " + carrito.reduce((acc, combo) => acc + (combo.precio * combo.cantidad), 0),
            imageUrl: "/img/logo2.png",
            imageHeight: 300,
            imageAlt: "Logo",
            showCancelButton: true,
            confirmButtonColor: "red",
            cancelButtonColor: "black",
            confirmButtonText: "Finalizar Compra",
            cancelButtonText: "Cancelar",
            showClass: {
                popup: "animate__animated animate__bounceIn"
            },
            hideClass: {
                popup: "animate__animated animate__bounceOut"
            }
        }).then((result) => {
            if (carrito.reduce((acc, combo) => acc + (combo.precio * combo.cantidad), 0) > 0){
                if (result.isConfirmed) {
                    Swal.fire({
                        title: "Su compra se ha realizado con exito",
                        confirmButtonColor: "red",
                        icon: "success",
                        iconColor: "red"
                    })
                    carrito.length = 0
                    actualizarCarrito()
                }
            }
        }) 
    }
})

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
        <div class="card-body combos-descripcion">
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
        div.classList.add("carrito-container");
        div.innerHTML = `
        <div class="carrito-flex">
            <p class="font-monospace elemento">Combo: ${combo.nombre}</p>
            <p class="font-monospace elemento">Precio: $${combo.precio}</p>
            <p class="font-monospace elemento">Cantidad: ${combo.cantidad}</p>
            <button type="button" class="btn btn-danger elemento" onclick="eliminarDelCarrito(${combo.id})">Delete <i class="fa-solid fa-delete-left"></i></button>
        </div>
        <div class="linea-division">
            <hr>
        </div>
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

