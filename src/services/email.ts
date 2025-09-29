
import type { JoinRequest, Event } from "@/lib/data";
import { createGoogleWalletAction } from "@/actions/google-wallet";

/**
 * Sends a confirmation email to an attendee when their request is approved.
 * 
 * This function integrates with SendGrid to send a real email.
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

    // --- Production Email Sending Logic (with SendGrid) ---
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
        console.error("SendGrid API key is not configured. Email not sent.");
        // Fallback to logging if no API key
        logMockEmail(attendeeEmail, subject, emailBody);
        return;
    }

    const emailData = {
        personalizations: [{ to: [{ email: attendeeEmail }] }],
        from: { email: "noreply@zenithevents.app", name: "Zenith Events" }, // Use a verified sender email on SendGrid
        subject: subject,
        content: [{ type: "text/html", value: emailBody }],
    };

    try {
        const fetch = (await import('node-fetch')).default;
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
}

function logMockEmail(to: string, subject: string, body: string) {
    console.log("--- Sending Mock Email (API Key Missing) ---");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log("Body:");
    console.log(body);
    console.log("---------------------------------------");
}
