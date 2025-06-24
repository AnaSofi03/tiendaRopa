
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../styles/LandingPage.css"


export default function LandingPage() {
  return (
    <div className="landing-container">

    

      <div className="landing-card" style={{ maxWidth: 500 }}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/4553/4553639.png"
          alt="Carrito Logo"
          width="100"
          className="landing-logo"
        />
        <h1 className="landing-title">Tienda de Moda</h1>
        <p className="landing-text">
          Sistema de gestión de ventas para empleados. Simple, rápido y eficiente.
        </p>

        <div className="landing-buttons">
          <Link to="/login" className="btn btn-primary">
            <i className="bi bi-person-circle me-2"></i> Ingresar
          </Link>
          <a
            href="https://github.com/RodrigoJatib/PROG-III-CRUD-TP3.git" // opcional
            className="btn btn-outline-dark"
            target="_blank"
          >
            <i className="bi bi-github me-2"></i> Ver proyecto en GitHub
          </a>
        </div>
      </div>
      
    </div>
  );
}