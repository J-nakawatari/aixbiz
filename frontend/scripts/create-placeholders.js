// This script creates placeholder text files for images
// In a real application, these would be replaced with actual images

const fs = require('fs');
const path = require('path');

const placeholders = [
  'placeholder-manufacturing.png',
  'placeholder-professional.png', 
  'placeholder-restaurant.png',
  'placeholder-realestate.png',
  'placeholder-retail.png',
  'placeholder-it.png'
];

const imagesDir = path.join(__dirname, '..', 'public', 'images');

// Ensure directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Create placeholder files
placeholders.forEach(filename => {
  const filepath = path.join(imagesDir, filename);
  fs.writeFileSync(filepath, `Placeholder for ${filename}`);
  console.log(`Created: ${filepath}`);
});

console.log('All placeholder files created successfully!');