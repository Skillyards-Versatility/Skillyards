import "dotenv/config";
import { db, enquiries } from "@skillyards/db";

async function seed() {
  await db.insert(enquiries).values([
    {
      firstName: "Rahul",
      lastName: "Sharma",
      email: "rahul@gmail.com",
      phone: "9876543210",
      message: "I want information about digital marketing course",
    },
    {
      firstName: "Anjali",
      lastName: "Gupta",
      email: "anjali@gmail.com",
      phone: "9123456780",
      message: "Please send details for data science programme",
    },
  ]);

  console.log("Dummy enquiries inserted");
  process.exit();
}

seed();
