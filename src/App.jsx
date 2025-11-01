import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DonAnteroHome from './components/DonAnteroHome';
import DonAnteroCatalogGrid from './components/DonAnteroCatalogGrid';
import DonAnteroProductPage from './components/DonAnteroProductPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DonAnteroHome />} />
        <Route path="/catalogo" element={<DonAnteroCatalogGrid />} />
        <Route path="/producto/:slug" element={<DonAnteroProductPage />} />
      </Routes>
    </Router>
  );
}
