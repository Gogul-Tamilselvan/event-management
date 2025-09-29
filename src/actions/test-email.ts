'use server';

import { sendEventApprovalEmail } from "@/services/email";
import type { JoinRequest, Event } from "@/lib/data";
import { z } from "zod";

const TestEmailSchema = z.object({
  email: z.string().email("A valid email is required."),
});

type ActionResult = {
    success: boolean;
    error?: string;
};

export async function sendTestEmailAction(formData: FormData): Promise<ActionResult> {
    const rawFormData = Object.fromEntries(formData.entries());
    const validatedFields = TestEmailSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.errors.map((e) => e.message).join(', '),
        };
    }
    
    const { email } = validatedFields.data;

    try {
        // Create mock data for the email function
        const mockRequest: JoinRequest = {
            id: 'test-req-123',
            eventId: 'test-event-123',
            eventTitle: 'Test Event for EmailJS',
            attendeeId: 'test-user-123',
            attendeeName: 'Test User',
            attendeeEmail: email,
            organizerId: 'test-org-123',
            status: 'approved',
            requestedAt: new Date().toISOString(),
        };

        const mockEvent: Event = {
            id: 'test-event-123',
            title: 'Test Event for EmailJS',
            date: '2025-01-01',
            time: '10:00 - 12:00',
            location: 'The Internet',
            description: 'This is a test event.',
            organizer: 'Zenith Events Team',
            attendees: 1,
            capacity: 100,
            status: 'Approved',
            category: 'Technology',
            image: 'https://picsum.photos/seed/test/600/400',
            isPaid: false,
            price: 0,
        };

        await sendEventApprovalEmail(mockRequest, mockEvent);
        return { success: true };

    } catch (e) {
        console.error("Test Email Error: ", e);
        const error = e instanceof Error ? e.message : "An unexpected error occurred during the test email.";
        return { success: false, error: error };
    }
}
