import { useState, useEffect } from "react";
import { useFetch, postData, deleteData, updateData } from "../../hooks/useApi.js";
import { Link } from "react-router-dom";
import "../../styles/ProductosAdminPage.css";

export default function ProductosAdminPage() {
  const [reload, setReload] = useState(false);
  const [productos, setProductos] = useFetch("productos", [reload]);
  // Dependencia para recargar productos al agregar/eliminar/editar

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    precio: "",
    stock: "",
    descripcion: "",
    talle: "",
    categoria: "",
  });
  const [filtros, setFiltros] = useState ({
    texto: "",
    talle: "",
    categoria: "",
  });

  const [productosFiltrados, setProductosFiltrados] = useState([]);

  useEffect(() => {
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
  }, [filtros, productos]);

  



  const handleChange = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
  };

  const agregarProducto = async () => {
    const { nombre, precio, stock, descripcion, talle, categoria } = nuevoProducto;
    if (!nombre || !precio || !stock || !descripcion || !talle || !categoria) {
      alert("Todos los campos para agregar Productos son obligatorios.");
      return;
    }

    try {
      await postData("productos", {
        nombre,
        precio: parseFloat(precio),
        stock: parseInt(stock),
        descripcion,
        talle,
        categoria
      });
      setNuevoProducto({ nombre: "", precio: "", stock: "", descripcion: "", talle: "", categoria: "" });
      alert("Producto agregado exitosamente.");
      setReload(!reload); // Forzar recarga de productos
    } catch (error) {
      alert("Error al agregar producto. Revisa la consola.");
      console.error(error);
    }
  };

  const eliminarProducto = async (id) => {
    if (window.confirm("¿Eliminar este producto?")) {
      try {
        await deleteData("productos", id);
        alert("Producto eliminado exitosamente.");
        setReload(!reload); // Forzar recarga de productos
      } catch (error) {
        alert("Error al eliminar producto. Revisa la consola.");
        console.error(error);
      }
    }
  };

  const [productoEditando, setProductoEditando] = useState(null);
  const editarProducto = (producto) => {
    setProductoEditando(producto);
    setNuevoProducto({
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      descripcion: producto.descripcion,
      talle: producto.talle,
      categoria: producto.categoria || "",
    });
  };

const guardarCambios = async () => {
  const { nombre, precio, stock, descripcion, talle, categoria } = nuevoProducto;

  if (!nombre || !precio || !stock || !descripcion || !talle || !categoria) {
    alert("Los campos son obligatorios.");
    return;
  }

  try {
    await updateData("productos", productoEditando.id, {
      nombre,
      precio: parseFloat(precio),
      stock: parseInt(stock),
      descripcion,
      talle,
      categoria,
    });

    alert("Producto actualizado correctamente.");

    setProductoEditando(null);
    setNuevoProducto({ nombre: "", precio: "", stock: "", descripcion: "", talle: "", categoria: "" });

    // Actualizo el estado productos localmente para que React re-renderice
    setReload(!reload);

  } catch (error) {
    alert("Error al actualizar producto. Revisa la consola.");
    console.error(error);
  }
};



  return (
    <div className="container my-5">

      <h2 className="titulo-productos">🛒 Gestión de Productos</h2>
      <div className="boton-navegacion"><Link to="/admin/ventas" className="btn btn-outline-primary"> Ir a Ventas </Link></div>
        <br />
      <div className="card-producto">
        <h5 className="mb-3">➕ Agregar nuevo producto</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              name="nombre"
              className="form-control"
              placeholder="Nombre"
              value={nuevoProducto.nombre}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4">
            <input
              type="number"
              min="0"
              name="precio"
              className="form-control"
              placeholder="Precio"
              value={nuevoProducto.precio}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4">
            <input
              type="number"
              min="0"
              name="stock"
              className="form-control"
              placeholder="Stock"
              value={nuevoProducto.stock}
              onChange={handleChange}
            />
          </div>
          
          <div className="col-md-4">
          <select
                className="form-select mb-2"
                onChange={(e) => setFiltros({ ...filtros, talle: e.target.value })}
              >
                <option value="">Talle</option>
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
                <option value="">Categoría</option>
                <option value="Partes de Arriba">Partes de Arriba</option>
                <option value="Partes de Abajo">Partes de Abajo</option>
                <option value="Vestidos y Monos">Vestidos y Monos</option>
              </select>
            </div>


          <div className="col-md-4">
            <input
              type="text"
              name="descripcion"
              className="form-control"
              placeholder="Descripción"
              value={nuevoProducto.descripcion}
              onChange={handleChange}
            />
          </div>
        </div>

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
                <option value="">Filtrar por categoria</option>
                <option value="Partes de Arriba">Partes de Arriba</option>
                <option value="Partes de Abajo">Partes de Abajo</option>
                <option value="Vestidos y Monos">Vestidos y monos</option>
                <option value="Abrigos">Abrigos</option>
              </select>
            </div>
          </div>
        </div>

        
        <div className="mt-3">
          {productoEditando ? (
              <button className="btn btn-primary" onClick={guardarCambios}>
                Guardar cambios
              </button>
            ) : (
              <button className="btn btn-success" onClick={agregarProducto}>
                Guardar producto
              </button>
            )}

        </div>
      </div>

      <h5 className="mb-3">📋 Lista de productos</h5>
      {productosFiltrados.length === 0 ? (
        <div className="alert alert-info">No hay productos registrados.</div>
      ) : (
        <div className="lista-productos">
  <div className="row">
    {productosFiltrados.map((p) => (
      <div key={p.id} className="col-12 mb-2">
        <div className="item-producto">
          <div>
            <strong>{p.nombre}</strong> — ${p.precio} - {p.stock} en stock
            {p.descripcion && (
              <div>
                <small className="producto-descripcion">{p.descripcion}</small>
              </div>
            )}
          </div>
          <div className="d-flex flex-row gap-2">
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => eliminarProducto(p.id)}
            >
              Eliminar
            </button>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => editarProducto(p)}
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
      )}

      <div className="text-center mt-5">
        <Link to="/login" className="btn btn-outline-secondary">
          <i className="bi bi-box-arrow-in-left me-2"></i>Volver al login</Link>
      </div>
    </div>
  );
}

