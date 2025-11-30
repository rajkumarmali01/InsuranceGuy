import * as admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

console.log('--- Firebase Diagnostic Script ---');
console.log('CWD:', process.cwd());
console.log('ENV FIREBASE_SERVICE_ACCOUNT_KEY:', process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

let serviceAccount: any;

try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY.trim().startsWith('{')) {
            console.log('Parsing JSON from ENV...');
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        } else {
            const keyPath = path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
            console.log(`Loading key from file: ${keyPath}`);
            serviceAccount = require(keyPath);
        }
    } else {
        const defaultPath = path.resolve(__dirname, '../serviceAccountKey.json'); // Adjusted for src/
        console.log(`Looking for key at default path: ${defaultPath}`);
        try {
            serviceAccount = require(defaultPath);
        } catch (e) {
            const rootPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
            console.log(`Fallback: Looking for key at root path: ${rootPath}`);
            serviceAccount = require(rootPath);
        }
    }

    console.log('Service Account Loaded:', serviceAccount ? 'YES' : 'NO');
    if (serviceAccount) {
        console.log('Project ID:', serviceAccount.project_id);
        console.log('Client Email:', serviceAccount.client_email);
        console.log('Private Key Length:', serviceAccount.private_key ? serviceAccount.private_key.length : 0);
    }

    console.log('Initializing Firebase Admin...');
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('Firebase initialized successfully.');
    } else {
        console.log('Firebase already initialized (unexpected in script).');
    }

    console.log('Testing Firestore connection...');
    const db = admin.firestore();
    db.listCollections().then(collections => {
        console.log('Connected! Collections:', collections.map(c => c.id));
    }).catch(err => {
        console.error('Firestore connection failed:', err);
    });

    console.log('Testing Auth connection...');
    admin.auth().listUsers(1)
        .then(listUsersResult => {
            console.log('Auth connected! Found users:', listUsersResult.users.length);
        })
        .catch(error => {
            console.error('Auth connection failed:', error);
        });

} catch (error: any) {
    console.error('Diagnostic failed:', error);
}
