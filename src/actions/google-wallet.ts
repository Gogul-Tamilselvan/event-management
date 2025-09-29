
'use server';

import type { Event } from "@/lib/data";
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

// These values must be set in your .env file
const ISSUER_ID = process.env.GOOGLE_WALLET_ISSUER_ID;
const SERVICE_ACCOUNT_EMAIL = process.env.GCP_SERVICE_ACCOUNT_EMAIL;
// The private key must be correctly formatted in the .env file (e.g., wrap in quotes and handle newlines with \n)
const SERVICE_ACCOUNT_KEY = process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n');

// This should be a unique ID for the pass class you create in the Google Wallet Console.
const PASS_CLASS_ID = process.env.GOOGLE_WALLET_PASS_CLASS_ID;

const createWalletObject = (event: Event, attendeeName: string) => {
    if (!ISSUER_ID || !PASS_CLASS_ID || !SERVICE_ACCOUNT_EMAIL || !SERVICE_ACCOUNT_KEY) {
        throw new Error("Missing Google Wallet environment variables. Please check your .env file.");
    }
    
    const objectId = `${ISSUER_ID}.${uuidv4()}`;
    const classId = `${ISSUER_ID}.${PASS_CLASS_ID}`;
    
    // In a real app, the origin should be your app's domain
    const origin = process.env.NODE_ENV === 'production' ? 'https://your-app-domain.com' : 'http://localhost:9002';
    
    const walletObject = {
        "id": objectId,
        "classId": classId,
        "genericType": "GENERIC_TYPE_UNSPECIFIED",
        "hexBackgroundColor": "#4285f4",
        "logo": {
            "sourceUri": {
                "uri": "https://firebasestorage.googleapis.com/v0/b/zenith-official.appspot.com/o/logo.png?alt=media&token=1646a7b7-a098-44c2-9513-39d749a296b3"
            },
            "contentDescription": { "defaultValue": { "language": "en", "value": "Zenith Events Logo" } }
        },
        "cardTitle": { "defaultValue": { "language": "en", "value": event.title } },
        "subheader": { "defaultValue": { "language": "en", "value": "Attendee" } },
        "header": { "defaultValue": { "language": "en", "value": attendeeName.toUpperCase() } },
        "heroImage": {
            "sourceUri": { "uri": event.image },
            "contentDescription": { "defaultValue": { "language": "en", "value": `Image for ${event.title}` } }
        },
        "textModulesData": [
            { "header": "DATE", "body": new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), "id": "date" },
            { "header": "LOCATION", "body": event.location, "id": "location" },
            { "header": "EVENT", "body": event.title, "id": "event_name" }
        ]
    };
    
    const payload = {
        "iss": SERVICE_ACCOUNT_EMAIL,
        "aud": "google",
        "typ": "savetowallet",
        "origins": [origin],
        "payload": {
            "genericObjects": [ walletObject ]
        }
    };
    
    const token = jwt.sign(payload, SERVICE_ACCOUNT_KEY, { algorithm: 'RS256' });
    
    return token;
}


type ActionResult = {
    success: boolean;
    walletUrl?: string;
    error?: string;
};

export async function createGoogleWalletAction(event: Event, attendeeName: string): Promise<ActionResult> {
    try {
        const signedJwt = createWalletObject(event, attendeeName);
        const walletUrl = `https://pay.google.com/gp/v/save/${signedJwt}`;

        return { success: true, walletUrl };
    } catch (e) {
        console.error("Google Wallet Action Error: ", e);
        const error = e instanceof Error ? e.message : "An unexpected error occurred. Ensure your Google Wallet environment variables are set correctly.";
        return { success: false, error };
    }
}
