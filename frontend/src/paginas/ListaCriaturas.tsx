import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerCriaturas } from "../api/criaturasApi";
import { Criatura, TipoCriatura, TIPOS_CRIATURA } from "../tipos";

function claseEstado(estado: string) {
  const valor = estado.toLowerCase();
  if (valor.includes("activa")) return "badge badge-green";
  if (valor.includes("archiv") || valor.includes("cerr")) return "badge";
  return "badge badge-orange";
}

export function ListaCriaturas() {
  const [criaturas, setCriaturas] = useState<Criatura[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<TipoCriatura | "">("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCargando(true);
    setError(null);

    obtenerCriaturas(filtroTipo || undefined)
      .then(setCriaturas)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Error al cargar las criaturas."))
      .finally(() => setCargando(false));
  }, [filtroTipo]);

  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">Departamento de investigación</p>
          <h1>Criaturas de Pawnee</h1>
          <p className="lead">Archivo oficial de criaturas registradas, su nivel de peligro y estado actual de investigación.</p>
        </div>
        <div className="actions">
          <Link className="btn btn-secondary" to="/avistamientos">Ver avistamientos</Link>
          <Link className="btn btn-primary" to="/criaturas/nueva">+ Registrar criatura</Link>
        </div>
      </section>

      <section className="toolbar">
        <div className="filter-group">
          <span className="filter-label">Filtrar archivo</span>
          <select className="select" id="filtro-tipo" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value as TipoCriatura | "")}>
            <option value="">Todos los tipos</option>
            {TIPOS_CRIATURA.map((tipo) => <option key={tipo} value={tipo}>{tipo}</option>)}
          </select>
        </div>
        <span className="badge">{criaturas.length} registro{criaturas.length === 1 ? "" : "s"}</span>
      </section>

      <section className="panel">
        {cargando && <div className="state-box">Cargando criaturas...</div>}
        {!cargando && error && <div className="state-box">Ocurrió un error: {error}</div>}
        {!cargando && !error && criaturas.length === 0 && <div className="state-box">Todavía no hay criaturas registradas.</div>}

        {!cargando && !error && criaturas.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Nombre</th><th>Tipo</th><th>Peligro</th><th>Estado</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {criaturas.map((criatura) => (
                  <tr key={criatura._id}>
                    <td><Link className="name-link" to={`/criaturas/${criatura._id}`}>{criatura.nombre}</Link></td>
                    <td><span className="badge">{criatura.tipo}</span></td>
                    <td>
                      <div className="danger-meter">
                        <strong>{criatura.nivelPeligro}/10</strong>
                        <span className="meter"><span style={{ width: `${criatura.nivelPeligro * 10}%` }} /></span>
                      </div>
                    </td>
                    <td><span className={claseEstado(criatura.estado)}>{criatura.estado}</span></td>
                    <td>
                      <div className="row-actions">
                        <Link className="text-link" to={`/criaturas/${criatura._id}`}>Ver</Link>
                        <Link className="text-link" to={`/criaturas/${criatura._id}/editar`}>Editar</Link>
                      </div>
                    </td>
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
