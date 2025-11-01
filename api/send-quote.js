// Vercel Serverless Function para enviar emails de cotización
// Usa Resend (npm install resend) o nodemailer según prefieras

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { contacto, items } = req.body;

    // Validación básica
    if (!contacto || !items || items.length === 0) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    // Construir tabla HTML de productos
    const productosHTML = items
      .map(
        (item, index) => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px; text-align: left;">${index + 1}</td>
          <td style="padding: 12px; text-align: left;"><strong>${item.producto}</strong></td>
          <td style="padding: 12px; text-align: center;">${item.cantidad}</td>
          <td style="padding: 12px; text-align: left;">${item.nota || '-'}</td>
        </tr>
      `
      )
      .join('');

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
                <td style="padding: 8px 0;">${contacto.nombre}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600;">Teléfono:</td>
                <td style="padding: 8px 0;"><a href="tel:${contacto.telefono}" style="color: #0f172a; text-decoration: none;">${contacto.telefono}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600;">Email:</td>
                <td style="padding: 8px 0;"><a href="mailto:${contacto.email}" style="color: #2563eb; text-decoration: none;">${contacto.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600;">Empresa:</td>
                <td style="padding: 8px 0;">${contacto.empresa}</td>
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
                <strong>Total de productos:</strong> ${items.length}
              </p>
              <p style="margin: 8px 0 0; font-size: 14px; color: #64748b;">
                <strong>Unidades totales:</strong> ${items.reduce((sum, item) => sum + item.cantidad, 0)}
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; font-size: 13px; color: #64748b;">
              Este email fue generado automáticamente desde <strong>donantero.com.ar</strong>
            </p>
            <p style="margin: 8px 0 0; font-size: 12px; color: #94a3b8;">
              ${new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}
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

${items.map((item, i) => `${i + 1}. ${item.producto}
   Cantidad: ${item.cantidad}
   Notas: ${item.nota || '-'}
`).join('\n')}

─────────────────────────────────────
Total productos: ${items.length}
Unidades totales: ${items.reduce((sum, item) => sum + item.cantidad, 0)}
─────────────────────────────────────

Generado: ${new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}
    `.trim();

    // Enviar email con Resend
    await resend.emails.send({
      from: 'Don Antero <noreply@donantero.com.ar>',
      to: 'sandroni.lucas.javier@gmail.com',
      replyTo: contacto.email,
      subject: `Nueva Cotización de ${contacto.nombre} - Don Antero`,
      html: htmlContent,
      text: textContent
    });

    return res.status(200).json({
      success: true,
      message: 'Cotización enviada exitosamente'
    });

  } catch (error) {
    console.error('Error al enviar cotización:', error);
    return res.status(500).json({
      error: 'Error al enviar la cotización',
      details: error.message
    });
  }
}
