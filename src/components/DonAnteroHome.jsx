import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  ClipboardList,
  Factory,
  HardHat,
  Shirt,
  Boxes,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";

// Datos simplificados para homepage (solo categorías destacadas)
const CATEGORIES_FEATURED = [
  {
    slug: "indumentaria-trabajo",
    title: "Indumentaria de trabajo",
    desc: "Uniformes y ropa técnica para cada rubro.",
    cover:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='%23143f6b' offset='0'/><stop stop-color='%233a86ff' offset='1'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g)'/></svg>",
    icon: <Shirt className="h-5 w-5" />,
    items: [
      { name: "Camisas / Chombas", spec: "Algodón / Dry-fit / Reflectivo" },
      { name: "Pantalones / Jardineros", spec: "Trabajo pesado / multi-bolsillos" },
      { name: "Buzos / Camperas", spec: "Abrigo laboral, térmico" },
    ],
  },
  {
    slug: "elementos-seguridad",
    title: "Elementos de seguridad",
    desc: "Protección certificada para industria y logística.",
    cover:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='%230e2a47' offset='0'/><stop stop-color='%23257cff' offset='1'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g)'/></svg>",
    icon: <HardHat className="h-5 w-5" />,
    items: [
      { name: "Guantes", spec: "Nitrilo / Piel / Anticorte" },
      { name: "Protección ocular", spec: "Lentes, antiparras" },
      { name: "Chalecos / Reflectivos", spec: "Alta visibilidad" },
    ],
  },
];

const Section = ({ id, className = "", children }) => (
  <section id={id} className={`mx-auto w-full max-w-7xl px-4 md:px-6 ${className}`}>
    {children}
  </section>
);

const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>
);

function useQuoteForm() {
  const [form, setForm] = React.useState({ nombre: "", telefono: "", email: "", mensaje: "" });
  const [status, setStatus] = React.useState("idle");

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }
  function submit(e) {
    e.preventDefault();
    if (!form.nombre || !form.telefono || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setStatus("error");
      return;
    }
    setStatus("ok");
    const body = encodeURIComponent(
      `Nombre: ${form.nombre}\nTeléfono: ${form.telefono}\nEmail: ${form.email}\nMensaje: ${form.mensaje || "-"}`
    );
    window.location.href = `mailto:ventas@donantero.com.ar?subject=Cotización%20web&body=${body}`;
  }
  return { form, status, onChange, submit };
}

