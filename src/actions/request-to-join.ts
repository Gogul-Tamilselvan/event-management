
'use server';

import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { z } from "zod";
import { db } from "@/lib/firebase";
import type { Event, User } from "@/lib/data";

const FormSchema = z.object({
    eventId: z.string().min(1),
    attendeeId: z.string().min(1),
});

type ActionResult = {
    success: boolean;
    error?: string;
};

export async function requestToJoinAction(formData: FormData): Promise<ActionResult> {
    const rawFormData = Object.fromEntries(formData.entries());

    const validatedFields = FormSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
        return {
            success: false,
            error: "Invalid data provided.",
        };
    }
    
    try {
        const { eventId, attendeeId } = validatedFields.data;

        // Fetch event and user details
        const eventRef = doc(db, "events", eventId);
        const eventSnap = await getDoc(eventRef);

        const userRef = doc(db, "users", attendeeId);
        const userSnap = await getDoc(userRef);

        if (!eventSnap.exists() || !userSnap.exists()) {
            return { success: false, error: "Event or User not found." };
        }
        const eventData = eventSnap.data() as Event;
        const userData = userSnap.data() as User;
        
        // Find organizer's user record to get their ID
        // This is a simplification. In a real app, you might query for the organizer user by name.
        const organizerUserDoc = (await getDocs(collection(db, "users"))).docs.find(d => d.data().name === eventData.organizer);
        if (!organizerUserDoc) {
             return { success: false, error: "Organizer not found." };
        }

        const newRequest = {
            eventId: eventId,
            eventTitle: eventData.title,
            attendeeId: attendeeId,
            attendeeName: userData.name,
            attendeeEmail: userData.email,
            organizerId: organizerUserDoc.id,
            status: 'pending',
            requestedAt: new Date().toISOString(),
        };

        await addDoc(collection(db, "joinRequests"), newRequest);

        return { success: true };
    } catch (e) {
        console.error("Join Request Error: ", e);
        const error = e instanceof Error ? e.message : "An unexpected error occurred.";
        return { success: false, error: error };
    }
}
