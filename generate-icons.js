const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
    try {
        const inputSvg = await fs.readFile(path.join(__dirname, 'icons', 'icon.svg'));
        
        for (const size of sizes) {
            await sharp(inputSvg)
                .resize(size, size)
                .png()
                .toFile(path.join(__dirname, 'icons', `icon-${size}x${size}.png`));
            
            console.log(`Generated ${size}x${size} icon`);
        }
        
        console.log('All icons generated successfully!');
    } catch (error) {
        console.error('Error generating icons:', error);
    }
}

generateIcons(); 