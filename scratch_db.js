require('dotenv').config({ path: 'apps/admin/.env.local' });
const { db, counsellingSessions } = require('@repo/db');
const { isNotNull } = require('drizzle-orm');

async function test() {
  const sessions = await db.select().from(counsellingSessions).where(isNotNull(counsellingSessions.imageKey)).limit(3);
  console.log("Keys:", sessions.map(s => s.imageKey));
}
test();
