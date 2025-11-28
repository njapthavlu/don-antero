// api/send-quote.js
// Vercel Serverless Function para enviar emails de cotización
// Usa Resend (npm install resend)

import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

// Configurable por env vars (recomendado)
const QUOTE_TO = process.env.QUOTE_TO || "ventas@donantero.com.ar";
const QUOTE_FROM = process.env.QUOTE_FROM || "Don Antero <noreply@donantero.com.ar>";

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// Mini helper: escape básico para evitar HTML injection en el email
function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function safeInt(n, fallback = 0) {
  const x = Number(n);
  return Number.isFinite(x) ? x : fallback;
}

export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método no permitido" });
  }

  // Asegura configuración
  if (!resend) {
    return res.status(500).json({
      error: "RESEND_API_KEY no configurada en Vercel",
    });
  }

  try {
    const { contacto, items } = req.body || {};

    // Validación básica
    if (!contacto || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const nombre = escapeHtml(contacto.nombre);
    const telefonoRaw = String(contacto.telefono ?? "");
    const telefono = escapeHtml(telefonoRaw);
    const emailRaw = String(contacto.email ?? "");
    const email = escapeHtml(emailRaw);
    const empresa = escapeHtml(contacto.empresa || "-");

    // Sanitizar items
    const cleanItems = items
      .map((it) => ({
        producto: escapeHtml(it?.producto),
        cantidad: Math.max(0, safeInt(it?.cantidad, 0)),
        nota: escapeHtml(it?.nota || "-"),
      }))
      .filter((it) => it.producto && it.cantidad > 0);

    if (cleanItems.length === 0) {
      return res.status(400).json({ error: "Items inválidos" });
    }

    // Construir tabla HTML de productos
    const productosHTML = cleanItems
      .map(
        (item, index) => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px; text-align: left;">${index + 1}</td>
          <td style="padding: 12px; text-align: left;"><strong>${item.producto}</strong></td>
          <td style="padding: 12px; text-align: center;">${item.cantidad}</td>
          <td style="padding: 12px; text-align: left;">${item.nota || "-"}</td>
        </tr>
      `
      )
      .join("");

    const totalProductos = cleanItems.length;
    const unidadesTotales = cleanItems.reduce((sum, item) => sum + item.cantidad, 0);
    const generatedAt = new Date().toLocaleString("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires",
    });

    // HTML del email
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nueva Cotización - Don Antero</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 20px;">
        <div style="max-width: 650px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">

          <!-- Header -->
          <div style="background: #0f172a; color: white; padding: 30px 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Nueva Solicitud de Cotización</h1>
            <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">Don Antero - Indumentaria Industrial</p>
          </div>

          <!-- Datos de Contacto -->
          <div style="padding: 32px 24px;">
            <h2 style="margin: 0 0 20px; font-size: 18px; font-weight: 700; color: #0f172a; border-bottom: 2px solid #0f172a; padding-bottom: 8px;">
              📋 Datos de Contacto
            </h2>
            <table style="width: 100%; margin-bottom: 24px;">
              <tr>
                <td style="padding: 8px 0; font-weight: 600; width: 120px;">Nombre:</td>
                <td style="padding: 8px 0;">${nombre}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600;">Teléfono:</td>
                <td style="padding: 8px 0;"><a href="tel:${escapeHtml(telefonoRaw)}" style="color: #0f172a; text-decoration: none;">${telefono}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600;">Email:</td>
                <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(emailRaw)}" style="color: #2563eb; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600;">Empresa:</td>
                <td style="padding: 8px 0;">${empresa}</td>
              </tr>
            </table>

            <!-- Pedido de Cotización -->
            <h2 style="margin: 32px 0 20px; font-size: 18px; font-weight: 700; color: #0f172a; border-bottom: 2px solid #0f172a; padding-bottom: 8px;">
              🛒 Productos Solicitados
            </h2>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
              <thead>
                <tr style="background: #f8fafc;">
                  <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">#</th>
                  <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Producto</th>
                  <th style="padding: 12px; text-align: center; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Cantidad</th>
                  <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Notas</th>
                </tr>
              </thead>
              <tbody>
                ${productosHTML}
              </tbody>
            </table>

            <!-- Resumen -->
            <div style="margin-top: 24px; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #0f172a;">
              <p style="margin: 0; font-size: 14px; color: #64748b;">
                <strong>Total de productos:</strong> ${totalProductos}
              </p>
              <p style="margin: 8px 0 0; font-size: 14px; color: #64748b;">
                <strong>Unidades totales:</strong> ${unidadesTotales}
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; font-size: 13px; color: #64748b;">
              Este email fue generado automáticamente desde <strong>donantero.com.ar</strong>
            </p>
            <p style="margin: 8px 0 0; font-size: 12px; color: #94a3b8;">
              ${generatedAt}
            </p>
          </div>

        </div>
      </body>
      </html>
    `;

    // Texto plano alternativo
    const textContent = `
NUEVA SOLICITUD DE COTIZACIÓN - Don Antero

═════════════════════════════════════
DATOS DE CONTACTO
═════════════════════════════════════

Nombre:    ${contacto.nombre}
Teléfono:  ${contacto.telefono}
Email:     ${contacto.email}
Empresa:   ${contacto.empresa}

═════════════════════════════════════
PRODUCTOS SOLICITADOS
═════════════════════════════════════

${cleanItems
  .map(
    (item, i) => `${i + 1}. ${item.producto}
   Cantidad: ${item.cantidad}
   Notas: ${item.nota || "-"}`
  )
  .join("\n\n")}

─────────────────────────────────────
Total productos: ${totalProductos}
Unidades totales: ${unidadesTotales}
─────────────────────────────────────

Generado: ${generatedAt}
`.trim();

    // Enviar email con Resend (chequeando error explícitamente)
    const { data, error } = await resend.emails.send({
      from: QUOTE_FROM,
      to: QUOTE_TO,
      replyTo: emailRaw || undefined,
      subject: `Nueva Cotización de ${contacto.nombre} - Don Antero`,
      html: htmlContent,
      text: textContent,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(502).json({
        error: "No se pudo enviar la cotización",
        details: error.message ?? String(error),
      });
    }

    return res.status(200).json({
      success: true,
      id: data?.id,
      message: "Cotización enviada exitosamente",
    });
  } catch (error) {
    console.error("Error al enviar cotización:", error);
    return res.status(500).json({
      error: "Error al enviar la cotización",
      details: error?.message || String(error),
    });
  }
}
