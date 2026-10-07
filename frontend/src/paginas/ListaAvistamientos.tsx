import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { eliminarAvistamiento, obtenerAvistamientos } from "../api/avistamientosApi";
import { Avistamiento } from "../tipos";

export function ListaAvistamientos() {
  const [avistamientos, setAvistamientos] = useState<Avistamiento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function cargar() {
    setCargando(true);
    setError(null);
    obtenerAvistamientos()
      .then(setAvistamientos)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Error al cargar los avistamientos."))
      .finally(() => setCargando(false));
  }

  useEffect(() => { cargar(); }, []);

  async function manejarEliminar(id: string) {
    if (!window.confirm("¿Eliminar este avistamiento?")) return;
    try { await eliminarAvistamiento(id); cargar(); }
    catch (err) { setError(err instanceof Error ? err.message : "No se pudo eliminar el avistamiento."); }
  }

  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">Registro de campo</p>
          <h1>Avistamientos</h1>
          <p className="lead">Reportes documentados por testigos sobre encuentros y ubicaciones de criaturas.</p>
        </div>
        <div className="actions">
          <Link className="btn btn-secondary" to="/">Volver a criaturas</Link>
          <Link className="btn btn-primary" to="/avistamientos/nuevo">+ Nuevo avistamiento</Link>
        </div>
      </section>

      <section className="panel">
        {cargando && <div className="state-box">Cargando avistamientos...</div>}
        {!cargando && error && <div className="state-box">Error: {error}</div>}
        {!cargando && !error && avistamientos.length === 0 && <div className="state-box">Todavía no hay avistamientos registrados.</div>}

        {!cargando && !error && avistamientos.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Fecha</th><th>Criatura</th><th>Testigo</th><th>Ubicación</th><th>Acciones</th></tr></thead>
              <tbody>
                {avistamientos.map((a) => (
                  <tr key={a._id}>
                    <td>{a.fecha.slice(0, 10)}</td>
                    <td><Link className="name-link" to={`/criaturas/${a.criatura._id}`}>{a.criatura.nombre}</Link></td>
                    <td>{a.testigo}</td>
                    <td>{a.ubicacion}</td>
                    <td><button className="btn btn-danger" type="button" onClick={() => manejarEliminar(a._id)}>Eliminar</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
