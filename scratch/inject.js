const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../frontend');

fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.html')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if it already has navbar.js
    if (!content.includes('js/navbar.js')) {
      content = content.replace('</body>', '  <script src="js/navbar.js"></script>\n</body>');
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${file}`);
    }
  }
});
