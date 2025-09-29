
'use server';

import { doc, updateDoc, increment } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase";
import type { JoinRequest } from "@/lib/data";

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
        await updateDoc(requestRef, { status: status });

        // If approved, increment the attendees count for the event
        if (status === 'approved') {
            const eventRef = doc(db, "events", eventId);
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
