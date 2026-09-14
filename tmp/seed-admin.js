const bcrypt = require("bcryptjs");
const { Pool } = require("@neondatabase/serverless");
const dotenv = require("dotenv");
const path = require("path");

// Load .env from root
dotenv.config({ path: path.join(__dirname, "../.env") });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const pool = new Pool({ connectionString: databaseUrl });

async function seedAdmin() {
  const name = "Admin User";
  const email = "admin@skillyards.com";
  const plainPassword = "adminpassword123";
  const role = "ADMIN";

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  try {
    const res = await pool.query(
      `INSERT INTO users (name, email, password, role) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (email) DO UPDATE 
       SET password = $3, role = $4
       RETURNING id;`,
      [name, email, hashedPassword, role],
    );

    console.log(`Admin user seeded/updated: ${email}`);
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seedAdmin();
