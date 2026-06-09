import { desc } from "drizzle-orm";
import { db, enquiries } from "../../../../../packages/db";

export async function createEnquiry(enquiryData) {
    try {
        const result = await db
            .insert(enquiries)
            .values(enquiryData)
            .returning()

        return result[0]

    } catch (err) {
        throw new Error("Failed to create enquiry: " + err.message);
    }
}

export async function getAllEnquiries() {
    try {
        const result = await db
            .select()
            .from(enquiries)
            .orderBy(desc(enquiries.createdAt));

        return result;
    } catch (err) {
        throw new Error("Failed to fetch enquiries: " + err.message);
    }
}

// export async function getEnquiryById(id) {
//     try {
//         const result = await db
//             .select()
//             .from(enquiries)
//             .where("id", id)
//             .first();

//         return result;
//     } catch (err) {
//         throw new Error("Failed to fetch enquiry: " + err.message);
//     }
// }

// export async function updateEnquiryStatus(id, status) {
//     try {
//         const result = await db
//             .update(enquiries)
//             .set({ status })
//             .where("id", id)
//             .returning();

//         return result[0];
//     } catch (err) {
//         throw new Error("Failed to update enquiry: " + err.message);
//     }
// }
