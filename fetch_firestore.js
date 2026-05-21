const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://firestore.googleapis.com/v1/projects/sree-sitha-rama-saigudem/databases/(default)/documents/announcements';
const outputPath = path.join(__dirname, 'announcements_live.json');

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        fs.writeFileSync(outputPath, data);
        console.log('SUCCESS: Written Firestore data to ' + outputPath);
        process.exit(0);
    });
}).on('error', (err) => {
    console.error('ERROR: ' + err.message);
    process.exit(1);
});
