
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
    const { title, date, time, location } = event;

    // Simulate creating a Google Wallet pass link
    const walletResult = await createGoogleWalletAction(event, attendeeName);
    const walletUrl = walletResult.success ? walletResult.walletUrl : '#';

    const subject = `Confirmation: You're in for ${title}!`;

    const emailBody = `
        <html>
            <body>
                <h1>Congratulations, ${attendeeName}!</h1>
                <p>Your request to join <strong>${title}</strong> has been approved.</p>
                <h2>Event Details:</h2>
                <ul>
                    <li><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
                    <li><strong>Time:</strong> ${time}</li>
                    <li><strong>Location:</strong> ${location}</li>
                </ul>
                <p>We're excited to see you there!</p>
                
                <a href="${walletUrl}" target="_blank">
                    <button style="padding: 10px 20px; background-color: #4285f4; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Add to Google Wallet
                    </button>
                </a>
                
                <p>Thanks,<br/>The Zenith Events Team</p>
            </body>
        </html>
    `;

    // In a real implementation, you would use an email API here.
    console.log("--- Sending Mock Email ---");
    console.log(`To: ${attendeeEmail}`);
    console.log(`Subject: ${subject}`);
    console.log("Body:");
    console.log(emailBody);
    console.log("-------------------------");

    // This return signifies that the "email has been sent".
    return Promise.resolve();
}
