# Don Antero - Sitio Web

Sitio web de Don Antero: fabricantes de indumentaria y seguridad industrial. Producción propia, calidad certificada.

## 🚀 Stack Tecnológico

- **React 18** - Framework de interfaz de usuario
- **Vite** - Build tool y dev server ultrarrápido
- **React Router** - Navegación entre páginas
- **TailwindCSS** - Framework de estilos utilitario
- **Framer Motion** - Animaciones suaves
- **Lucide React** - Iconos modernos

## 📁 Estructura del Proyecto

```
don-antero/
├── src/
│   ├── components/
│   │   ├── DonAnteroHome.jsx          # Página de inicio
│   │   ├── DonAnteroCatalogGrid.jsx   # Catálogo de productos
│   │   └── DonAnteroProductPage.jsx   # Página de detalle de producto
│   ├── data/
│   │   └── products.js                # Base de datos de productos (18 productos)
│   ├── App.jsx                        # Router principal
│   ├── main.jsx                       # Entry point
│   └── index.css                      # Estilos globales + Tailwind
├── public/                            # Archivos estáticos
├── index.html                         # HTML principal
├── vite.config.js                     # Configuración de Vite
├── tailwind.config.js                 # Configuración de Tailwind
├── vercel.json                        # Configuración de Vercel
└── package.json                       # Dependencias

```

## 🛠️ Instalación Local

### Prerrequisitos
- Node.js 18+ instalado
- npm o yarn

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/njapthavlu/don-antero.git
   cd don-antero
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   # o
   yarn dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 📦 Build de Producción

Para crear una versión optimizada para producción:

```bash
npm run build
# o
yarn build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

Para previsualizar el build de producción localmente:

```bash
npm run preview
# o
yarn preview
```

## 🚢 Deploy en Vercel

### Opción 1: Deploy Automático (Recomendado)

1. **Conectar repositorio a Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Haz clic en "Add New Project"
   - Importa el repositorio `njapthavlu/don-antero`
   - Vercel detectará automáticamente que es un proyecto Vite

2. **Configuración automática**
   - Framework Preset: **Vite**
   - Build Command: `npm run build` (automático)
   - Output Directory: `dist` (automático)

3. **Deploy**
   - Haz clic en "Deploy"
   - Vercel construirá y desplegará automáticamente
   - Cada push a `main` desplegará automáticamente

### Opción 2: Deploy Manual con CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login en Vercel
vercel login

# Deploy
vercel

# Deploy a producción
vercel --prod
```

### Variables de Entorno (Opcional)

Si necesitás configurar variables de entorno:

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agrega las variables necesarias

## 🎨 Personalización

### Agregar/Editar Productos

Edita el archivo `src/data/products.js`:

```javascript
export const PRODUCTS = [
  {
    slug: "producto-ejemplo",
    name: "Nombre del Producto",
    category: "Indumentaria de trabajo",
    tags: ["tag1", "tag2"],
    images: ["url-imagen.jpg"],
    summary: "Descripción breve",
    specs: [
      { k: "Tela", v: "Gabardina" },
      { k: "Gramaje", v: "8oz" }
    ],
    highlights: ["Punto 1", "Punto 2"],
    pdf: null
  },
  // ... más productos
];
```

### Modificar Colores y Estilos

Los colores principales están en las clases de Tailwind:

- **Primario oscuro**: `bg-slate-900`, `text-slate-900`
- **Primario claro**: `bg-slate-50`, `text-slate-50`
- **Acentos**: `bg-rose-600` (detalles rojos)

Para cambiar el tema completo, edita `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {...},
      secondary: {...}
    }
  }
}
```

## 📧 Contacto

El formulario de cotización envía emails a:
- **ventas@donantero.com.ar**

Para cambiar el email de destino, busca y reemplaza todas las ocurrencias de `ventas@donantero.com.ar` en los componentes.

## 🐛 Troubleshooting

### El sitio no carga correctamente en Vercel

Verifica que `vercel.json` tenga la configuración de rewrites:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Imágenes no se muestran

Las imágenes actualmente usan placeholders SVG. Para usar imágenes reales:
1. Agrega las imágenes a la carpeta `public/images/`
2. Actualiza los paths en `src/data/products.js`:
   ```javascript
   images: ["/images/producto-1.jpg"]
   ```

### Error al instalar dependencias

Prueba limpiar el cache de npm/yarn:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📄 Licencia

© 2025 Don Antero. Todos los derechos reservados.

---

**Desarrollado con ❤️ para Don Antero**
