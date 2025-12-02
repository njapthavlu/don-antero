// api/send-quote.js
// Vercel Serverless Function para enviar emails de cotización (Resend)
// + (opcional) guardar la cotización en Google Sheets vía Apps Script Webhook

import { Resend } from "resend";
import crypto from "crypto";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

// Configurable por env vars
const QUOTE_TO = process.env.QUOTE_TO || "ventas@donantero.com.ar";

// OJO: por defecto .com (porque verificaste donantero.com). Si querés otro, ponelo en Vercel: QUOTE_FROM
const QUOTE_FROM = process.env.QUOTE_FROM || "Don Antero <noreply@donantero.com>";

// Webhook Apps Script (opcional)
const SHEETS_WEBHOOK_URL = process.env.SHEETS_WEBHOOK_URL || "";
const SHEETS_WEBHOOK_TOKEN = process.env.SHEETS_WEBHOOK_TOKEN || "";

// Si querés que falle el request cuando Sheets falla: SHEETS_REQUIRED=1
const SHEETS_REQUIRED = process.env.SHEETS_REQUIRED === "1";

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// -------------------- Helpers --------------------

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

// Evita “sheet injection” (=, +, -, @) y limpia saltos raros
function sanitizeForSheets(value) {
  let s = String(value ?? "").replace(/\r\n|\r|\n/g, " ").trim();
  if (/^[=\-+@]/.test(s)) s = `'${s}`;
  return s;
}

async function postToSheetsWebhook({ quoteId, generatedAtIso, contacto, items }) {
  if (!SHEETS_WEBHOOK_URL || !SHEETS_WEBHOOK_TOKEN) {
    return { ok: true, skipped: true };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);

  try {
    const url = `${SHEETS_WEBHOOK_URL}?token=${encodeURIComponent(SHEETS_WEBHOOK_TOKEN)}`;

    const payload = {
      quoteId,
      generatedAt: generatedAtIso,
      source: "donantero.com/cotizacion",
      contacto: {
        nombre: sanitizeForSheets(contacto?.nombre),
        telefono: sanitizeForSheets(contacto?.telefono),
        email: sanitizeForSheets(contacto?.email),
        empresa: sanitizeForSheets(contacto?.empresa),
      },
      items: items.map((it) => ({
        producto: sanitizeForSheets(it.producto),
        cantidad: Number(it.cantidad || 0),
        nota: sanitizeForSheets(it.nota || ""),
      })),
    };

    const r = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const txt = await r.text().catch(() => "");
    let json = null;
    try {
      json = txt ? JSON.parse(txt) : null;
    } catch (_) {}

    if (!r.ok) {
      return { ok: false, status: r.status, body: json ?? txt };
    }

    // El Apps Script propuesto devuelve { ok: true }
    if (json && json.ok === false) {
      return { ok: false, status: r.status, body: json };
    }

    return { ok: true, status: r.status, body: json ?? txt };
  } catch (e) {
    return { ok: false, error: e?.name === "AbortError" ? "timeout" : (e?.message || String(e)) };
  } finally {
    clearTimeout(timeout);
  }
}

