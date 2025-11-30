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

async function promoteAllToAdmin() {
    console.log('--- PROMOTING ALL USERS TO ADMIN ---');
    try {
        const usersSnapshot = await db.collection('users').get();

        if (usersSnapshot.empty) {
            console.log('No users found in database.');
            return;
        }

        const batch = db.batch();
        let count = 0;

        usersSnapshot.forEach(doc => {
            const userData = doc.data();
            console.log(`Promoting user: ${userData.email} (${doc.id})`);
            batch.set(doc.ref, { role: 'admin' }, { merge: true });
            count++;
        });

        await batch.commit();
        console.log(`Successfully promoted ${count} users to Admin.`);

    } catch (error) {
        console.error('Error promoting users:', error);
    }
}

promoteAllToAdmin();
