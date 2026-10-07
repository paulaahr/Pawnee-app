import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { ListaCriaturas } from "./paginas/ListaCriaturas";
import { DetalleCriatura } from "./paginas/DetalleCriatura";
import { FormularioCriatura } from "./paginas/FormularioCriatura";
import { ListaAvistamientos } from "./paginas/ListaAvistamientos";
import { FormularioAvistamiento } from "./paginas/FormularioAvistamiento";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="topbar">
          <div className="topbar-inner">
            <Link className="brand" to="/">
              <span className="brand-mark">P</span>
              <span>Pawnee Archive</span>
            </Link>
            <nav className="nav" aria-label="Navegación principal">
              <Link className="nav-link" to="/">Criaturas</Link>
              <Link className="nav-link" to="/avistamientos">Avistamientos</Link>
              <Link className="nav-link" to="/criaturas/nueva">+ Nueva criatura</Link>
            </nav>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<ListaCriaturas />} />
          <Route path="/criaturas/nueva" element={<FormularioCriatura />} />
          <Route path="/criaturas/:id" element={<DetalleCriatura />} />
          <Route path="/criaturas/:id/editar" element={<FormularioCriatura />} />
          <Route path="/avistamientos" element={<ListaAvistamientos />} />
          <Route path="/avistamientos/nuevo" element={<FormularioAvistamiento />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
