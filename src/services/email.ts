
import type { JoinRequest, Event } from "@/lib/data";
import { createGoogleWalletAction } from "@/actions/google-wallet";

/**
 * Sends a confirmation email to an attendee when their request is approved.
 * This function is set up to use SendGrid.
 * 
 * @param request - The approved join request.
 * @param event - The event the user was approved for.
 */
export async function sendEventApprovalEmail(request: JoinRequest, event: Event): Promise<void> {
    // --- Production Email Sending Logic ---
    await sendProductionEmail(request, event);
}

/**
 * Logs a mock email to the console for development purposes.
 */
function logMockEmail(recipient: string, eventTitle: string, walletUrl: string) {
    console.log("--- Mock Email Sent ---");
    console.log(`To: ${recipient}`);
    console.log(`From: noreply@zenithevents.app`);
    console.log(`Subject: Your Ticket for ${eventTitle}!`);
    console.log(`Body: Congratulations! Your ticket is ready. Add to wallet: ${walletUrl}`);
    console.log("-----------------------");
}


/**
 * Sends a real email using SendGrid.
 */
async function sendProductionEmail(request: JoinRequest, event: Event): Promise<void> {
    const { attendeeEmail, attendeeName } = request;
    const { title } = event;

    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
        const errorMessage = "SendGrid API key is not configured. Email not sent.";
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
    
    const walletResult = await createGoogleWalletAction(event, attendeeName);
    if (!walletResult.success || !walletResult.walletUrl) {
         throw new Error("Could not create Google Wallet pass.");
    }

    const emailBody = `
        <html>
            <body>
                <h1>Congratulations, ${attendeeName}!</h1>
                <p>Your ticket for <strong>${title}</strong> is ready. Please add it to your Google Wallet for easy access at the event.</p>
                
                <a href="${walletResult.walletUrl}" target="_blank" style="display: inline-block; padding: 12px 24px; background-color: #4285f4; color: white; text-decoration: none; border-radius: 4px; font-size: 16px; font-weight: bold;">
                    Add to Google Wallet
                </a>
                
                <p>We look forward to seeing you there!</p>
                <p>Thanks,<br/>The Zenith Events Team</p>
            </body>
        </html>
    `;

    const emailData = {
        personalizations: [{ to: [{ email: attendeeEmail }] }],
        from: { email: "noreply@zenithevents.app", name: "Zenith Events" },
        subject: `Your Ticket for ${title}!`,
        content: [{ type: "text/html", value: emailBody }],
    };

    try {
        console.log("Attempting to send email via SendGrid...");
        const fetch = (await import('node-fetch')).default;
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
        });

        if (response.status === 403) {
            console.error("SendGrid API key is invalid or the sender is not verified.");
            throw new Error("Email configuration error (Forbidden): The API key may be invalid or the 'From' email address is not verified in SendGrid.");
        }

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("SendGrid error response:", JSON.stringify(errorBody, null, 2));
            throw new Error(`Failed to send email: ${response.statusText}`);
        }

        console.log(`--- Production Email Sent to ${attendeeEmail} ---`);

    } catch (error) {
        console.error("Error sending production email:", error);
        throw error;
    }
}