export default function DonAnteroHome() {
  const { form, status, onChange, submit } = useQuoteForm();

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

      {/* Nav */}
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
              <NavLink
     to="/cotizacion"
    className={({ isActive }) => (isActive ? "text-slate-900 font-semibold" : "hover:text-slate-900")}
   >
    Cotización
 </NavLink>
          </nav>
          <a href="#cotizar" className="ml-auto inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-white hover:opacity-95 md:ml-2">
            Solicitar cotización <ArrowRight className="h-4 w-4"/>
          </a>
        </Section>
      </header>

      {/* Hero */}
      <Section id="inicio" className="relative grid items-center gap-8 py-10 md:grid-cols-2 md:py-16">
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .6 }}>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900 md:text-6xl">
            Somos <span className="text-slate-600">Fabricantes</span>.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-600">
            Indumentaria y seguridad industrial adaptada a cada rubro. Producción propia, calidad certificada y entregas sin demoras.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4"/> Certificaciones (ANMAT / INTI)</span>
            <span className="inline-flex items-center gap-2"><Boxes className="h-4 w-4"/> Capacidad operativa semanal</span>
          </div>
        </motion.div>

        {/* Form card superpuesta */}
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .6, delay: .1 }}>
          <Card className="p-5 md:p-6">
            <h3 className="mb-4 text-lg font-semibold">Solicitá tu cotización</h3>
            <form onSubmit={submit} className="grid gap-3">
              <label className="grid gap-1">
                <span className="text-sm font-medium">Nombre *</span>
                <input name="nombre" value={form.nombre} onChange={onChange} placeholder="Nombre y apellido" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-0 focus:border-slate-400"/>
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium">Teléfono *</span>
                <input name="telefono" value={form.telefono} onChange={onChange} placeholder="Nro. celular" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-0 focus:border-slate-400"/>
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium">Mail *</span>
                <input type="email" name="email" value={form.email} onChange={onChange} placeholder="ej: ventas@donantero.com.ar" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-0 focus:border-slate-400"/>
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium">Mensaje (opcional)</span>
                <textarea name="mensaje" value={form.mensaje} onChange={onChange} rows={3} placeholder="Contanos qué necesitás" className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 outline-none ring-0 focus:border-slate-400"/>
              </label>
              <button className="mt-1 inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 font-semibold text-white hover:opacity-95">
                Enviar solicitud
              </button>
              {status === "error" && (
                <p className="text-sm text-red-600">Revisá los campos obligatorios y el formato del mail.</p>
              )}
              {status === "ok" && (
                <p className="text-sm text-emerald-600">¡Gracias! Abrimos tu correo para completar el envío.</p>
              )}
            </form>
          </Card>
        </motion.div>
      </Section>

      {/* Banners de categorías */}
      <Section id="catalogo" className="py-8 md:py-12">
        <div className="grid gap-6 md:grid-cols-2">
          {CATEGORIES_FEATURED.map((cat) => (
            <a key={cat.slug} href="/catalogo" className="group relative overflow-hidden rounded-3xl">
              <img src={cat.cover} alt={cat.title} loading="lazy" className="aspect-[16/9] w-full object-cover"/>
              <div className="absolute inset-0 bg-slate-900/10 transition group-hover:bg-slate-900/20"/>
              <div className="absolute left-4 top-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-900">
                  {cat.icon} Catálogo
                </span>
              </div>
              <div className="absolute bottom-5 left-5">
                <div className="rounded-xl bg-slate-900/90 px-4 py-3 text-white shadow-lg">
                  <div className="text-lg font-semibold">{cat.title}</div>
                  <div className="text-sm text-slate-200/90">→ Ver catálogo</div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Listitas rápidas */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {CATEGORIES_FEATURED.map((cat) => (
            <Card key={cat.slug} className="p-5">
              <div className="mb-2 flex items-center gap-2 text-slate-900">
                {cat.icon}
                <h3 className="text-base font-semibold">{cat.title}</h3>
              </div>
              <p className="mb-4 text-sm text-slate-600">{cat.desc}</p>
              <ul className="grid gap-2 text-sm text-slate-700">
                {cat.items.map((it, i) => (
                  <li key={i} className="flex items-center gap-2"><ClipboardList className="h-4 w-4 text-slate-400"/> {it.name} <span className="text-slate-400">· {it.spec}</span></li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      {/* Franja de cotización */}
      <div id="cotizar" className="mt-4 w-full bg-slate-900 py-10 text-white">
        <Section>
          <h3 className="mb-6 text-center text-xl font-semibold">Solicitá tu cotización</h3>
          <form onSubmit={submit} className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
            <input name="nombre" value={form.nombre} onChange={onChange} placeholder="Ingresá tu nombre" className="h-11 rounded-lg border border-white/20 bg-white/5 px-3 outline-none placeholder:text-white/70 focus:bg-white/10"/>
            <input name="telefono" value={form.telefono} onChange={onChange} placeholder="Ingresá tu teléfono" className="h-11 rounded-lg border border-white/20 bg-white/5 px-3 outline-none placeholder:text-white/70 focus:bg-white/10"/>
            <input type="email" name="email" value={form.email} onChange={onChange} placeholder="Ingresá tu mail" className="h-11 rounded-lg border border-white/20 bg-white/5 px-3 outline-none placeholder:text-white/70 focus:bg-white/10"/>
            <button className="h-11 rounded-lg bg-white px-5 font-semibold text-slate-900 hover:opacity-95">Enviar</button>
          </form>
          {status === "error" && (
            <p className="mt-2 text-center text-sm text-rose-300">Revisá los campos obligatorios.</p>
          )}
          {status === "ok" && (
            <p className="mt-2 text-center text-sm text-emerald-300">¡Listo! Abrimos tu correo para completar el envío.</p>
          )}
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
