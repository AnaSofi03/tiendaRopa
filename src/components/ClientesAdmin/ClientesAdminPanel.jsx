import { useState } from "react";
import { useFetch, postData, deleteData } from "../../hooks/useApi.js";

export default function ClientesAdminPage() {
  const clientes = useFetch("clientes");
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: "", email: "", direccion: "" });

  const handleChange = (e) => {
    setNuevoCliente({ ...nuevoCliente, [e.target.name]: e.target.value });
  };

  const agregarCliente = async () => {
    await postData("clientes", nuevoCliente);
    window.location.reload(); // refresca lista
  };

  // Eliminar cliente
  const eliminarCliente = async (id) => {
    await deleteData("clientes", id);
    window.location.reload();
  };

  return (
    <div className="container mt-4">
      <h2>Gestión de Clientes</h2>

      <div className="card p-3 mb-4">
        <h5>Nuevo cliente</h5>
        <input className="form-control mb-2" name="nombre" placeholder="Nombre" onChange={handleChange} />
        <input className="form-control mb-2" name="email" placeholder="Email" onChange={handleChange} />
        <input className="form-control mb-2" name="direccion" placeholder="Dirección" onChange={handleChange} />
        <button className="btn btn-success" onClick={agregarCliente}>Agregar</button>
      </div>

      <ul className="list-group">
        {clientes.map((c) => (
          <li key={c.id} className="list-group-item d-flex justify-content-between">
            <div>{c.nombre} - {c.email}</div>
            <button className="btn btn-danger btn-sm" onClick={() => eliminarCliente(c.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}