const combosDisponibles = document.getElementById("catalogo-combos");
const carritoContenedor = document.getElementById("contenedor-carrito");
const contadorCarrito = document.getElementById("contador-carrito");
const totalCompra = document.getElementById("total-dinero");
const vaciarCarrito = document.getElementById("vaciar-carrito");
const contenedorTotal = document.getElementById("contenedor-total");
const btnPagar = document.getElementById("btn-pagar");
const totalPago = document.getElementById("total-pago");
const confirmarPago = document.getElementById("confirmar-pago");
const errorPago = document.getElementById("error-pago");
const loader = document.getElementById("loader");
const cardNumber = document.getElementById("card-number");
const cardName = document.getElementById("card-name");
const cardDate = document.getElementById("card-date");
const cardCVV = document.getElementById("card-cvv");

let carrito = [];

cardNumber.addEventListener("input", () => {
    cardNumber.value = cardNumber.value
        .replace(/\D/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
});

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
            // 🔥 ALERTA DE ÉXITO
            Swal.fire({
                title: "Carrito vaciado 🛒",
                text: "Todos los productos fueron eliminados correctamente",
                icon: "success",
                confirmButtonColor: "green",
                timer: 1500,
                showConfirmButton: false
            });
        }
    })
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
    carritoContenedor.innerHTML = "";

    const fragment = document.createDocumentFragment();

    carrito.forEach((combo) => {
        const div = document.createElement("div");
        div.classList.add("carrito-container");

        div.innerHTML = `
            <div class="carrito-flex d-flex justify-content-between align-items-center">
                
                <div>
                    <p class="mb-1"><strong>${combo.nombre}</strong></p>
                    <small>Precio: $${combo.precio}</small><br>
                    <small>Cantidad: ${combo.cantidad}</small>
                </div>

                <button 
                    class="btn btn-danger btn-sm eliminar"
                    data-id="${combo.id}">
                    <i class="fa-solid fa-trash"></i>
                </button>

            </div>
            <hr>
        `;

        fragment.appendChild(div);

        
    });

    if (carrito.length === 0) {
        carritoContenedor.innerHTML = `
            <p class="text-center">🛒 Tu carrito está vacío</p>
            <p class="text-center text-muted">Agregá combos para comenzar tu pedido</p>
        `;
        contenedorTotal.style.display = "none";
    } else {
    contenedorTotal.style.display = "block";
    }

    carritoContenedor.appendChild(fragment);
    // Contador (mejor: total de items, no length)
    const totalItems = carrito.reduce((acc, c) => acc + c.cantidad, 0);
    contadorCarrito.innerText = totalItems;

    // Total $
    const total = carrito.reduce((acc, c) => acc + (c.precio * c.cantidad), 0);
    totalCompra.innerText = total;

    guardarCarritoStorage(carrito);
    toggleBotonPagar();
    toggleBotonVaciar();
};

carritoContenedor.addEventListener("click", (e) => {
    if (e.target.closest(".eliminar")) {
        const id = e.target.closest(".eliminar").dataset.id;
        eliminarDelCarrito(id);
    }
});

const agregarAlCarrito = (comboId) =>{
    const item = combos.find((combo) => combo.id === comboId);
    carrito.push(item);
    actualizarCarrito()
}

const eliminarDelCarrito = (comboEliminar) => {
    const item = carrito.find((combo) => combo.id == comboEliminar);

    if (item.cantidad > 1) {
        item.cantidad--;
    } else {
        carrito = carrito.filter((combo) => combo.id != comboEliminar);
    }

    actualizarCarrito();
};

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

// Activar/desactivar botón pagar
const toggleBotonPagar = () => {
    btnPagar.disabled = carrito.length === 0;
};

// Activar/desactivar botón vaciar
const toggleBotonVaciar = () => {
    vaciarCarrito.disabled = carrito.length === 0;
};

// Actualizar total en modal
btnPagar.addEventListener("click", () => {
    const total = carrito.reduce((acc, c) => acc + (c.precio * c.cantidad), 0);
    totalPago.innerText = total;
});

// Validación simple
const validarPago = () => {
    if (cardNumber.value.length !== 16) return "Número de tarjeta inválido";
    if (cardName.value.trim() === "") return "Nombre requerido";
    if (!cardDate.value.includes("/")) return "Fecha inválida";
    if (cardCVV.value.length < 3) return "CVV inválido";
    return null;
};

// Confirmar pago
confirmarPago.addEventListener("click", () => {
    errorPago.style.display = "none";

    const error = validarPago();

    if (error) {
        errorPago.innerText = error;
        errorPago.style.display = "block";
        return;
    }

    // Mostrar loader
    loader.style.display = "block";

    setTimeout(() => {
        loader.style.display = "none";

        Swal.fire({
            title: "Pago aprobado ✅",
            text: "Tu pedido está en camino 🍗",
            icon: "success",
            confirmButtonColor: "green"
        });

        carrito.length = 0;
        actualizarCarrito();
        toggleBotonPagar();

        // Reset inputs
        cardNumber.value = "";
        cardName.value = "";
        cardDate.value = "";
        cardCVV.value = "";

        const modal = bootstrap.Modal.getInstance(document.getElementById("modalPago"));
        modal.hide();

    }, 2000);
});