// -------------------- Handler --------------------

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método no permitido" });
  }

  if (!resend) {
    return res.status(500).json({ error: "RESEND_API_KEY no configurada en Vercel" });
  }

  try {
    const { contacto, items } = req.body || {};

    // Validación básica
    if (!contacto || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const quoteId = typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : crypto.randomBytes(16).toString("hex");

    const generatedAtIso = new Date().toISOString();
    const generatedAtLocal = new Date().toLocaleString("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires",
    });

    // Para email (HTML safe)
    const nombreHtml = escapeHtml(contacto.nombre);
    const telefonoRaw = String(contacto.telefono ?? "");
    const telefonoHtml = escapeHtml(telefonoRaw);
    const emailRaw = String(contacto.email ?? "");
    const emailHtml = escapeHtml(emailRaw);
    const empresaHtml = escapeHtml(contacto.empresa || "-");

    // Sanitizar items (HTML safe para email)
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

    const totalProductos = cleanItems.length;
    const unidadesTotales = cleanItems.reduce((sum, item) => sum + item.cantidad, 0);

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

          <div style="background: #0f172a; color: white; padding: 30px 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Nueva Solicitud de Cotización</h1>
            <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">Don Antero - Indumentaria Industrial</p>
          </div>

          <div style="padding: 32px 24px;">
            <h2 style="margin: 0 0 20px; font-size: 18px; font-weight: 700; color: #0f172a; border-bottom: 2px solid #0f172a; padding-bottom: 8px;">
              📋 Datos de Contacto
            </h2>

            <table style="width: 100%; margin-bottom: 24px;">
              <tr><td style="padding: 8px 0; font-weight: 600; width: 120px;">Nombre:</td><td style="padding: 8px 0;">${nombreHtml}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: 600;">Teléfono:</td><td style="padding: 8px 0;"><a href="tel:${escapeHtml(telefonoRaw)}" style="color: #0f172a; text-decoration: none;">${telefonoHtml}</a></td></tr>
              <tr><td style="padding: 8px 0; font-weight: 600;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(emailRaw)}" style="color: #2563eb; text-decoration: none;">${emailHtml}</a></td></tr>
              <tr><td style="padding: 8px 0; font-weight: 600;">Empresa:</td><td style="padding: 8px 0;">${empresaHtml}</td></tr>
            </table>

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
              <tbody>${productosHTML}</tbody>
            </table>

            <div style="margin-top: 24px; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #0f172a;">
              <p style="margin: 0; font-size: 14px; color: #64748b;"><strong>Total de productos:</strong> ${totalProductos}</p>
              <p style="margin: 8px 0 0; font-size: 14px; color: #64748b;"><strong>Unidades totales:</strong> ${unidadesTotales}</p>
              <p style="margin: 8px 0 0; font-size: 12px; color: #94a3b8;"><strong>ID Cotización:</strong> ${escapeHtml(quoteId)}</p>
            </div>
          </div>

          <div style="background: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; font-size: 13px; color: #64748b;">
              Este email fue generado automáticamente desde <strong>donantero.com</strong>
            </p>
            <p style="margin: 8px 0 0; font-size: 12px; color: #94a3b8;">
              ${generatedAtLocal}
            </p>
          </div>

        </div>
      </body>
      </html>
    `;

    const textContent = `
NUEVA SOLICITUD DE COTIZACIÓN - Don Antero
ID Cotización: ${quoteId}

DATOS DE CONTACTO
- Nombre: ${contacto.nombre}
- Teléfono: ${contacto.telefono}
- Email: ${contacto.email}
- Empresa: ${contacto.empresa}

PRODUCTOS SOLICITADOS
${cleanItems
  .map(
    (item, i) => `${i + 1}. ${item.producto}
   Cantidad: ${item.cantidad}
   Notas: ${item.nota || "-"}`
  )
  .join("\n\n")}

Total productos: ${totalProductos}
Unidades totales: ${unidadesTotales}
Generado: ${generatedAtLocal}
`.trim();

    // 1) Enviar email con Resend
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

    // 2) Guardar en Sheets (opcional)
    // Para Sheets conviene mandar strings sin HTML-escaping:
    // - contacto original + items originales (pero con saneo anti-sheet injection)
    const itemsForSheets = items
      .map((it) => ({
        producto: String(it?.producto ?? ""),
        cantidad: Math.max(0, safeInt(it?.cantidad, 0)),
        nota: String(it?.nota ?? ""),
      }))
      .filter((it) => it.producto && it.cantidad > 0);

    const sheetsResult = await postToSheetsWebhook({
      quoteId,
      generatedAtIso,
      contacto,
      items: itemsForSheets,
    });

    if (!sheetsResult.ok) {
      console.error("Sheets webhook failed:", sheetsResult);

      if (SHEETS_REQUIRED) {
        // OJO: esto va a hacer que el usuario piense que “falló todo” aunque el email ya salió OK.
        // Úsalo solo si realmente lo querés así.
        return res.status(502).json({
          error: "Se envió el email pero falló el guardado en Sheets",
          quoteId,
          emailId: data?.id,
          sheets: sheetsResult,
        });
      }
    }

    return res.status(200).json({
      success: true,
      quoteId,
      emailId: data?.id,
      sheets_ok: !!sheetsResult.ok,
      sheets_skipped: !!sheetsResult.skipped,
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
