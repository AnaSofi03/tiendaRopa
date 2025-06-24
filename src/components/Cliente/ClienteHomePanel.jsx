import React from "react";
import { Link } from "react-router-dom";
import { useFetch, postData } from "../../hooks/useApi.js";
import useStore from "../../store/useStore.js";

export default function ClienteHomePage() {
  const productos = useFetch("productos");
  const { cart, addToCart, removeFromCart, clearCart, user } = useStore();

  const confirmarCompra = async () => {
    if (cart.length === 0) return alert("El carrito está vacío.");

    // Aquí multiplicamos precio * cantidad
    const total = cart.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    const nuevaVenta = {
      clienteId: user.id,
      productos: cart,
      total,
      fecha: new Date().toISOString().split("T")[0],
    };

    await postData("ventas", nuevaVenta);
    clearCart();
    alert("Compra realizada con éxito.");
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">🛍️ Productos Disponibles</h2>

      {productos.length === 0 ? (
        <div className="alert alert-info text-center">
          No hay productos disponibles por el momento.
        </div>
      ) : (
        <div className="row g-4">
          {productos.map((p) => (
            <div key={p.id} className="col-12 col-sm-6 col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{p.nombre}</h5>
                  <p className="card-text text-muted mb-4">${p.precio}</p>
                  <p className="card-text text-muted mb-4">{p.descripcion}</p>
                  <button
                    className="btn btn-success mt-auto"
                    onClick={() => addToCart(p)}
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <hr className="my-5" />

      <h3 className="mb-3">🛒 Carrito de Compras</h3>

      {!cart || cart.length === 0 ? (
        <div className="alert alert-warning">Tu carrito está vacío.</div>
      ) : (
        <>
          <ul className="list-group mb-3">
            {cart.map((p) => (
              <li
                key={p.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {/* Mostrar nombre, precio y cantidad */}
                <span>
                  {p.nombre}, {p.descripcion} - ${p.precio} x {p.cantidad}
                </span>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => removeFromCart(p.id)}
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>

          {/* Mostrar total con cantidad */}
          <p className="fw-bold fs-5">
            Total: ${cart.reduce((acc, p) => acc + p.precio * p.cantidad, 0)}
          </p>
          <button className="btn btn-primary mb-3" onClick={confirmarCompra}>
            Confirmar compra
          </button>
        </>
      )}

      {/* Botón para volver al login */}
      <div className="text-center mt-4">
        <Link to="/login" className="btn btn-outline-secondary">
          <i className="bi bi-box-arrow-in-left me-2"></i>Volver al login
        </Link>
      </div>
    </div>
  );
}