#!/bin/bash
# Script para renombrar imágenes a formato normalizado (sin tildes ni caracteres especiales)
# Ejecutar desde la raíz del repositorio don-antero

set -e  # Salir si hay error

echo "🔧 Configurando Git para case-sensitive..."
git config core.ignorecase false

echo ""
echo "📸 Renombrando imágenes en src/images/..."
echo ""

# Buzo polar antipeeling
if [ -f "src/images/Buzo polar antipeeling.jpg" ]; then
  echo "✓ Renombrando: Buzo polar antipeeling.jpg"
  git mv "src/images/Buzo polar antipeeling.jpg" "src/images/buzo-polar-antipeeling.jpg"
fi

# Campera trucker forrada en matelassé
if [ -f "src/images/Campera trucker forrada en matelassé de 150 grs. con capucha desmontable.jpg" ]; then
  echo "✓ Renombrando: Campera trucker forrada en matelassé..."
  git mv "src/images/Campera trucker forrada en matelassé de 150 grs. con capucha desmontable.jpg" \
         "src/images/campera-trucker-forrada-matelasse-150-grs-capucha-desmontable.jpg"
fi

# Campera trucker forrada en metalassse (typo con 3 s)
if [ -f "src/images/Campera trucker forrada en metalassse de 150grs. con capucha desmontable.jpg" ]; then
  echo "✓ Eliminando duplicado con typo: Campera trucker metalassse..."
  git rm "src/images/Campera trucker forrada en metalassse de 150grs. con capucha desmontable.jpg"
fi

# Chaleco de tela gabardina con reflectivo
if [ -f "src/images/Chaleco de tela gabardina con reflectivo.jpg" ]; then
  echo "✓ Renombrando: Chaleco de tela gabardina..."
  git mv "src/images/Chaleco de tela gabardina con reflectivo.jpg" \
         "src/images/chaleco-de-tela-gabardina-con-reflectivo.jpg"
fi

# Chaleco trucker
if [ -f "src/images/Chaleco trucker.jpg" ]; then
  echo "✓ Renombrando: Chaleco trucker.jpg"
  git mv "src/images/Chaleco trucker.jpg" "src/images/chaleco-trucker.jpg"
fi

# Chaleco polar antipeeling
if [ -f "src/images/Chaleco polar antipeeling.jpg" ]; then
  echo "✓ Renombrando: Chaleco polar antipeeling.jpg"
  git mv "src/images/Chaleco polar antipeeling.jpg" "src/images/chaleco-polar-antipeeling.jpg"
fi

# Camisa y pantalon para bomberos : policias
if [ -f "src/images/Camisa y pantalon para bomberos : policias en tela antidesgarro Reebstop.jpg" ]; then
  echo "✓ Renombrando: Camisa y pantalon bomberos..."
  git mv "src/images/Camisa y pantalon para bomberos : policias en tela antidesgarro Reebstop.jpg" \
         "src/images/camisa-pantalon-bomberos-policias-antidesgarro-reebstop.jpg"
fi

# Camisa de tela antidesgarro Reebstop
if [ -f "src/images/Camisa de tela antidesgarro Reebstop.jpg" ]; then
  echo "✓ Renombrando: Camisa antidesgarro..."
  git mv "src/images/Camisa de tela antidesgarro Reebstop.jpg" \
         "src/images/camisa-de-tela-antidesgarro-reebstop.jpg"
fi

# Camisa de gabardina 6 0Z con reflectivo
if [ -f "src/images/Camisa de gabardina 6 0Z con reflectivo.jpg" ]; then
  echo "✓ Renombrando: Camisa gabardina 6 OZ reflectivo..."
  git mv "src/images/Camisa de gabardina 6 0Z con reflectivo.jpg" \
         "src/images/camisa-gabardina-6-oz-con-reflectivo.jpg"
fi

# Camisa de gabardina sanforizada 6 0Z
if [ -f "src/images/Camisa de gabardina sanforizada 6 0Z.jpg" ]; then
  echo "✓ Renombrando: Camisa gabardina sanforizada..."
  git mv "src/images/Camisa de gabardina sanforizada 6 0Z.jpg" \
         "src/images/camisa-gabardina-sanforizada-6-oz.jpg"
fi

# Ambos para industria alimenticia
if [ -f "src/images/Ambos para industria alimenticia con velcro y elastico Gabardina.jpg" ]; then
  echo "✓ Renombrando: Ambos industria alimenticia..."
  git mv "src/images/Ambos para industria alimenticia con velcro y elastico Gabardina.jpg" \
         "src/images/ambos-industria-alimenticia-velcro-elastico-gabardina.jpg"
fi

# Camisa de tela batista
if [ -f "src/images/Camisa de tela batista.jpg" ]; then
  echo "✓ Renombrando: Camisa batista..."
  git mv "src/images/Camisa de tela batista.jpg" "src/images/camisa-de-tela-batista.jpg"
fi

# Buzo de frisa peinada (Frisa cardada)
if [ -f "src/images/Buzo de frisa peinada (Frisa cardada).jpg" ]; then
  echo "✓ Renombrando: Buzo frisa peinada..."
  git mv "src/images/Buzo de frisa peinada (Frisa cardada).jpg" \
         "src/images/buzo-frisa-peinada-frisa-cardada.jpg"
fi

echo ""
echo "✅ Renombrado completado!"
echo ""
echo "📋 Próximos pasos:"
echo "   1. Revisá los cambios: git status"
echo "   2. Hacé commit: git commit -m 'Normalize image filenames'"
echo "   3. Push: git push origin main"
echo ""
