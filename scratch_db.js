require('dotenv').config({ path: 'apps/admin/.env.local' });
const { db, users } = require('@repo/db');
const { isNotNull } = require('drizzle-orm');

async function test() {
  const allUsers = await db.select({ name: users.name, profileImageKey: users.profileImageKey }).from(users);
  console.log("Total users:", allUsers.length);
  console.log("Users with photos:", allUsers.filter(u => u.profileImageKey !== null).length);
  console.log("Details:");
  allUsers.forEach(u => {
    console.log(u.name, "->", u.profileImageKey);
  });
}
test();
