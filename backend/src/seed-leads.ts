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

const leads = [
    {
        name: "Rajesh Kumar",
        phone: "919876543210",
        email: "rajesh.k@example.com",
        city: "Mumbai",
        product_type: "Health Insurance",
        status: "New",
        vehicle_details: { type: "Family Floater", sum_insured: "5 Lakhs" }
    },
    {
        name: "Priya Sharma",
        phone: "919876543211",
        email: "priya.s@example.com",
        city: "Delhi",
        product_type: "Motor Insurance",
        status: "Contacted",
        vehicle_details: { regNumber: "DL-01-AB-1234", make: "Maruti Swift" }
    },
    {
        name: "Amit Patel",
        phone: "919876543212",
        email: "amit.patel@example.com",
        city: "Ahmedabad",
        product_type: "Life Insurance",
        status: "Quote Shared",
        vehicle_details: { type: "Term Life", sum_insured: "1 Crore" }
    },
    {
        name: "Sneha Gupta",
        phone: "919876543213",
        email: "sneha.g@example.com",
        city: "Bangalore",
        product_type: "Health Insurance",
        status: "Converted",
        vehicle_details: { type: "Individual", sum_insured: "10 Lakhs" }
    },
    {
        name: "Vikram Singh",
        phone: "919876543214",
        email: "vikram.s@example.com",
        city: "Jaipur",
        product_type: "Motor Insurance",
        status: "New",
        vehicle_details: { regNumber: "RJ-14-XY-9876", make: "Hyundai Creta" }
    },
    {
        name: "Anjali Desai",
        phone: "919876543215",
        email: "anjali.d@example.com",
        city: "Mumbai",
        product_type: "Life Insurance",
        status: "Lost",
        vehicle_details: { type: "Endowment", sum_insured: "25 Lakhs" }
    },
    {
        name: "Rohan Mehta",
        phone: "919876543216",
        email: "rohan.m@example.com",
        city: "Pune",
        product_type: "Health Insurance",
        status: "New",
        vehicle_details: { type: "Senior Citizen", sum_insured: "5 Lakhs" }
    },
    {
        name: "Kavita Reddy",
        phone: "919876543217",
        email: "kavita.r@example.com",
        city: "Hyderabad",
        product_type: "Motor Insurance",
        status: "Contacted",
        vehicle_details: { regNumber: "TS-07-ZZ-5555", make: "Honda City" }
    },
    {
        name: "Arjun Nair",
        phone: "919876543218",
        email: "arjun.n@example.com",
        city: "Kochi",
        product_type: "Life Insurance",
        status: "New",
        vehicle_details: { type: "Term Life", sum_insured: "2 Crores" }
    },
    {
        name: "Meera Joshi",
        phone: "919876543219",
        email: "meera.j@example.com",
        city: "Pune",
        product_type: "Health Insurance",
        status: "Quote Shared",
        vehicle_details: { type: "Family Floater", sum_insured: "15 Lakhs" }
    }
];

async function seedLeads() {
    console.log('Seeding realistic leads...');

    for (const lead of leads) {
        const leadData = {
            ...lead,
            lead_source: 'manual-seed',
            tags: ['Seeded'],
            created_at: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(), // Random time in past ~10 days
            updated_at: new Date().toISOString()
        };

        await db.collection('leads').add(leadData);
        console.log(`Added lead: ${lead.name}`);
    }

    console.log('Done! Added 10 realistic leads.');
}

seedLeads().catch(console.error);
