import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { crearAvistamiento } from "../api/avistamientosApi";
import { obtenerCriaturas } from "../api/criaturasApi";
import { AvistamientoFormulario, Criatura } from "../tipos";

const FORM_VACIO: AvistamientoFormulario = { criatura: "", testigo: "", ubicacion: "", descripcion: "", fecha: "" };

export function FormularioAvistamiento() {
  const [parametros] = useSearchParams();
  const navigate = useNavigate();
  const [criaturas, setCriaturas] = useState<Criatura[]>([]);
  const [form, setForm] = useState<AvistamientoFormulario>({ ...FORM_VACIO, criatura: parametros.get("criaturaId") ?? "" });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    obtenerCriaturas()
      .then((lista) => {
        setCriaturas(lista);
        if (!form.criatura && lista.length > 0) setForm((actual) => ({ ...actual, criatura: lista[0]._id }));
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "No se pudieron cargar las criaturas."))
      .finally(() => setCargando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);
    if (!form.criatura || !form.testigo.trim() || !form.ubicacion.trim() || !form.fecha) {
      setError("Criatura, testigo, ubicación y fecha son obligatorios.");
      return;
    }
    try { setGuardando(true); await crearAvistamiento(form); navigate("/avistamientos"); }
    catch (err) { setError(err instanceof Error ? err.message : "No se pudo registrar el avistamiento."); }
    finally { setGuardando(false); }
  }

  if (cargando) return <main className="page"><div className="panel state-box">Cargando formulario...</div></main>;

  return (
    <main className="page form-layout">
      <Link className="back-link" to="/avistamientos">← Volver a avistamientos</Link>
      <section className="hero"><div><p className="eyebrow">Nuevo reporte</p><h1>Registrar avistamiento</h1><p className="lead">Añade la información principal del encuentro al archivo de campo.</p></div></section>
      {error && <div className="alert">{error}</div>}
      <form className="form-card" onSubmit={manejarEnvio}>
        <div className="form-grid">
          <div className="field field-full"><label htmlFor="criatura">Criatura</label><select className="input" id="criatura" value={form.criatura} onChange={(e) => setForm({ ...form, criatura: e.target.value })}>{criaturas.map((c) => <option key={c._id} value={c._id}>{c.nombre}</option>)}</select></div>
          <div className="field"><label htmlFor="testigo">Testigo</label><input className="input" id="testigo" type="text" placeholder="Nombre del testigo" value={form.testigo} onChange={(e) => setForm({ ...form, testigo: e.target.value })} /></div>
          <div className="field"><label htmlFor="fecha">Fecha</label><input className="input" id="fecha" type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} /></div>
          <div className="field field-full"><label htmlFor="ubicacion">Ubicación</label><input className="input" id="ubicacion" type="text" placeholder="Ej. Bosque de Pawnee" value={form.ubicacion} onChange={(e) => setForm({ ...form, ubicacion: e.target.value })} /></div>
          <div className="field field-full"><label htmlFor="descripcion">Descripción <small>(opcional)</small></label><textarea className="textarea" id="descripcion" rows={4} placeholder="Detalles relevantes del avistamiento..." value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} /></div>
        </div>
        <div className="form-footer"><Link className="btn btn-secondary" to="/avistamientos">Cancelar</Link><button className="btn btn-primary" type="submit" disabled={guardando}>{guardando ? "Guardando..." : "Registrar avistamiento"}</button></div>
      </form>
    </main>
  );
}
