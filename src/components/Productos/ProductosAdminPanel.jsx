// ProductosAdminPage.jsx adaptado para funcionar con la base de datos tiendaRopa
// Incluye integración con los campos "talle_id" y "categoria_id"
// Se debe obtener previamente las listas de "talles" y "categorias" desde la API

import { useState, useEffect } from "react";
import { useFetch, postData, deleteData, updateData } from "../../hooks/useApi.js";
import { Link } from "react-router-dom";
import "../../styles/ProductosAdminPage.css";

export default function ProductosAdminPage() {
  const [productos, recargarProductos] = useFetch("productos");
  const [categorias] = useFetch("categorias");
  const [talles] = useFetch("talles");

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    precio: "",
    stock: "",
    descripcion: "",
    categoria_id: "",
    talle_id: ""
  });

  const [productoEditando, setProductoEditando] = useState(null);
  const [filtros, setFiltros] = useState({ texto: "", categoria_id: "", talle_id: "" });
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  useEffect(() => {
    let filtrados = [...productos];
    if (filtros.texto)
      filtrados = filtrados.filter(p => p.nombre.toLowerCase().includes(filtros.texto.toLowerCase()));
    if (filtros.categoria_id)
      filtrados = filtrados.filter(p => p.categoria_id === parseInt(filtros.categoria_id));
    if (filtros.talle_id)
      filtrados = filtrados.filter(p => p.talle_id === parseInt(filtros.talle_id));
    setProductosFiltrados(filtrados);
  }, [filtros, productos]);

  const handleChange = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
  };

  const agregarProducto = async () => {
    const { nombre, precio, stock, descripcion, categoria_id, talle_id } = nuevoProducto;
    if (!nombre || !precio || !stock || !descripcion || !categoria_id || !talle_id) {
      alert("Todos los campos son obligatorios");
      return;
    }
    await postData("productos", {
      nombre,
      precio: parseFloat(precio),
      stock: parseInt(stock),
      descripcion,
      categoria_id: parseInt(categoria_id),
      talle_id: parseInt(talle_id)
    });
    setNuevoProducto({ nombre: "", precio: "", stock: "", descripcion: "", categoria_id: "", talle_id: "" });
    recargarProductos();
  };

  const eliminarProducto = async (id) => {
    if (window.confirm("¿Eliminar este producto?")) {
      await deleteData("productos", id);
      recargarProductos();
    }
  };

  const editarProducto = (p) => {
    setProductoEditando(p);
    setNuevoProducto({
      nombre: p.nombre,
      precio: p.precio,
      stock: p.stock,
      descripcion: p.descripcion,
      categoria_id: p.categoria_id,
      talle_id: p.talle_id
    });
  };

  const guardarCambios = async () => {
    const { nombre, precio, stock, descripcion, categoria_id, talle_id } = nuevoProducto;
    if (!nombre || !precio || !stock || !descripcion || !categoria_id || !talle_id) {
      alert("Todos los campos son obligatorios");
      return;
    }
    await updateData("productos", productoEditando.id, {
      nombre,
      precio: parseFloat(precio),
      stock: parseInt(stock),
      descripcion,
      categoria_id: parseInt(categoria_id),
      talle_id: parseInt(talle_id)
    });
    setProductoEditando(null);
    setNuevoProducto({ nombre: "", precio: "", stock: "", descripcion: "", categoria_id: "", talle_id: "" });
    recargarProductos();
  };

  return (
    <div className="container py-4">
      <h2 className="titulo-productos">🛒 Gestión de Productos</h2>
      <div className="mb-3">
        <Link to="/admin/ventas" className="btn btn-outline-primary">Ir a Ventas</Link>
      </div>

      <h5 className="mb-2">➕ Agregar/Editar producto</h5>
      <div className="row g-2">
        <div className="col-md-4">
          <input name="nombre" value={nuevoProducto.nombre} onChange={handleChange} className="form-control" placeholder="Nombre" />
        </div>
        <div className="col-md-4">
          <input name="precio" value={nuevoProducto.precio} onChange={handleChange} className="form-control" type="number" placeholder="Precio" />
        </div>
        <div className="col-md-4">
          <input name="stock" value={nuevoProducto.stock} onChange={handleChange} className="form-control" type="number" placeholder="Stock" />
        </div>
        <div className="col-md-4">
          <select name="talle_id" value={nuevoProducto.talle_id} onChange={handleChange} className="form-select">
            <option value="">Seleccionar Talle</option>
            {talles.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
          </select>
        </div>
        <div className="col-md-4">
          <select name="categoria_id" value={nuevoProducto.categoria_id} onChange={handleChange} className="form-select">
            <option value="">Seleccionar Categoría</option>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>
        <div className="col-md-4">
          <input name="descripcion" value={nuevoProducto.descripcion} onChange={handleChange} className="form-control" placeholder="Descripción" />
        </div>
      </div>
      <div className="mt-2">
        {productoEditando ? (
          <button className="btn btn-primary" onClick={guardarCambios}>Guardar cambios</button>
        ) : (
          <button className="btn btn-success" onClick={agregarProducto}>Agregar producto</button>
        )}
      </div>

      <hr />

      <h5>📋 Lista de productos</h5>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Buscar por nombre"
        onChange={(e) => setFiltros({ ...filtros, texto: e.target.value })}
      />
      <div className="row mb-3">
        <div className="col-md-6">
          <select className="form-select" onChange={(e) => setFiltros({ ...filtros, categoria_id: e.target.value })}>
            <option value="">Filtrar por categoría</option>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>
        <div className="col-md-6">
          <select className="form-select" onChange={(e) => setFiltros({ ...filtros, talle_id: e.target.value })}>
            <option value="">Filtrar por talle</option>
            {talles.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
          </select>
        </div>
      </div>

      {productosFiltrados.length === 0 ? (
        <div className="alert alert-info">No hay productos registrados.</div>
      ) : (
        <div className="row">
          {productosFiltrados.map(p => (
            <div className="col-md-6 mb-2" key={p.id}>
              <div className="card p-3">
                <h6>{p.nombre} — ${p.precio}</h6>
                <p>Stock: {p.stock} | Talle: {p.talle} | Categoría: {p.categoria}</p>
                <p><small>{p.descripcion}</small></p>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => editarProducto(p)}>Editar</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => eliminarProducto(p.id)}>Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-4">
        <Link to="/login" className="btn btn-outline-secondary">Volver al login</Link>
      </div>
    </div>
  );
}
