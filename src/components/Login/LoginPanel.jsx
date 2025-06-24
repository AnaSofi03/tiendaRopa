import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useStore from "../../store/useStore.js";

export default function LoginPage() {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!nombre || !password) {
      alert("Por favor, ingresa usuario y contraseña");
      return;
    }

    try {
      const res = await axios.get("http://localhost:3001/usuarios");
      const user = res.data.find(
        (u) => u.nombre === nombre && u.password === password
      );

      if (user) {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        console.log("Usuario logueado:", user);
        user.rol === "admin" ? navigate("/admin/ventas") : navigate("/productos");
      } else {
        alert("Usuario o contraseña incorrectos");
      }
    } catch (error) {
      alert("Error en la conexión con el servidor.");
      console.error(error);
    }
  };

  return (
    <div className="bg-light vh-100 w-100 d-flex align-items-center justify-content-center">
      <div
        className="bg-white p-5 rounded shadow text-center"
        style={{ maxWidth: 400, width: "100%" }}
      >
        <h2 className="mb-4">Iniciar sesión</h2>

        <form onSubmit={handleLogin}>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Usuario"
          className="form-control mb-3"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          type="password"
          className="form-control mb-3"
        />
        <button type="submit" className="btn btn-primary w-100" onClick={handleLogin}>
          Ingresar
        </button>
        </form>
      </div>
    </div>
  );
}