
'use server';

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { JoinRequest } from "@/lib/data";

type ActionResult = {
    success: boolean;
    message: string;
    attendeeName?: string;
    status?: JoinRequest['status'];
};

export async function verifyAttendeeAction(joinRequestId: string): Promise<ActionResult> {
    try {
        const requestRef = doc(db, "joinRequests", joinRequestId);
        const requestSnap = await getDoc(requestRef);

        if (!requestSnap.exists()) {
            return { success: false, message: "Invalid QR Code. Attendee not found." };
        }

        const joinRequest = requestSnap.data() as JoinRequest;

        if (joinRequest.status === 'approved') {
            await updateDoc(requestRef, { status: 'attended' });
            return { 
                success: true, 
                message: `Successfully checked in.`,
                attendeeName: joinRequest.attendeeName,
                status: 'attended' 
            };
        }
        
        if (joinRequest.status === 'attended') {
            return { 
                success: false, 
                message: `This attendee has already been checked in.`,
                attendeeName: joinRequest.attendeeName,
                status: 'attended'
             };
        }

        return { 
            success: false, 
            message: `This attendee's request was not approved.`,
            attendeeName: joinRequest.attendeeName,
            status: joinRequest.status
        };

    } catch (e) {
        console.error("Attendee Verification Error: ", e);
        const error = e instanceof Error ? e.message : "An unexpected error occurred.";
        return { success: false, message: error };
    }
}
