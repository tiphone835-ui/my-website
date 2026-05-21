const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = ['admin.html', 'index.html', 'scripts/main.js', 'scripts/render.js', 'scripts/api.js', 'scripts/mockData.js'];

files.forEach(f => {
    const filePath = path.join(dir, f);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
            if (line.toLowerCase().includes('announcement')) {
                console.log(`${f}:${idx + 1}: ${line.trim()}`);
            }
        });
    }
});
