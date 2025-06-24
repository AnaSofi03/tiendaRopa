import { useState, useEffect } from "react";
import { useFetch, postData, fetchData } from "../../hooks/useApi";
import { Link } from "react-router-dom";
import "../../styles/VentasAdminPage.css";



const VentasAdminPanel = () => {
  const [productos] = useFetch("productos");
  const [ventas, setVentas] = useState([]);

  const [venta, setVenta] = useState({
    cliente_Id: "",
    productosSeleccionados: [],
    nombreCliente: "",
    contactoCliente: "",
    direccionCliente: "",
  });

  const [filtros, setFiltros] = useState({
    texto: "",
    ordenPrecio: "",
    talle: "",
    categoria: "",
  });

  const [filtrosVentas, setFiltrosVentas] = useState({
  nombre: "",
  fecha: "",
  producto: "",
});

const buscarVentas = async () => {
  const query = new URLSearchParams(filtrosVentas).toString();
  const datos = await fetchData(`ventas/filtrar?${query}`);
  setVentas(datos);
};

  const [productosFiltrados, setProductosFiltrados] = useState([]);

  useEffect(() => {
  if (!productos.length) return; // evita correr sin productos

  let filtrados = [...productos];

  if (filtros.texto) {
    filtrados = filtrados.filter((p) =>
      p.nombre.toLowerCase().includes(filtros.texto.toLowerCase())
    );
  }

  if (filtros.talle) {
    filtrados = filtrados.filter((p) => p.talle === filtros.talle);
  }

  if (filtros.categoria) {
    filtrados = filtrados.filter((p) => p.categoria === filtros.categoria);
  }

  if (filtros.ordenPrecio === "mayor") {
    filtrados.sort((a, b) => b.precio - a.precio);
  } else if (filtros.ordenPrecio === "menor") {
    filtrados.sort((a, b) => a.precio - b.precio);
  }

  setProductosFiltrados(filtrados);
}, [filtros, productos.length]);  // Solo reacciona a cambios en longitud, no contenido entero

    
    const agregarProducto = (producto, cantidad) => {
    if (cantidad <= 0 || isNaN(cantidad)) return;

    const existe = venta.productosSeleccionados.find((p) => p.id === producto.id);

    if (existe) {
        const actualizados = venta.productosSeleccionados.map((p) =>
        p.id === producto.id ? { ...p, cantidad } : p
        );
        setVenta({ ...venta, productosSeleccionados: actualizados });
    } else {
        setVenta({
        ...venta,
        productosSeleccionados: [
            ...venta.productosSeleccionados,
            { ...producto, cantidad },
        ],
        });
    }
    };
  const eliminarProducto = (id) => {
    const filtrados = venta.productosSeleccionados.filter((p) => p.id !== id);
    setVenta({ ...venta, productosSeleccionados: filtrados });
  };

  const aumentarCantidad = (id) => {
    const actualizados = venta.productosSeleccionados.map((p) =>
      p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p
    );
    setVenta({ ...venta, productosSeleccionados: actualizados });
  };

  const reducirCantidad = (id) => {
    const actualizados = venta.productosSeleccionados
      .map((p) => (p.id === id ? { ...p, cantidad: p.cantidad - 1 } : p))
      .filter((p) => p.cantidad > 0);
    setVenta({ ...venta, productosSeleccionados: actualizados });
  };

  const registrarVenta = async () => {
    const total = venta.productosSeleccionados.reduce(
      (acc, p) => acc + p.precio * p.cantidad,
      0
    );
    const nuevaVenta = {
      cliente_Id: venta.cliente_Id ? parseInt(venta.cliente_Id) : null,
      productos: venta.productosSeleccionados,
      total,
      fecha: new Date().toISOString().split("T")[0],
      nombreCliente: venta.nombreCliente || "",
      contactoCliente: venta.contactoCliente || "",
      direccionCliente: venta.direccionCliente || "",
    };

    await postData("ventas", nuevaVenta);
    window.location.reload();
    
  };

  const ventasAgrupadas = ventas.reduce((acc, venta) => {
  const { ventaId } = venta;
  if (!acc[ventaId]) {
    acc[ventaId] = {
      ventaId,
      nombreCliente: venta.nombreCliente,
      contactoCliente: venta.contactoCliente,
      direccionCliente: venta.direccionCliente,
      fecha: venta.fecha,
      total: venta.total,
      productos: [],
    };
  }

  acc[ventaId].productos.push({
    nombre: venta.nombreProducto,
    cantidad: venta.cantidad,
    precio_unit: venta.precio_unit,
  });

  return acc;
}, {});
  

  return (
    <div className="container">
      <br />
      <h2 className="titulo-principal">🧾 Gestión de Ventas</h2>

      <div>
        <Link to="/admin/productos" className="btn btn-outline-primary">
          Ir a Productos
        </Link>
      </div>
      <br />

      {/* Formulario del cliente y filtros */}
      <div className="">
        <h5 className="titulo-ventas">📦 Registrar nueva venta</h5>

        <div className="mb-3">
          <label className="form-label fw-semibold">Cliente</label>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Nombre del cliente (opcional)"
            onChange={(e) => setVenta({ ...venta, nombreCliente: e.target.value })}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Email o contacto (opcional)"
            onChange={(e) => setVenta({ ...venta, contactoCliente: e.target.value })}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Dirección (opcional)"
            onChange={(e) => setVenta({ ...venta, direccionCliente: e.target.value })}
          />
        </div>

        {/* Filtros */}
        <div className="mb-4">
          <h6 className="fw-semibold">🔍 Buscar productos</h6>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Buscar por nombre"
            onChange={(e) => setFiltros({ ...filtros, texto: e.target.value })}
          />
          <div className="row">
            <div className="col-md-4">
              <select
                className="form-select mb-2"
                onChange={(e) => setFiltros({ ...filtros, ordenPrecio: e.target.value })}
              >
                <option value="">Ordenar por precio</option>
                <option value="menor">Menor precio</option>
                <option value="mayor">Mayor precio</option>
              </select>
            </div>
            <div className="col-md-4">
              <select
                className="form-select mb-2"
                onChange={(e) => setFiltros({ ...filtros, talle: e.target.value })}
              >
                <option value="">Filtrar por talle</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="único">Único</option>
              </select>
            </div>
            <div className="col-md-4">
              <select
                className="form-select mb-2"
                onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
              >
                <option value="">Filtrar por categoría</option>
                <option value="Partes de Arriba">Partes de Arriba</option>
                <option value="Partes de Abajo">Partes de Abajo</option>
                <option value="Vestidos y Monos">Vestidos y monos</option>
                <option value="Abrigos">Abrigos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Productos filtrados */}
        <div className="contenedor-productos">
          <div className="row">
            {productosFiltrados.map((p) => (
              <div className="col-12 mb-2" key={p.id}>
                <div className="d-flex align-items-center gap-2">
                  <span className="flex-grow-1">
                    {p.nombre} (${p.precio}) - {p.talle} / {p.categoria}
                  </span>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    style={{ width: "80px" }}
                    placeholder="0"
                    onChange={(e) =>
                      agregarProducto(p, parseInt(e.target.value))
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carrito */}
        {venta.productosSeleccionados.length > 0 && (
          <>
            <div className="overflow-auto">
              <h6>🛒 Productos seleccionados:</h6>
              <div className="productos-seleccionados">
                <ul className="list-group list-group-flush">
                  {venta.productosSeleccionados.map((p) => (
                    <li key={p.id} className="item-producto">
                      <div>
                        {p.nombre} x {p.cantidad} = ${" "}
                        {(p.precio * p.cantidad).toFixed(2)}
                      </div>
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => reducirCantidad(p.id)}
                        >
                          ➖
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => aumentarCantidad(p.id)}
                        >
                          ➕
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => eliminarProducto(p.id)}
                        >
                          ❌
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="total-contenedor">
              <strong>Total:</strong>
              <span className="total-badge">
                $
                {venta.productosSeleccionados
                  .reduce((acc, p) => acc + p.precio * p.cantidad, 0)
                  .toFixed(2)}
              </span>
            </div>
          </>
        )}

        <button className="btn btn-primary w-100" onClick={registrarVenta}>
          💾 Confirmar venta
        </button>
      </div>

            

      {/* Lista de ventas */}
      <br />

      <h6 className="fw-semibold">🔍 Buscar ventas</h6>
                <input
                type="text"
                className="form-control mb-2"
                placeholder="Buscar por cliente"
                onChange={(e) => setFiltrosVentas({ ...filtrosVentas, nombre: e.target.value })}
                />
                <input
                type="date"
                className="form-control mb-2"
                onChange={(e) => setFiltrosVentas({ ...filtrosVentas, fecha: e.target.value })}
                />
                <input
                type="text"
                className="form-control mb-2"
                placeholder="Buscar por producto"
                onChange={(e) => setFiltrosVentas({ ...filtrosVentas, producto: e.target.value })}
                />
                <button className="btn btn-secondary" onClick={buscarVentas}>
                        🔍 Filtrar
                </button>
<br /><br />
      <h5 className="titulo-ventas">📋 Ventas registradas</h5>
      <div className="ventas-scroll">
        <ul className="lista-ventas">
  {Object.values(ventasAgrupadas).map((v) => (
    <li key={v.ventaId} className="item-venta">
      <div>
        <strong>Cliente:</strong> {v.nombreCliente || "Anónimo"}
        <p>Contacto: {v.contactoCliente}</p>
        <p>Dirección: {v.direccionCliente}</p>
        <p>Fecha: {new Date(v.fecha).toLocaleDateString("es-AR")}</p>

        <strong>🛍 Productos:</strong>
        <ul>
          {v.productos.map((p, i) => (
            <li key={i}>
              {p.nombre} x {p.cantidad} — ${p.precio_unit}
            </li>
          ))}
        </ul>
      </div>
      <span className="badge-total">Total: ${v.total}</span>
    </li>
  ))}
</ul>
      </div>

      <div className="text-center">
        <Link to="/login" className="btn btn-outline-secondary btn-volver">
          <i className="bi bi-box-arrow-in-left me-2"></i>Volver al login
        </Link>
      </div>
    </div>
  );
};

export default VentasAdminPanel;
