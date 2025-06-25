// VentasAdminPanel.jsx
import { useState, useEffect } from "react";
import { useFetch, postData, fetchData } from "../../hooks/useApi";
import { Link } from "react-router-dom";
import "../../styles/VentasAdminPage.css";

const VentasAdminPanel = () => {
  const [productos] = useFetch("productos");
  const [categorias] = useFetch("categorias");
  const [talles] = useFetch("talles");
  const [ventas, setVentas] = useState([]);

  const [venta, setVenta] = useState({
    cliente_Id: "",
    productosSeleccionados: [],
    nombreCliente: "",
    contactoCliente: "",
    direccionCliente: "",
    metodo_pago_id: 1,
    usuario_Id: 1,
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
    if (!productos.length) return;

    let filtrados = [...productos];

    if (filtros.texto) {
      filtrados = filtrados.filter((p) =>
        p.nombre.toLowerCase().includes(filtros.texto.toLowerCase())
      );
    }

    if (filtros.talle) {
      filtrados = filtrados.filter((p) => p.talle_id === parseInt(filtros.talle));
    }

    if (filtros.categoria) {
      filtrados = filtrados.filter((p) => p.categoria_id === parseInt(filtros.categoria));
    }

    if (filtros.ordenPrecio === "mayor") {
      filtrados.sort((a, b) => b.precio - a.precio);
    } else if (filtros.ordenPrecio === "menor") {
      filtrados.sort((a, b) => a.precio - b.precio);
    }

    setProductosFiltrados(filtrados);
  }, [filtros, productos]);

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
      usuario_Id: venta.usuario_Id,
      metodo_pago_id: venta.metodo_pago_id,
      total,
      nombreCliente: venta.nombreCliente,
      contactoCliente: venta.contactoCliente,
      direccionCliente: venta.direccionCliente,
      productos: venta.productosSeleccionados.map((p) => ({
        producto_id: p.id,
        cantidad: p.cantidad,
        precio_unit: p.precio
      }))
    };

    await postData("ventas", nuevaVenta);
    window.location.reload();
  };

  const ventasAgrupadas = ventas.reduce((acc, venta) => {
    const { venta_id } = venta;
    if (!acc[venta_id]) {
      acc[venta_id] = {
        venta_id,
        cliente: venta.cliente,
        fecha: venta.fecha,
        productos: [],
      };
    }
    acc[venta_id].productos.push({
      nombre: venta.producto,
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

      <h5 className="titulo-ventas">📦 Registrar nueva venta</h5>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Nombre del cliente"
        onChange={(e) => setVenta({ ...venta, nombreCliente: e.target.value })}
      />
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Contacto"
        onChange={(e) => setVenta({ ...venta, contactoCliente: e.target.value })}
      />
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Dirección"
        onChange={(e) => setVenta({ ...venta, direccionCliente: e.target.value })}
      />

      <h6>🔍 Buscar productos</h6>
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
            {talles.map((t) => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select
            className="form-select mb-2"
            onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
          >
            <option value="">Filtrar por categoría</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="contenedor-productos">
        {productosFiltrados.map((p) => (
          <div className="d-flex align-items-center gap-2 mb-2" key={p.id}>
            <span className="flex-grow-1">
              {p.nombre} (${p.precio}) - Talle: {p.talle} / Categoría: {p.categoria}
            </span>
            <input
              type="number"
              min="0"
              className="form-control"
              style={{ width: "80px" }}
              placeholder="0"
              onChange={(e) => agregarProducto(p, parseInt(e.target.value))}
            />
          </div>
        ))}
      </div>

      {venta.productosSeleccionados.length > 0 && (
        <>
          <h6>🛒 Productos seleccionados:</h6>
          <ul className="list-group">
            {venta.productosSeleccionados.map((p) => (
              <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                {p.nombre} x {p.cantidad} = ${p.precio * p.cantidad}
                <div>
                  <button className="btn btn-sm btn-secondary me-1" onClick={() => reducirCantidad(p.id)}>➖</button>
                  <button className="btn btn-sm btn-secondary me-1" onClick={() => aumentarCantidad(p.id)}>➕</button>
                  <button className="btn btn-sm btn-danger" onClick={() => eliminarProducto(p.id)}>❌</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-2">
            <strong>Total: ${venta.productosSeleccionados.reduce((acc, p) => acc + p.precio * p.cantidad, 0).toFixed(2)}</strong>
          </div>
        </>
      )}

      <button className="btn btn-primary w-100 mt-3" onClick={registrarVenta}>💾 Confirmar venta</button>

      <hr />
      <h5 className="titulo-ventas">📋 Ventas registradas</h5>
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
      <button className="btn btn-secondary mb-3" onClick={buscarVentas}>🔍 Filtrar</button>

      <ul className="list-group ventas-scroll">
        {Object.values(ventasAgrupadas).map((v) => (
          <li key={v.venta_id} className="list-group-item">
            <strong>Cliente:</strong> {v.cliente}
            <br />
            <strong>Fecha:</strong> {new Date(v.fecha).toLocaleDateString("es-AR")}
            <br />
            <strong>Productos:</strong>
            <ul>
              {v.productos.map((p, i) => (
                <li key={i}>{p.nombre} x {p.cantidad} — ${p.precio_unit}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <div className="text-center mt-3">
        <Link to="/login" className="btn btn-outline-secondary">
          <i className="bi bi-box-arrow-in-left me-2"></i>Volver al login
        </Link>
      </div>
    </div>
  );
};

export default VentasAdminPanel;