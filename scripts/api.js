const API_CONFIG = {
    USE_MOCK: false, // Set to true to force Mock Data
    USE_FIREBASE: window.USE_FIREBASE || false // Controlled by firebase-config.js
};

// Initialize Firebase if enabled
let db, storage, auth;
if (window.USE_FIREBASE && typeof firebase !== 'undefined') {
    firebase.initializeApp(window.FIREBASE_CONFIG);
    db = firebase.firestore();
    storage = firebase.storage();
    auth = firebase.auth();
    console.log("Firebase Initialized Successfully");
    
    // Automatically authenticate anonymously to ensure safe write access
    auth.signInAnonymously().catch(err => console.warn("Firebase Anonymous Auth failed:", err));
}

const ApiService = {
    async fetchCollection(col) {
        if (API_CONFIG.USE_MOCK) {
            const localOverride = localStorage.getItem(`admin_data_${col.toLowerCase()}`);
            if (localOverride) return JSON.parse(localOverride);
            return window.MOCK_DB[col];
        }
        if (window.USE_FIREBASE && db) {
            try {
                // Force fetch from server to guarantee real-time updates and bypass local SDK cache
                const snapshot = await db.collection(col).get({ source: 'server' }).catch(() => db.collection(col).get());
                const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // Fall back to local storage override or default mock data if the collection is empty in Firestore
                if (list.length === 0) {
                    const localOverride = localStorage.getItem(`admin_data_${col.toLowerCase()}`);
                    if (localOverride) {
                        console.log(`Firestore collection '${col}' is empty. Using local storage override for ${col}.`);
                        return JSON.parse(localOverride);
                    }
                    if (window.MOCK_DB[col]) {
                        console.log(`Firestore collection '${col}' is empty. Using default mock data for ${col}.`);
                        return window.MOCK_DB[col];
                    }
                }
                return list;
            } catch (e) {
                console.warn(`Individual fetch failed for ${col}, using local fallback:`, e);
                const localOverride = localStorage.getItem(`admin_data_${col.toLowerCase()}`);
                if (localOverride) return JSON.parse(localOverride);
                return window.MOCK_DB[col];
            }
        }
        const localOverride = localStorage.getItem(`admin_data_${col.toLowerCase()}`);
        if (localOverride) return JSON.parse(localOverride);
        return window.MOCK_DB[col];
    },

    async fetchData() {
        if (API_CONFIG.USE_MOCK) {
            console.log("Using MOCK data (Forced)");
            return window.MOCK_DB;
        }

        if (window.USE_FIREBASE && db) {
            try {
                console.log("Fetching from Firebase Firestore (Parallel)...");
                const collections = ['updates', 'gallery', 'announcements', 'timings', 'festivals', 'donations_info', 'about', 'committees', 'donor_list', 'volunteers'];
                const data = { config: window.MOCK_DB.config };

                // Fetch all collections in parallel
                const promises = collections.map(col => this.fetchCollection(col).then(res => ({ col, res })));
                const results = await Promise.all(promises);
                
                results.forEach(({ col, res }) => {
                    data[col] = res;
                });

                // Force config fetch from server
                const configDoc = await db.collection('settings').doc('config').get({ source: 'server' }).catch(() => db.collection('settings').doc('config').get());
                if (configDoc.exists) {
                    data.config = { ...data.config, ...configDoc.data() };
                }

                return data;
            } catch (error) {
                console.error("Firebase Parallel Fetch failed:", error);
                return this.getFallbackData();
            }
        }

        return this.getFallbackData();
    },

    getFallbackData() {
        console.log("Using Local/Mock Data Fallback");
        const rawData = { ...window.MOCK_DB };
        for (let module in rawData) {
            const override = localStorage.getItem(`admin_data_${module.toLowerCase()}`);
            if (override) rawData[module] = JSON.parse(override);
        }
        return rawData;
    },

    submitData: async (params) => {
        const type = params.type || 'unknown';
        
        // Always persist locally first for immediate feedback
        try {
            const storageKey = type === 'volunteer' ? 'local_volunteers' : 'local_donations';
            const existingData = JSON.parse(localStorage.getItem(storageKey) || '[]');
            const entry = { ...params, id: Date.now(), submitted_at: new Date().toLocaleString() };
            delete entry.type;
            existingData.unshift(entry);
            localStorage.setItem(storageKey, JSON.stringify(existingData));
        } catch (e) { console.error("Local persistence failed:", e); }

        if (window.USE_FIREBASE && db) {
            try {
                const colName = type === 'volunteer' ? 'volunteers' : 'donor_list';
                await db.collection(colName).add({
                    ...params,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
                return { status: 'success', message: 'Submitted to Firebase' };
            } catch (error) {
                console.error("Firebase Submit Error:", error);
                throw error;
            }
        }

        console.log("MOCK SUBMIT:", params);
        return { status: 'success', message: 'Mock submission successful' };
    },

    async uploadImage(fileOrData, fileName = '', mimeType = '') {
        if (window.USE_FIREBASE && storage) {
            try {
                // If it's already a File/Blob, use it directly (FASTEST)
                const fileToUpload = (fileOrData instanceof Blob || fileOrData instanceof File) ? fileOrData : null;
                const name = fileName || (fileToUpload ? fileToUpload.name : `upload_${Date.now()}`);
                
                console.log(`Uploading ${name} to Firebase Storage...`);
                const storageRef = storage.ref(`gallery/${Date.now()}_${name}`);

                let snapshot;
                if (fileToUpload) {
                    snapshot = await storageRef.put(fileToUpload);
                } else {
                    // Fallback for base64 strings if still used
                    const byteString = atob(fileOrData);
                    const ab = new ArrayBuffer(byteString.length);
                    const ia = new Uint8Array(ab);
                    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
                    const blob = new Blob([ab], { type: mimeType });
                    snapshot = await storageRef.put(blob);
                }

                const url = await snapshot.ref.getDownloadURL();
                return { status: 'success', url: url };
            } catch (error) {
                console.error("Firebase Upload Error:", error);
                return { status: 'error', message: error.message };
            }
        }

        // Return error if Firebase not configured
        return { status: 'error', message: 'Firebase Storage not initialized' };
    },

    async syncData(type, dataList) {
        if (window.USE_FIREBASE && db) {
            try {
                console.log(`Syncing ${type} to Firestore...`);
                const collectionRef = db.collection(type);
                
                // Force fresh fetch of existing docs from server to delete them cleanly
                const snapshot = await collectionRef.get({ source: 'server' }).catch(() => collectionRef.get());
                const deletePromises = snapshot.docs.map(doc => doc.ref.delete());
                await Promise.all(deletePromises);

                const addPromises = dataList.map(item => {
                    const cleanItem = { ...item };
                    if (cleanItem.id) delete cleanItem.id;
                    return collectionRef.add(cleanItem);
                });
                await Promise.all(addPromises);

                return { status: 'success', message: 'Firestore Updated' };
            } catch (error) {
                console.error("Firebase Sync Error:", error);
                return { status: 'error', message: error.message };
            }
        }
        return { status: 'success', message: 'Local storage updated (Demo Mode)' };
    }
};

ApiService.USE_MOCK = API_CONFIG.USE_MOCK;
ApiService.USE_FIREBASE = API_CONFIG.USE_FIREBASE;

window.ApiService = ApiService;

// Trigger background hydration if the main app has already initialized and rendered the optimistic UI
if (typeof window !== 'undefined' && typeof window.hydrateLiveDB === 'function') {
    window.hydrateLiveDB();
}
