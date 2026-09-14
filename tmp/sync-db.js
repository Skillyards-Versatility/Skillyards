const { execSync } = require("child_process");
const dotenv = require("dotenv");
const path = require("path");

// Load .env from root
dotenv.config({ path: path.join(__dirname, "../.env") });

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

try {
  console.log("Pushing schema to database...");
  execSync("npx drizzle-kit push", {
    cwd: path.join(__dirname, "../packages/db"),
    stdio: "inherit",
    env: process.env,
  });
  console.log("Schema pushed successfully!");
} catch (error) {
  console.error("Migration failed:", error.message);
  process.exit(1);
}
