import React from "react";
import { motion } from "framer-motion";
import {
  Factory,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  Download,
} from "lucide-react";
import { PRODUCTS } from "../data/products";
import { useParams } from "react-router-dom";

const Section = ({ id, className = "", children }) => (
  <section id={id} className={`mx-auto w-full max-w-7xl px-4 md:px-6 ${className}`}>{children}</section>
);
const Card = ({ className = "", children }) => (
  <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>
);

function useQuoteForm(defaults = {}) {
  const [form, setForm] = React.useState({ nombre: "", telefono: "", email: "", mensaje: "", ...defaults });
  const [status, setStatus] = React.useState("idle");
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.telefono || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setStatus("error"); return; }
    setStatus("ok");
    const body = encodeURIComponent(
      `Nombre: ${form.nombre}\nTeléfono: ${form.telefono}\nEmail: ${form.email}\nProducto: ${form.producto || "-"}\nMensaje: ${form.mensaje || "-"}`
    );
    window.location.href = `mailto:ventas@donantero.com.ar?subject=Cotización%20${encodeURIComponent(form.producto || "Producto")}&body=${body}`;
  };
  return { form, status, onChange, submit };
}

export default function DonAnteroProductPage() {
  const { slug } = useParams();
  const product = PRODUCTS.find(p => p.slug === slug) || PRODUCTS[0];
  const [img, setImg] = React.useState(0);
  const { form, status, onChange, submit } = useQuoteForm({ producto: product?.name });

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

      {/* Migas */}
      <Section className="py-4">
        <a href="/catalogo" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"><ArrowLeft className="h-4 w-4"/> Volver al catálogo</a>
      </Section>

      {/* Contenido principal */}
      <Section className="pb-10 md:pb-16">
        <div className="grid items-start gap-10 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .6 }}>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
              <img src={(product.images && product.images[img]) || ""} alt={product.name} loading="lazy" className="mx-auto w-full max-w-md rounded-xl object-cover"/>
            </div>
            {product.images && product.images.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {product.images.map((src, i) => (
                  <button key={i} onClick={() => setImg(i)} className={`overflow-hidden rounded-lg border ${img===i?"border-slate-900":"border-slate-200"}`}>
                    <img src={src} alt={`thumb-${i}`} loading="lazy" className="aspect-square w-full object-cover"/>
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .6, delay: .05 }}>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">{product.name}</h1>
            {product.summary && <p className="mt-3 max-w-xl text-slate-600">{product.summary}</p>}

            <div className="mt-6">
              <div className="mb-3">
                <div className="text-xl font-semibold text-slate-900">Ficha Técnica<span className="text-slate-400">.</span></div>
                <div className="h-0.5 w-16 bg-rose-600"/>
              </div>
              <Card>
                <table className="w-full table-fixed text-sm text-slate-700">
                  <tbody>
                    {(product.specs || []).map((row, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <th className="w-40 whitespace-nowrap px-4 py-3 text-left font-semibold text-slate-600">{row.k}</th>
                        <td className="px-4 py-3">{row.v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <a href="#cotizar" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-white hover:opacity-95">Solicitar cotización</a>
                {product.pdf && (
                  <a href={product.pdf} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 hover:bg-slate-50"><Download className="h-4 w-4"/> Descargar ficha (PDF)</a>
                )}
              </div>

              {product.highlights && product.highlights.length > 0 && (
                <Card className="mt-6 p-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-900"><ClipboardList className="h-4 w-4"/><span className="font-semibold">Puntos destacados</span></div>
                  <ul className="grid list-disc gap-2 pl-5 text-sm text-slate-700">
                    {product.highlights.map((h, i) => <li key={i}>{h}</li>)}
                  </ul>
                </Card>
              )}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Franja de cotización */}
      <div id="cotizar" className="mt-2 w-full bg-slate-900 py-10 text-white">
        <Section>
          <h3 className="mb-6 text-center text-xl font-semibold">Solicitá tu cotización</h3>
          <form onSubmit={submit} className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
            <input name="nombre" value={form.nombre} onChange={onChange} placeholder="Ingresá tu nombre" className="h-11 rounded-lg border border-white/20 bg-white/5 px-3 outline-none placeholder:text-white/70 focus:bg-white/10"/>
            <input name="telefono" value={form.telefono} onChange={onChange} placeholder="Ingresá tu teléfono" className="h-11 rounded-lg border border-white/20 bg-white/5 px-3 outline-none placeholder:text-white/70 focus:bg-white/10"/>
            <input type="email" name="email" value={form.email} onChange={onChange} placeholder="Ingresá tu mail" className="h-11 rounded-lg border border-white/20 bg-white/5 px-3 outline-none placeholder:text-white/70 focus:bg-white/10"/>
            <button className="h-11 rounded-lg bg-white px-5 font-semibold text-slate-900 hover:opacity-95">Enviar</button>
          </form>
          {status === "error" && (<p className="mt-2 text-center text-sm text-rose-300">Revisá los campos obligatorios.</p>)}
          {status === "ok" && (<p className="mt-2 text-center text-sm text-emerald-300">¡Listo! Abrimos tu correo para completar el envío.</p>)}
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
