import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { eliminarCriatura, obtenerCriaturaPorId } from "../api/criaturasApi";
import { obtenerAvistamientosDeCriatura } from "../api/avistamientosApi";
import { Criatura } from "../tipos";

interface AvistamientoSinPopular {
  _id: string;
  testigo: string;
  ubicacion: string;
  descripcion?: string;
  fecha: string;
}

export function DetalleCriatura() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [criatura, setCriatura] = useState<Criatura | null>(null);
  const [avistamientos, setAvistamientos] = useState<AvistamientoSinPopular[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([obtenerCriaturaPorId(id), obtenerAvistamientosDeCriatura(id)])
      .then(([criaturaCargada, avistamientosCargados]) => {
        setCriatura(criaturaCargada);
        setAvistamientos(avistamientosCargados as unknown as AvistamientoSinPopular[]);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Error al cargar la criatura."))
      .finally(() => setCargando(false));
  }, [id]);

  async function manejarEliminar() {
    if (!id || !window.confirm("¿Seguro que quieres eliminar esta criatura?")) return;
    try { await eliminarCriatura(id); navigate("/"); }
    catch (err) { setError(err instanceof Error ? err.message : "No se pudo eliminar la criatura."); }
  }

  if (cargando) return <main className="page"><div className="panel state-box">Cargando expediente...</div></main>;
  if (error) return <main className="page"><div className="alert">Error: {error}</div></main>;
  if (!criatura) return <main className="page"><div className="panel state-box">No se encontró la criatura.</div></main>;

  return (
    <main className="page">
      <Link className="back-link" to="/">← Volver al archivo</Link>
      <section className="hero">
        <div>
          <p className="eyebrow">Expediente de criatura</p>
          <h1>{criatura.nombre}</h1>
          <p className="lead">Registro individual con clasificación, estado de investigación y evidencia de campo asociada.</p>
        </div>
        <div className="actions">
          <Link className="btn btn-secondary" to={`/criaturas/${criatura._id}/editar`}>Editar</Link>
          <button className="btn btn-danger" type="button" onClick={manejarEliminar}>Eliminar</button>
        </div>
      </section>

      <div className="detail-grid">
        <section className="detail-card">
          <h2>Ficha de archivo</h2>
          <div className="detail-list">
            <div className="detail-row"><span className="detail-term">Tipo</span><span className="detail-value"><span className="badge">{criatura.tipo}</span></span></div>
            <div className="detail-row"><span className="detail-term">Nivel de peligro</span><span className="detail-value">{criatura.nivelPeligro}/10</span></div>
            <div className="detail-row"><span className="detail-term">Estado</span><span className="detail-value"><span className="badge badge-green">{criatura.estado}</span></span></div>
            <div className="detail-row"><span className="detail-term">Habilidades</span><span className="detail-value">{criatura.habilidades.join(", ") || "Ninguna registrada"}</span></div>
          </div>
        </section>

        <section className="detail-card">
          <div className="actions" style={{ justifyContent: "space-between", marginBottom: 18 }}>
            <h2 style={{ margin: 0 }}>Avistamientos</h2>
            <Link className="btn btn-primary" to={`/avistamientos/nuevo?criaturaId=${criatura._id}`}>+ Registrar</Link>
          </div>
          {avistamientos.length === 0 ? (
            <p className="lead">Todavía no hay avistamientos registrados para esta criatura.</p>
          ) : (
            <div className="sighting-list">
              {avistamientos.map((a) => (
                <article className="sighting" key={a._id}>
                  <div className="sighting-top"><span>{a.testigo}</span><span className="badge">{a.fecha.slice(0, 10)}</span></div>
                  <p><strong>{a.ubicacion}</strong>{a.descripcion ? ` · ${a.descripcion}` : ""}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
