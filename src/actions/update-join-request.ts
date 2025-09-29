
'use server';

import { doc, updateDoc, increment, getDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase";
import type { JoinRequest, Event } from "@/lib/data";
import { sendEventApprovalEmail } from "@/services/email";

type ActionResult = {
    success: boolean;
    error?: string;
};

export async function updateJoinRequestAction(requestId: string, status: JoinRequest['status'], eventId: string): Promise<ActionResult> {
    try {
        if (!['approved', 'rejected'].includes(status)) {
            throw new Error("Invalid status update.");
        }
        
        const requestRef = doc(db, "joinRequests", requestId);
        const eventRef = doc(db, "events", eventId);

        // Check if documents exist before attempting to update
        const requestSnap = await getDoc(requestRef);
        if (!requestSnap.exists()) {
            return { success: false, error: `Join request with ID ${requestId} not found.` };
        }
        
        // Update the request status
        await updateDoc(requestRef, { status: status });

        // If approved, increment the attendees count for the event and send email
        if (status === 'approved') {
            const eventSnap = await getDoc(eventRef);
            if (!eventSnap.exists()) {
                 return { success: false, error: `Event with ID ${eventId} not found.` };
            }

            await updateDoc(eventRef, { attendees: increment(1) });
            
            const event = { id: eventSnap.id, ...eventSnap.data() } as Event;
            const request = requestSnap.data() as JoinRequest;
            
            // Send email. If it fails, the error will propagate.
            await sendEventApprovalEmail(request, event);
        }

        revalidatePath('/dashboard/organizer/attendees');

        return { success: true };
    } catch (e) {
        console.error("Join Request Update Error: ", e);
        const error = e instanceof Error ? e.message : "An unexpected error occurred.";
        return { success: false, error };
    }
}
