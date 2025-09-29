
'use server';

import { z } from "zod";
import { sendEventApprovalEmail } from "@/services/email";
import type { Event, JoinRequest } from "@/lib/data";

const FormSchema = z.object({
    email: z.string().email("A valid email address is required."),
});

type ActionResult = {
    success: boolean;
    error?: string;
};

export async function testEmailAction(formData: FormData): Promise<ActionResult> {
    const rawFormData = Object.fromEntries(formData.entries());

    const validatedFields = FormSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.errors.map((e) => e.message).join(', '),
        };
    }
    
    try {
        const { email } = validatedFields.data;

        // Create mock data for the email service
        const mockEvent: Event = {
            id: 'evt_test_123',
            title: 'Test Event',
            date: new Date().toISOString(),
            time: '10:00 AM - 12:00 PM',
            location: 'Virtual',
            description: 'This is a test event for email functionality.',
            organizer: 'Zenith Events Admin',
            attendees: 1,
            capacity: 100,
            status: 'Approved',
            category: 'Technology',
            image: 'https://picsum.photos/seed/test/600/400',
            isPaid: false,
            price: 0,
        };

        const mockRequest: JoinRequest = {
            id: 'req_test_123',
            eventId: mockEvent.id,
            eventTitle: mockEvent.title,
            attendeeId: 'usr_test_123',
            attendeeName: 'Test Attendee',
            attendeeEmail: email,
            organizerId: 'org_test_123',
            status: 'approved',
            requestedAt: new Date().toISOString(),
        };

        await sendEventApprovalEmail(mockRequest, mockEvent);

        return { success: true };
    } catch (e) {
        console.error("Test Email Error: ", e);
        const error = e instanceof Error ? e.message : "An unexpected error occurred.";
        return { success: false, error: error };
    }
}
