import React, { useState } from 'react';
import { PRODUCTS } from '../data/products';
import './QuoteFormMulti.css';

export default function QuoteFormMulti({ defaultProduct = null }) {
  const [contactData, setContactData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    empresa: '',
    web: '' // Honeypot
  });

  const [items, setItems] = useState([
    {
      producto: defaultProduct || PRODUCTS[0]?.name || '',
      cantidad: 100,
      nota: ''
    }
  ]);

  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { producto: PRODUCTS[0]?.name || '', cantidad: 100, nota: '' }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Honeypot check
    if (contactData.web) {
      setStatus({ type: 'error', message: 'Error en el formulario.' });
      return;
    }

    // Validación básica
    if (!contactData.nombre || !contactData.telefono || !contactData.email) {
      setStatus({ type: 'error', message: 'Por favor completá todos los campos obligatorios.' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactData.email)) {
      setStatus({ type: 'error', message: 'Por favor ingresá un email válido.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/send-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contacto: {
            nombre: contactData.nombre,
            telefono: contactData.telefono,
            email: contactData.email,
            empresa: contactData.empresa || 'No especificada'
          },
          items: items.filter(item => item.producto && item.cantidad > 0)
        })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: '¡Cotización enviada exitosamente! Te contactaremos pronto.' });
        // Reset form
        setContactData({ nombre: '', telefono: '', email: '', empresa: '', web: '' });
        setItems([{ producto: PRODUCTS[0]?.name || '', cantidad: 100, nota: '' }]);
      } else {
        setStatus({ type: 'error', message: data.error || 'Error al enviar la cotización. Intentá nuevamente.' });
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus({ type: 'error', message: 'Error al enviar la cotización. Verificá tu conexión e intentá nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quote-form-multi">
      <h2 className="quote-form-title">Solicitá tu cotización</h2>

      <form onSubmit={handleSubmit} autoComplete="off">
        {/* Campos de contacto */}
        <div className="quote-form-contact">
          <input
            type="text"
            name="nombre"
            value={contactData.nombre}
            onChange={handleContactChange}
            placeholder="Nombre y apellido *"
            required
            disabled={loading}
          />
          <input
            type="text"
            name="telefono"
            value={contactData.telefono}
            onChange={handleContactChange}
            placeholder="Teléfono *"
            required
            disabled={loading}
          />
          <input
            type="email"
            name="email"
            value={contactData.email}
            onChange={handleContactChange}
            placeholder="Email *"
            required
            disabled={loading}
          />
          <input
            type="text"
            name="empresa"
            value={contactData.empresa}
            onChange={handleContactChange}
            placeholder="Empresa (opcional)"
            disabled={loading}
          />

          {/* Honeypot anti-spam */}
          <input
            type="text"
            name="web"
            value={contactData.web}
            onChange={handleContactChange}
            tabIndex={-1}
            autoComplete="off"
            style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
            aria-hidden="true"
          />
        </div>

        {/* Items de cotización */}
        <div className="quote-form-items">
          <div className="quote-form-items-head">
            <span>Producto</span>
            <span>Cantidad</span>
            <span>Notas</span>
            <span></span>
          </div>

          {items.map((item, index) => (
            <div key={index} className="quote-form-item">
              <select
                value={item.producto}
                onChange={(e) => handleItemChange(index, 'producto', e.target.value)}
                required
                disabled={loading}
              >
                {PRODUCTS.map(p => (
                  <option key={p.slug} value={p.name}>{p.name}</option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                value={item.cantidad}
                onChange={(e) => handleItemChange(index, 'cantidad', parseInt(e.target.value) || 1)}
                required
                disabled={loading}
              />

              <input
                type="text"
                value={item.nota}
                onChange={(e) => handleItemChange(index, 'nota', e.target.value)}
                placeholder="Color, talle, etc. (opcional)"
                disabled={loading}
              />

              <button
                type="button"
                className="btn-remove"
                onClick={() => removeItem(index)}
                disabled={items.length === 1 || loading}
                aria-label="Quitar ítem"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Acciones */}
        <div className="quote-form-actions">
          <button
            type="button"
            onClick={addItem}
            className="btn-secondary"
            disabled={loading}
          >
            + Agregar producto
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar solicitud'}
          </button>
        </div>
      </form>

      {/* Mensajes de estado */}
      {status.message && (
        <div
          className={`quote-form-msg ${status.type}`}
          role="status"
          aria-live="polite"
        >
          {status.message}
        </div>
      )}
    </div>
  );
}
