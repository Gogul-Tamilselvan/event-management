
import type { JoinRequest, Event } from "@/lib/data";
import { createGoogleWalletAction } from "@/actions/google-wallet";

/**
 * Sends a confirmation email to an attendee when their request is approved.
 * This function is set up to use EmailJS.
 * 
 * @param request - The approved join request.
 * @param event - The event the user was approved for.
 */
export async function sendEventApprovalEmail(request: JoinRequest, event: Event): Promise<void> {
    // --- Mock Email Sending Logic for Development ---
    // This will be used until the EmailJS account settings are updated.
    const walletResult = await createGoogleWalletAction(event, request.attendeeName);
    logMockEmail(request.attendeeEmail, event.title, walletResult.walletUrl ?? "http://mock-wallet-link.com");


    // --- Production Email Sending Logic (Currently disabled) ---
    /*
    try {
        await sendProductionEmail(request, event);
    } catch (error) {
        console.error("Failed to send production email:", error);
        // Re-throw the error to ensure the calling action knows about the failure.
        throw error;
    }
    */
}

/**
 * Logs a mock email to the console for development purposes.
 */
function logMockEmail(recipient: string, eventTitle: string, walletUrl:string) {
    console.log("--- MOCK EMAIL SENT (EmailJS configuration pending) ---");
    console.log(`To: ${recipient}`);
    console.log(`From: (Zenith Events via Mock Service)`);
    console.log(`Subject: Your Ticket for ${eventTitle}!`);
    console.log(`Body: Congratulations! Your ticket is ready. You can add it to your Google Wallet here: ${walletUrl}`);
    console.log("----------------------------------------------------");
}


/**
 * Sends a real email using the EmailJS REST API from the server.
 * NOTE: This is currently disabled.
 */
async function sendProductionEmail(request: JoinRequest, event: Event): Promise<void> {
    const { attendeeEmail, attendeeName } = request;
    const { title } = event;

    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY;


    if (!serviceId || !templateId || !publicKey || !privateKey || privateKey === 'your_private_key_here') {
        const errorMessage = "EmailJS credentials are not fully configured in .env. Email not sent.";
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
    
    const walletResult = await createGoogleWalletAction(event, attendeeName);
    if (!walletResult.success || !walletResult.walletUrl) {
         throw new Error("Could not create Google Wallet pass for the email.");
    }

    const templateParams = {
        to_name: attendeeName,
        to_email: attendeeEmail,
        event_title: title,
        wallet_url: walletResult.walletUrl,
    };

    const emailData = {
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: templateParams,
        accessToken: privateKey,
    };

    try {
        console.log("Attempting to send email via EmailJS REST API...");
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("EmailJS error response:", errorText);
            throw new Error(`Failed to send email: ${response.statusText} - ${errorText}`);
        }

        console.log(`--- Production Email Sent to ${attendeeEmail} via EmailJS ---`);

    } catch (error) {
        console.error("Error sending production email with EmailJS REST API:", error);
        throw error;
    }
}
