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
            <nav className="nav nav-left" aria-label="Navegación principal">
              <Link className="nav-link" to="/">ARCHIVO</Link>
              <Link className="nav-link" to="/avistamientos">AVISTAMIENTOS</Link>
            </nav>

            <Link className="brand" to="/" aria-label="Pawnee Archive - Inicio">
              <span className="brand-title">PAWNEE</span>
              <span className="brand-subtitle">— CREATURE ARCHIVE —</span>
            </Link>

            <nav className="nav nav-right" aria-label="Acciones rápidas">
              <Link className="nav-link" to="/criaturas/nueva">NUEVA CRIATURA</Link>
              <span className="nav-dot" aria-hidden="true" />
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

        <footer className="site-footer">
          <div className="footer-inner">
            <div>
              <span className="footer-kicker">PAWNEE FIELD NOTES</span>
              <p>Un archivo pequeño para fenómenos bastante grandes.</p>
            </div>
            <div className="footer-stamp" aria-hidden="true">P</div>
            <div className="footer-links">
              <Link to="/">Criaturas</Link>
              <Link to="/avistamientos">Reportes</Link>
              <Link to="/criaturas/nueva">Registrar</Link>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
