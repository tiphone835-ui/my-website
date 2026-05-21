const https = require('https');

const url = 'https://firestore.googleapis.com/v1/projects/sree-sitha-rama-saigudem/databases/(default)/documents/announcements';

const postData = JSON.stringify({
    fields: {
        announcement_text: { stringValue: 'Test Announcement ' + new Date().toLocaleTimeString() },
        priority: { stringValue: 'Medium' },
        status: { stringValue: 'Active' }
    }
});

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const req = https.request(url, options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log('STATUS:', res.statusCode);
        console.log('RESPONSE:', data);
        process.exit(0);
    });
});

req.on('error', (e) => {
    console.error('ERROR:', e.message);
    process.exit(1);
});

req.write(postData);
req.end();
