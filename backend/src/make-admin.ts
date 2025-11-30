import * as admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

// Initialize Firebase
try {
    let serviceAccount: any;
    let keyPath = '';
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY.trim().startsWith('{')) {
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        } else {
            keyPath = path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        }
    } else {
        keyPath = path.resolve(__dirname, '../serviceAccountKey.json');
    }

    if (keyPath && fs.existsSync(keyPath)) {
        serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf-8'));
    }

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: serviceAccount.project_id
        });
    }
} catch (error) {
    console.error('Init failed', error);
}

const db = admin.firestore();

async function makeAdmin(email: string) {
    console.log(`Looking for user with email: ${email}`);
    const snapshot = await db.collection('users').where('email', '==', email).get();

    if (snapshot.empty) {
        console.log('User not found!');
        return;
    }

    const userDoc = snapshot.docs[0];
    await userDoc.ref.update({ role: 'admin' });
    console.log(`SUCCESS: User ${email} is now an ADMIN.`);
}

// Usage: npx ts-node src/make-admin.ts <email>
const targetEmail = process.argv[2];

if (!targetEmail) {
    console.error('Please provide an email address.');
    console.error('Usage: npx ts-node src/make-admin.ts <email>');
    process.exit(1);
}

makeAdmin(targetEmail).catch(console.error);
