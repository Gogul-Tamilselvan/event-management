
'use server';

import { doc, deleteDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase";

type ActionResult = {
    success: boolean;
    error?: string;
};

export async function deleteEventAction(eventId: string): Promise<ActionResult> {
    try {
        const eventRef = doc(db, "events", eventId);
        await deleteDoc(eventRef);

        revalidatePath('/dashboard/organizer');

        return { success: true };
    } catch (e) {
        console.error("Event Deletion Error: ", e);
        const error = e instanceof Error ? e.message : "An unexpected error occurred.";
        return { success: false, error: error };
    }
}
