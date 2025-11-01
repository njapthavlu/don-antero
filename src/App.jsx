import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DonAnteroHome from './components/DonAnteroHome';
import DonAnteroCatalogGrid from './components/DonAnteroCatalogGrid';
import DonAnteroProductPage from './components/DonAnteroProductPage';
import CotizacionPage from './components/CotizacionPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DonAnteroHome />} />
        <Route path="/catalogo" element={<DonAnteroCatalogGrid />} />
        <Route path="/producto/:slug" element={<DonAnteroProductPage />} />
        <Route path="/cotizacion" element={<CotizacionPage />} />

      </Routes>
    </Router>
  );
}
