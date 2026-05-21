
const fs = require('fs');

function decodeMojibake(str) {
    return Buffer.from(str, 'latin1').toString('utf8');
}

const filePath = 'c:\\Users\\saiki\\.gemini\\antigravity\\scratch\\temple-website\\index.html';
const content = fs.readFileSync(filePath, 'utf8');

// Find all strings that look like mojibake (contains à° or similar)
// Telugu range in UTF-8 starts with 0xE0 0xB0 and 0xE0 0xB1
// In Latin1 that's à° and à±

const regex = /à[°±].*?(?=[<"]|$)/g;
const matches = content.match(regex) || [];

const uniqueMatches = [...new Set(matches)];
const results = uniqueMatches.map(m => ({ original: m, decoded: decodeMojibake(m) }));

fs.writeFileSync('scripts/decoded_output.json', JSON.stringify(results, null, 2), 'utf8');
console.log('Results written to scripts/decoded_output.json');
