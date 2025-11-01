# Logo de Don Antero

## ⚠️ ACCIÓN REQUERIDA

El código ya está preparado para usar el logo de Don Antero, pero **necesitás descargar manualmente la imagen del logo** y colocarla en el proyecto.

## Pasos para agregar el logo:

1. **Descargá la imagen del logo** desde:
   ```
   http://donantero.slindumentariadescartable.com/wp-content/uploads/2025/07/Donantero-logo.png
   ```

2. **Guardá el archivo** en la siguiente ruta del proyecto:
   ```
   src/images/donantero-logo.png
   ```

3. **Reemplazá el archivo placeholder** que actualmente está en esa ubicación.

## Archivos modificados

Los siguientes componentes ya fueron actualizados para usar el logo:
- ✅ `src/components/DonAnteroCatalogGrid.jsx`
- ✅ `src/components/DonAnteroProductPage.jsx`
- ✅ `src/components/DonAnteroHome.jsx`
- ✅ `src/components/CotizacionPage.jsx`

El logo aparecerá en el header de todas las páginas con una altura de 40px (h-10), manteniendo su aspect ratio original.

## Nota técnica

El servidor que aloja la imagen tiene protección anti-hotlinking (error 403), por lo que no pudo ser descargada automáticamente durante el desarrollo.
