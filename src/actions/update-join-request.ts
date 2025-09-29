
'use server';

import { doc, updateDoc, increment, getDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase";
import type { JoinRequest, Event } from "@/lib/data";

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

        const requestSnap = await getDoc(requestRef);
        if (!requestSnap.exists()) {
            return { success: false, error: `Join request with ID ${requestId} not found.` };
        }
        
        await updateDoc(requestRef, { status: status });

        if (status === 'approved') {
            const eventSnap = await getDoc(eventRef);
            if (!eventSnap.exists()) {
                 return { success: false, error: `Event with ID ${eventId} not found.` };
            }

            await updateDoc(eventRef, { attendees: increment(1) });
        }

        revalidatePath('/dashboard/organizer/attendees');

        return { success: true };
    } catch (e) {
        console.error("Join Request Update Error: ", e);
        const error = e instanceof Error ? e.message : "An unexpected error occurred.";
        return { success: false, error: error };
    }
}
