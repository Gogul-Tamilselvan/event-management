'use server';

import { addDoc, collection } from "firebase/firestore";
import { z } from "zod";
import { db } from "@/lib/firebase";
import type { Event } from "@/lib/data";

const FormSchema = z.object({
    name: z.string().min(1, "Event name is required."),
    description: z.string().min(10, "Description must be at least 10 characters."),
    date: z.string().min(1, "Date is required."),
    time: z.string().min(1, "Time is required."),
    location: z.string().min(1, "Location is required."),
    category: z.string().min(1, "Category is required."),
    capacity: z.coerce.number().min(1, "Capacity must be at least 1."),
    image: z.string().url("A valid image URL is required."),
    isPaid: z.coerce.boolean(),
    price: z.coerce.number().optional(),
});

type ActionResult = {
    success: boolean;
    error?: string;
};

export async function createEventAction(formData: FormData, organizer: string): Promise<ActionResult> {
    const rawFormData = Object.fromEntries(formData.entries());

    const validatedFields = FormSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.errors.map((e) => e.message).join(', '),
        };
    }
    
    try {
        const { isPaid, price, ...rest } = validatedFields.data;
        const newEvent: Omit<Event, 'id'> = {
            title: rest.name,
            description: rest.description,
            date: rest.date,
            time: `${rest.time} - ${rest.time}`, // Placeholder for end time
            location: rest.location,
            category: rest.category,
            capacity: rest.capacity,
            image: rest.image,
            organizer: organizer,
            attendees: 0,
            status: 'Pending',
            isPaid: isPaid,
            price: isPaid ? price || 0 : 0,
        };

        await addDoc(collection(db, "events"), newEvent);

        return { success: true };
    } catch (e) {
        console.error("Event Creation Error: ", e);
        const error = e instanceof Error ? e.message : "An unexpected error occurred.";
        return { success: false, error: error };
    }
}
