
'use server';

import { doc, updateDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase";
import type { Event } from "@/lib/data";

type ActionResult = {
    success: boolean;
    error?: string;
};

export async function updateEventStatusAction(eventId: string, status: Event['status']): Promise<ActionResult> {
    try {
        if (!['Approved', 'Rejected'].includes(status)) {
            throw new Error("Invalid status update.");
        }
        
        const eventRef = doc(db, "events", eventId);
        await updateDoc(eventRef, { status: status });

        // Revalidate the admin dashboard page to show updated data
        revalidatePath('/dashboard/admin');

        return { success: true };
    } catch (e) {
        console.error("Event Status Update Error: ", e);
        const error = e instanceof Error ? e.message : "An unexpected error occurred.";
        return { success: false, error: error };
    }
}
