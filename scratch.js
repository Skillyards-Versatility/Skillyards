require('dotenv').config();
const { db, counsellingSessions } = require('@repo/db');
const { desc } = require('drizzle-orm');
async function run() {
  const sessions = await db.select().from(counsellingSessions).orderBy(desc(counsellingSessions.createdAt)).limit(5);
  console.log(JSON.stringify(sessions, null, 2));
}
run();
