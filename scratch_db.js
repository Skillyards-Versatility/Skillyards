require('dotenv').config({ path: '.env' });
const { db, users } = require('@repo/db');
const { isNotNull } = require('drizzle-orm');

async function test() {
  const [user] = await db.select().from(users).where(isNotNull(users.profileImageKey)).limit(1);
  console.log("Key:", user?.profileImageKey);
}
test();
