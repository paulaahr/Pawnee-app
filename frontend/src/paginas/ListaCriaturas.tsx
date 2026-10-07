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
    <main>
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">PAWNEE CREATURE DEPARTMENT</p>
          <h1>Rare finds.Good field notes.</h1>
          <span className="squiggle" aria-hidden="true">〰〰</span>
          <p className="lead">Archivo oficial de criaturas registradas, su nivel de peligro y estado actual de investigación.</p>
          <div className="actions hero-actions">
            <Link className="btn btn-primary" to="/criaturas/nueva">REGISTRAR CRIATURA <span>→</span></Link>
            <Link className="text-arrow" to="/avistamientos">VER AVISTAMIENTOS ↗</Link>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="hero-arch" />
          <div className="specimen-card specimen-back"><span>FIELD</span><strong>07</strong></div>
          <div className="specimen-card specimen-front">
            <div className="specimen-eye">✦</div>
            <span>Criaturas</span>
            <strong>UNKNOWN<br />SPECIMEN</strong>
            <small>HANDLE WITH CURIOSITY</small>
          </div>
          <div className="round-sticker">MADE IN<br /><b>PAWNEE</b><br />✦</div>
        </div>
      </section>

      <section className="feature-strip" aria-label="Características del archivo">
        <div><span className="feature-icon">◎</span><p><b>FIELD</b><br />VERIFIED</p></div>
        <div><span className="feature-icon">♡</span><p><b>CURIOUS</b><br />BY NATURE</p></div>
        <div><span className="feature-icon">⌖</span><p><b>LOCAL</b><br />SIGHTINGS</p></div>
        <div><span className="feature-icon">☺</span><p><b>SMALL</b><br />ARCHIVE TEAM</p></div>
      </section>

      <section className="page collection-section">
        <div className="collection-intro">
          <p className="eyebrow">OUR COLLECTION</p>
          <span className="mini-squiggle">〰</span>
          <p>Clasifica, consulta y mantén al día cada expediente sin perderte entre reportes.</p>
          <Link className="underlined-link" to="/criaturas/nueva">NUEVO EXPEDIENTE</Link>
        </div>

        <div className="collection-content">
          <section className="toolbar playful-toolbar">
            <div className="filter-group">
              <span className="filter-label">FILTRAR POR TIPO</span>
              <select className="select" id="filtro-tipo" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value as TipoCriatura | "")}>
                <option value="">Todos los tipos</option>
                {TIPOS_CRIATURA.map((tipo) => <option key={tipo} value={tipo}>{tipo}</option>)}
              </select>
            </div>
            <span className="record-count">{criaturas.length.toString().padStart(2, "0")} REGISTRO{criaturas.length === 1 ? "" : "S"}</span>
          </section>

          <section className="panel archive-panel">
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
                        <td><span className="badge badge-lilac">{criatura.tipo}</span></td>
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
        </div>
      </section>

      <section className="ritual-banner">
        <div className="ritual-copy">
          <p className="eyebrow light">FIELDWORK MADE SIMPLE</p>
          <h2>Every sighting<br />deserves a note.</h2>
          <p>Guarda encuentros, lugares y testigos para que cada criatura tenga una historia documentada.</p>
          <Link className="underlined-link light-link" to="/avistamientos/nuevo">REGISTRAR AVISTAMIENTO</Link>
        </div>
        <div className="ritual-scene" aria-hidden="true">
          <span className="leaf leaf-one">◖</span><span className="leaf leaf-two">◗</span>
          <div className="field-journal"><span>PAWNEE</span><strong>FIELD<br />NOTES</strong><small>EST. 2026</small></div>
          <div className="magnifier">⌕</div>
        </div>
        <div className="ritual-social" aria-hidden="true">
          <div className="smile-stamp">☺</div>
          <p>GOOD NOTES<br />GOOD FINDS<br />GOOD NOTES</p>
          <small>@PAWNEE.ARCHIVE</small>
        </div>
      </section>
    </main>
  );
}
