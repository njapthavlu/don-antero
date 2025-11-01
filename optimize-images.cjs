const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'src/images');
const files = fs.readdirSync(imagesDir);

// Filter only jpg files
const jpgFiles = files.filter(f => f.toLowerCase().endsWith('.jpg'));

console.log(`Optimizando ${jpgFiles.length} imágenes...`);

Promise.all(
  jpgFiles.map(async (file) => {
    const inputPath = path.join(imagesDir, file);
    const stats = fs.statSync(inputPath);
    const originalSize = (stats.size / 1024).toFixed(2);

    try {
      await sharp(inputPath)
        .resize(1200, null, { // Max width 1200px, maintain aspect ratio
          withoutEnlargement: true,
          fit: 'inside'
        })
        .jpeg({
          quality: 80, // Good quality but compressed
          progressive: true,
          mozjpeg: true
        })
        .toFile(inputPath + '.tmp');

      // Replace original with optimized
      fs.renameSync(inputPath + '.tmp', inputPath);

      const newStats = fs.statSync(inputPath);
      const newSize = (newStats.size / 1024).toFixed(2);
      const reduction = ((1 - newStats.size / stats.size) * 100).toFixed(1);

      console.log(`✓ ${file}: ${originalSize} KB → ${newSize} KB (reducción: ${reduction}%)`);
    } catch (error) {
      console.error(`✗ Error optimizando ${file}:`, error.message);
    }
  })
).then(() => {
  console.log('\n¡Optimización completada!');
}).catch(err => {
  console.error('Error en la optimización:', err);
  process.exit(1);
});
