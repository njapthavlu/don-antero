import React from "react";
import { motion } from "framer-motion";
import {
  Factory,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  ClipboardCheck,
} from "lucide-react";
import QuoteFormMulti from "./QuoteFormMulti";

const Section = ({ id, className = "", children }) => (
  <section id={id} className={`mx-auto w-full max-w-7xl px-4 md:px-6 ${className}`}>
    {children}
  </section>
);

export default function CotizacionPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top info bar */}
      <div className="w-full bg-slate-900 text-slate-100">
        <Section className="flex items-center justify-between py-2 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5"/> Calle 139 1101, Luján</span>
            <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5"/> 2323 549464 / 2323 446516</span>
          </div>
          <a href="mailto:ventas@donantero.com.ar" className="inline-flex items-center gap-1 hover:underline"><Mail className="h-3.5 w-3.5"/> ventas@donantero.com.ar</a>
        </Section>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <Section className="flex h-16 items-center gap-6">
          <a href="/" className="group inline-flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 text-white"><Factory className="h-5 w-5"/></div>
            <div className="text-lg font-semibold tracking-tight">Don Antero</div>
          </a>
          <nav className="ml-auto hidden gap-6 md:flex">
            <a href="/" className="hover:text-slate-900">Inicio</a>
            <a href="/catalogo" className="hover:text-slate-900">Catálogo</a>
            <a href="/cotizacion" className="text-slate-900 font-semibold">Pedí tu cotización</a>
          </nav>
          <a href="/cotizacion" className="ml-auto inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-white hover:opacity-95 md:ml-2">
            Solicitar cotización <ArrowRight className="h-4 w-4"/>
          </a>
        </Section>
      </header>

      {/* Hero Section */}
      <Section className="py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-slate-900/5 text-slate-900">
            <ClipboardCheck className="h-5 w-5" />
            <span className="text-sm font-semibold">Cotización Multi-Producto</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
            Solicitá tu Cotización
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Completá el formulario con los productos que necesitás y te contactaremos con la mejor oferta.
          </p>
        </motion.div>

        {/* Formulario Multi-Producto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <QuoteFormMulti />
        </motion.div>

        {/* Información adicional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          <div className="text-center p-6 rounded-xl bg-white border border-slate-200">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-slate-900/5 flex items-center justify-center">
              <ClipboardCheck className="h-6 w-6 text-slate-900" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Respuesta Rápida</h3>
            <p className="text-sm text-slate-600">
              Te contactamos en menos de 24 horas hábiles
            </p>
          </div>

          <div className="text-center p-6 rounded-xl bg-white border border-slate-200">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-slate-900/5 flex items-center justify-center">
              <Factory className="h-6 w-6 text-slate-900" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Producción Propia</h3>
            <p className="text-sm text-slate-600">
              Calidad certificada y entregas sin demoras
            </p>
          </div>

          <div className="text-center p-6 rounded-xl bg-white border border-slate-200">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-slate-900/5 flex items-center justify-center">
              <Phone className="h-6 w-6 text-slate-900" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Asesoramiento</h3>
            <p className="text-sm text-slate-600">
              Te ayudamos a elegir los mejores productos
            </p>
          </div>
        </motion.div>
      </Section>

      {/* Footer */}
      <footer className="bg-slate-100 py-10 text-slate-700 mt-16">
        <Section className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-slate-900"><Factory className="h-5 w-5"/><span className="text-lg font-semibold">Don Antero</span></div>
            <p className="text-sm">Fábrica</p>
            <p className="text-sm">Calle 139 1101, Luján</p>
            <p className="text-sm">Teléfonos 2323 549464 / 2323 446516</p>
            <a href="mailto:ventas@donantero.com.ar" className="text-sm underline">ventas@donantero.com.ar</a>
          </div>
          <div>
            <div className="mb-3 font-semibold text-slate-900">Secciones</div>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:underline">Inicio</a></li>
              <li><a href="/catalogo" className="hover:underline">Catálogo</a></li>
              <li><a href="/cotizacion" className="hover:underline">Pedí tu cotización</a></li>
            </ul>
          </div>
          <div>
            <div className="mb-3 font-semibold text-slate-900">Calidad y compromiso</div>
            <p className="text-sm">Producción propia, plazos ágiles y controles de calidad. Envíos a todo el país.</p>
          </div>
        </Section>
        <Section className="mt-8 border-t border-slate-200 pt-6 text-xs text-slate-500">© {new Date().getFullYear()} Don Antero. Todos los derechos reservados.</Section>
      </footer>
    </div>
  );
}
