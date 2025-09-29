
import type { JoinRequest, Event } from "@/lib/data";
import { createGoogleWalletAction } from "@/actions/google-wallet";

/**
 * Sends a confirmation email to an attendee when their request is approved.
 * 
 * NOTE: This is a mock implementation for demonstration purposes. It logs the email
 * content to the console instead of sending a real email. In a real-world application,
 * you would integrate a third-party email service like SendGrid, Mailgun, or AWS SES.
 * 
 * @param request - The approved join request.
 * @param event - The event the user was approved for.
 */
export async function sendEventApprovalEmail(request: JoinRequest, event: Event): Promise<void> {
    const { attendeeEmail, attendeeName } = request;
    const { title } = event;

    // Simulate creating a Google Wallet pass link
    const walletResult = await createGoogleWalletAction(event, attendeeName);
    const walletUrl = walletResult.success ? walletResult.walletUrl : '#';

    const subject = `Your Ticket for ${title}!`;

    const emailBody = `
        <html>
            <body>
                <h1>Congratulations, ${attendeeName}!</h1>
                <p>Your ticket for <strong>${title}</strong> is ready. Please add it to your Google Wallet for easy access at the event.</p>
                
                <a href="${walletUrl}" target="_blank" style="display: inline-block; padding: 12px 24px; background-color: #4285f4; color: white; text-decoration: none; border-radius: 4px; font-size: 16px; font-weight: bold;">
                    Add to Google Wallet
                </a>
                
                <p>We look forward to seeing you there!</p>
                <p>Thanks,<br/>The Zenith Events Team</p>
            </body>
        </html>
    `;

    // --- Production Email Sending Logic (Example with SendGrid) ---
    // 1. Uncomment the following block.
    // 2. Make sure you have an API key in your .env file (EMAIL_API_KEY).
    // 3. You may need to add `node-fetch` or a specific SDK for your email provider.

    /*
    const apiKey = process.env.EMAIL_API_KEY;
    if (!apiKey) {
        console.error("Email API key is not configured. Email not sent.");
        // Fallback to logging if no API key
        logMockEmail(attendeeEmail, subject, emailBody);
        return;
    }

    const emailData = {
        personalizations: [{ to: [{ email: attendeeEmail }] }],
        from: { email: "noreply@zenithevents.app", name: "Zenith Events" }, // Use a verified sender email
        subject: subject,
        content: [{ type: "text/html", value: emailBody }],
    };

    try {
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`Failed to send email: ${response.statusText} - ${JSON.stringify(errorBody)}`);
        }

        console.log("--- Production Email Sent ---");
        console.log(`To: ${attendeeEmail}`);
        console.log("-------------------------");

    } catch (error) {
        console.error("Error sending production email:", error);
    }
    */

    // --- Mock Email Sending Logic (Logs to console) ---
    // This is the current implementation for development.
    // You can comment this out when you enable the production logic above.
    logMockEmail(attendeeEmail, subject, emailBody);

    return Promise.resolve();
}

function logMockEmail(to: string, subject: string, body: string) {
    console.log("--- Sending Mock Email ---");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log("Body:");
    console.log(body);
    console.log("-------------------------");
    console.log("NOTE: To send real emails, configure a provider in src/services/email.ts");
}
