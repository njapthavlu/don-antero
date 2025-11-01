import React from "react";
import { motion } from "framer-motion";
import {
  Factory,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Search,
  Filter,
} from "lucide-react";
import { PRODUCTS, CATEGORIES } from "../data/products";

const Section = ({ id, className = "", children }) => (
  <section id={id} className={`mx-auto w-full max-w-7xl px-4 md:px-6 ${className}`}>{children}</section>
);

export default function DonAnteroCatalogGrid() {
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState(CATEGORIES[0] || "Todos");

  const filtered = PRODUCTS.filter((p) => {
    const byCat = cat === "Todos" || p.category === cat;
    const byQ = q
      ? [p.name, p.category, ...(p.tags || [])].some((t) => (t || "").toLowerCase().includes(q.toLowerCase()))
      : true;
    return byCat && byQ;
  });

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
            <a href="#cotizar" className="hover:text-slate-900">Pedí tu cotización</a>
          </nav>
          <a href="#cotizar" className="ml-auto inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-white hover:opacity-95 md:ml-2">
            Solicitar cotización <ArrowRight className="h-4 w-4"/>
          </a>
        </Section>
      </header>

      {/* Encabezado catálogo */}
      <Section className="py-8 md:py-12">
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Catálogo</h1>

          {/* Buscador */}
          <div className="flex w-full max-w-md items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 md:w-auto">
            <Search className="h-4 w-4 text-slate-500"/>
            <input
              placeholder="Buscar por nombre, categoría o etiqueta…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        {/* Filtros por categoría */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-slate-600"><Filter className="h-4 w-4"/> Categorías</span>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-lg px-3 py-1.5 ${cat===c?"bg-slate-900 text-white":"border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid de productos */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p, i) => (
            <motion.article
              key={p.slug}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: (i % 6) * 0.03 }}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white ring-0 hover:shadow-md"
            >
              <a href={`/producto/${p.slug}`} className="block">
                <div className="overflow-hidden">
                  <img src={(p.images && p.images[0]) || ""} alt={p.name} className="aspect-[3/4] w-full object-cover transition duration-300 group-hover:scale-[1.03]"/>
                </div>
                <div className="p-4">
                  <div className="text-xs text-slate-500">{p.category}</div>
                  <h3 className="mt-1 text-base font-semibold text-slate-900">{p.name}</h3>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {(p.tags||[]).slice(0,3).map((t) => (
                      <span key={t} className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600">{t}</span>
                    ))}
                  </div>
                  <div className="mt-3 text-sm font-medium text-slate-700">→ Ver detalles</div>
                </div>
              </a>
            </motion.article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-600">No encontramos productos para tu búsqueda.</div>
        )}
      </Section>

      {/* Franja de cotización */}
      <div id="cotizar" className="mt-2 w-full bg-slate-900 py-10 text-white">
        <Section>
          <h3 className="mb-4 text-center text-xl font-semibold">¿No encontrás lo que buscás? Pedí tu cotización</h3>
          <form onSubmit={(e)=>{e.preventDefault(); window.location.href='mailto:ventas@donantero.com.ar?subject=Cotizaci%C3%B3n%20cat%C3%A1logo'}} className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
            <input placeholder="Ingresá tu nombre" className="h-11 rounded-lg border border-white/20 bg-white/5 px-3 outline-none placeholder:text-white/70 focus:bg-white/10"/>
            <input placeholder="Ingresá tu teléfono" className="h-11 rounded-lg border border-white/20 bg-white/5 px-3 outline-none placeholder:text-white/70 focus:bg-white/10"/>
            <input type="email" placeholder="Ingresá tu mail" className="h-11 rounded-lg border border-white/20 bg-white/5 px-3 outline-none placeholder:text-white/70 focus:bg-white/10"/>
            <button className="h-11 rounded-lg bg-white px-5 font-semibold text-slate-900 hover:opacity-95">Enviar</button>
          </form>
        </Section>
      </div>

      {/* Footer */}
      <footer className="bg-slate-100 py-10 text-slate-700">
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
              <li><a href="#cotizar" className="hover:underline">Pedí tu cotización</a></li>
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
