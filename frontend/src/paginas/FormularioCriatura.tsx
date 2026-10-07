import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { crearCriatura, actualizarCriatura, obtenerCriaturaPorId } from "../api/criaturasApi";
import { CriaturaFormulario, TIPOS_CRIATURA, ESTADOS_INVESTIGACION } from "../tipos";

const FORM_VACIO: CriaturaFormulario = {
  nombre: "",
  tipo: "mitica",
  habilidades: [],
  nivelPeligro: 5,
  estado: "activa",
};

export function FormularioCriatura() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const esEdicion = Boolean(id);

  const [form, setForm] = useState<CriaturaFormulario>(FORM_VACIO);
  const [habilidadesTexto, setHabilidadesTexto] = useState("");
  const [cargando, setCargando] = useState(esEdicion);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    obtenerCriaturaPorId(id)
      .then((criatura) => {
        setForm({
          nombre: criatura.nombre,
          tipo: criatura.tipo,
          habilidades: criatura.habilidades,
          nivelPeligro: criatura.nivelPeligro,
          estado: criatura.estado,
        });
        setHabilidadesTexto(criatura.habilidades.join(", "));
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "No se pudo cargar la criatura."))
      .finally(() => setCargando(false));
  }, [id]);

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);

    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    const datosAEnviar: CriaturaFormulario = {
      ...form,
      habilidades: habilidadesTexto.split(",").map((h) => h.trim()).filter((h) => h.length > 0),
    };

    try {
      setGuardando(true);
      if (esEdicion && id) await actualizarCriatura(id, datosAEnviar);
      else await crearCriatura(datosAEnviar);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la criatura.");
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) return <main className="page"><div className="panel state-box">Cargando datos de la criatura...</div></main>;

  return (
    <main className="page form-layout">
      <Link className="back-link" to="/">← Volver al archivo</Link>
      <section className="hero">
        <div>
          <p className="eyebrow">{esEdicion ? "Actualizar expediente" : "Nuevo expediente"}</p>
          <h1>{esEdicion ? "Editar criatura" : "Registrar criatura"}</h1>
          <p className="lead">Completa la clasificación de la criatura y su estado actual dentro de la investigación.</p>
        </div>
      </section>

      {error && <div className="alert">{error}</div>}

      <form className="form-card" onSubmit={manejarEnvio}>
        <div className="form-grid">
          <div className="field field-full">
            <label htmlFor="nombre">Nombre</label>
            <input className="input" id="nombre" type="text" placeholder="Ej. Serpiente del lago" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          </div>

          <div className="field">
            <label htmlFor="tipo">Tipo</label>
            <select className="input" id="tipo" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value as CriaturaFormulario["tipo"] })}>
              {TIPOS_CRIATURA.map((tipo) => <option key={tipo} value={tipo}>{tipo}</option>)}
            </select>
          </div>

          <div className="field">
            <label htmlFor="estado">Estado</label>
            <select className="input" id="estado" value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value as CriaturaFormulario["estado"] })}>
              {ESTADOS_INVESTIGACION.map((estado) => <option key={estado} value={estado}>{estado}</option>)}
            </select>
          </div>

          <div className="field field-full">
            <label htmlFor="habilidades">Habilidades</label>
            <input className="input" id="habilidades" type="text" placeholder="Camuflaje, vuelo, visión nocturna..." value={habilidadesTexto} onChange={(e) => setHabilidadesTexto(e.target.value)} />
            <small>Separa cada habilidad con una coma.</small>
          </div>

          <div className="field field-full">
            <label htmlFor="nivelPeligro">Nivel de peligro: {form.nivelPeligro}/10</label>
            <input id="nivelPeligro" type="range" min={1} max={10} value={form.nivelPeligro} onChange={(e) => setForm({ ...form, nivelPeligro: Number(e.target.value) })} />
            <small>1 representa riesgo bajo y 10 riesgo crítico.</small>
          </div>
        </div>

        <div className="form-footer">
          <Link className="btn btn-secondary" to="/">Cancelar</Link>
          <button className="btn btn-primary" type="submit" disabled={guardando}>{guardando ? "Guardando..." : esEdicion ? "Guardar cambios" : "Crear criatura"}</button>
        </div>
      </form>
    </main>
  );
}
