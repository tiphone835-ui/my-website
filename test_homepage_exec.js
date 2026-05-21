const fs = require('fs');
const path = require('path');

// Mock browser global environment
global.window = {
    USE_FIREBASE: true,
    FIREBASE_CONFIG: {
        apiKey: "AIzaSyA4S_RjQyVH6eB-xH-PDkxiQvbCIybQRyE",
        authDomain: "sree-sitha-rama-saigudem.firebaseapp.com",
        projectId: "sree-sitha-rama-saigudem"
    }
};
global.document = {
    addEventListener: (event, callback) => {
        if (event === 'DOMContentLoaded') {
            global.DOMContentLoadedCallback = callback;
        }
    },
    getElementById: (id) => {
        // Return a mock element with normal properties
        return {
            id: id,
            innerHTML: '',
            style: {},
            classList: {
                add: () => {},
                remove: () => {},
                toggle: () => {}
            },
            addEventListener: () => {},
            querySelector: () => null,
            querySelectorAll: () => []
        };
    },
    querySelector: (selector) => {
        return {
            innerText: '',
            classList: { add: () => {}, remove: () => {} }
        };
    },
    querySelectorAll: () => [],
    body: {
        style: {}
    }
};
global.localStorage = {
    getItem: (key) => null,
    setItem: (key, val) => {},
    removeItem: (key) => {}
};
global.sessionStorage = {
    getItem: (key) => null,
    setItem: (key, val) => {},
    removeItem: (key) => {}
};
global.navigator = {
    userAgent: 'Node Test'
};

// Mock Firebase SDK
global.firebase = {
    initializeApp: () => {},
    firestore: () => ({
        collection: (name) => ({
            get: async () => {
                console.log(`MOCK FIREBASE: get() called on collection '${name}'`);
                if (name === 'announcements') {
                    return {
                        docs: [
                            {
                                id: 'doc123',
                                data: () => ({
                                    announcement_text: 'Live Reopening Test',
                                    priority: 'High',
                                    status: 'Active'
                                })
                            }
                        ]
                    };
                }
                return { docs: [] };
            },
            doc: (docName) => ({
                get: async () => {
                    if (docName === 'config') {
                        return {
                            exists: true,
                            data: () => ({ templeName: 'Test Live Temple' })
                        };
                    }
                    return { exists: false };
                }
            })
        })
    }),
    storage: () => ({}),
    auth: () => ({
        signInAnonymously: async () => {
            console.log('MOCK FIREBASE: signInAnonymously() succeeded');
            return { user: { isAnonymous: true } };
        }
    })
};

// Mock IntersectionObserver
global.IntersectionObserver = class {
    constructor() {}
    observe() {}
};

console.log('--- SIMULATING CODEBASE EXECUTION ---');

try {
    // Load scripts in the new non-blocking parsing order
    const mockDataCode = fs.readFileSync(path.join(__dirname, 'scripts/mockData.js'), 'utf8');
    eval(mockDataCode);
    console.log('1. mockData.js loaded successfully');

    const renderCode = fs.readFileSync(path.join(__dirname, 'scripts/render.js'), 'utf8');
    eval(renderCode);
    console.log('2. render.js loaded successfully');

    const mainCode = fs.readFileSync(path.join(__dirname, 'scripts/main.js'), 'utf8');
    eval(mainCode);
    console.log('3. main.js loaded successfully');

    const apiCode = fs.readFileSync(path.join(__dirname, 'scripts/api.js'), 'utf8');
    eval(apiCode);
    console.log('4. api.js loaded successfully');

    // Verify hydrated database state
    setTimeout(() => {
        console.log('Final window.TEMPLE_DATA state:', global.window.TEMPLE_DATA);
        process.exit(0);
    }, 100);
} catch (err) {
    console.error('CRITICAL COMPILATION/EXECUTION ERROR:', err);
    process.exit(1);
}
