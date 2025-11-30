import * as admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

let serviceAccount: any;

try {
    console.log('--- Firebase Init ---');
    console.log('CWD:', process.cwd());

    let keyPath = '';
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        console.log('Using ENV variable for key path');
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY.trim().startsWith('{')) {
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        } else {
            keyPath = path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        }
    } else {
        console.log('Using default path for key');
        keyPath = path.resolve(__dirname, '../../serviceAccountKey.json');
    }

    if (keyPath) {
        console.log(`Loading key from: ${keyPath}`);
        if (fs.existsSync(keyPath)) {
            const fileContent = fs.readFileSync(keyPath, 'utf-8');
            serviceAccount = JSON.parse(fileContent);
        } else {
            console.error(`File not found at: ${keyPath}`);
        }
    }

} catch (error: any) {
    console.error('Error loading Firebase Service Account Key:', error.message);
}

if (serviceAccount) {
    console.log('Service Account loaded. Project ID:', serviceAccount.project_id);
    console.log('Has private_key:', !!serviceAccount.private_key);
    console.log('Has client_email:', !!serviceAccount.client_email);

    try {
        if (!admin.apps.length) {
            console.log('Initializing Firebase Admin...');
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: serviceAccount.project_id
            });
            console.log('Firebase initialized successfully');
        }
    } catch (error) {
        console.error('Firebase initialization failed:', error);
    }
} else {
    console.error('CRITICAL: No Firebase Service Account Key found.');
}

// Export db, but it might throw if accessed before init if init failed.
// We'll wrap it or just let it throw but now we have logs.
export const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });
