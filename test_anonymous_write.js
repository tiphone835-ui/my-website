const https = require('https');

const API_KEY = 'AIzaSyA4S_RjQyVH6eB-xH-PDkxiQvbCIybQRyE';
const PROJECT_ID = 'sree-sitha-rama-saigudem';

function post(url, data, headers = {}) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify(data);
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || 443,
            path: urlObj.pathname + urlObj.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body),
                ...headers
            }
        };

        const req = https.request(options, (res) => {
            let resData = '';
            res.on('data', (chunk) => resData += chunk);
            res.on('end', () => {
                resolve({ statusCode: res.statusCode, body: JSON.parse(resData) });
            });
        });

        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

async function runTest() {
    try {
        console.log('1. Attempting Firebase Anonymous Auth via REST...');
        const authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
        const authResult = await post(authUrl, { returnSecureToken: true });
        
        if (authResult.statusCode !== 200) {
            console.error('Anonymous Auth Failed:', authResult.body);
            process.exit(1);
        }
        
        const idToken = authResult.body.idToken;
        console.log('Anonymous Auth Successful! ID Token acquired.');

        console.log('\n2. Attempting to write test announcement to Firestore with Auth Token...');
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/announcements`;
        const announcementData = {
            fields: {
                announcement_text: { stringValue: 'Test Announcement ' + new Date().toLocaleTimeString() },
                priority: { stringValue: 'Medium' },
                status: { stringValue: 'Active' }
            }
        };
        const writeResult = await post(firestoreUrl, announcementData, {
            'Authorization': `Bearer ${idToken}`
        });

        console.log('Write STATUS:', writeResult.statusCode);
        console.log('Write RESPONSE:', JSON.stringify(writeResult.body, null, 2));

        if (writeResult.statusCode === 200 || writeResult.statusCode === 201) {
            console.log('\nSUCCESS: Write was permitted and completed!');
        } else {
            console.error('\nFAILURE: Write failed. Security rules might be blocking write/update operations.');
        }
        process.exit(0);
    } catch (err) {
        console.error('Error during test:', err);
        process.exit(1);
    }
}

runTest();
