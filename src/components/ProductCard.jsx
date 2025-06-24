export default function ProductCard({ producto}) {
    return (
        <div className="card m-2" style={{ width: "18rem" }}>
        
            <div className="card-body">
                <h5 className="card-title">{producto.nombre}</h5>
                <p className="card-text">${producto.precio}</p>
                <p className="card-text text-muted">{producto.descripcion}</p>
            </div>
        
        </div>
    );
}
