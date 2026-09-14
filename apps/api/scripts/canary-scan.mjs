import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_ROOT = path.join(__dirname, "../src/app/api");

const PROTECTED_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const BYPASS_ALLOWED_PATHS = [
  "api/health", // Public health check
  "api/auth", // Auth flow is public
];

function scanRoutes(dir) {
  const files = fs.readdirSync(dir);
  let failures = 0;

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      failures += scanRoutes(fullPath);
    } else if (file === "route.js") {
      const relativePath = path.relative(API_ROOT, fullPath);
      if (BYPASS_ALLOWED_PATHS.some((p) => relativePath.includes(p))) continue;

      const content = fs.readFileSync(fullPath, "utf8");

      for (const method of PROTECTED_METHODS) {
        // Regex to check for 'export async function GET' or 'export function GET'
        const rawExportRegex = new RegExp(
          `export\\s+(async\\s+)?function\\s+${method}`,
          "g",
        );

        if (rawExportRegex.test(content)) {
          console.error(
            `❌ SECURITY VULNERABILITY DETECTED: [${relativePath}]`,
          );
          console.error(`   - Raw export of ${method} detected.`);
          console.error(
            `   - MUST use 'export const ${method} = createProtectedRoute(...)'\n`,
          );
          failures++;
        }
      }
    }
  }

  return failures;
}

console.log("🕵️  Starting Security Canary Scan...");
const totalFailures = scanRoutes(API_ROOT);

if (totalFailures > 0) {
  console.error(`\n🚨 SCAN FAILED: ${totalFailures} unprotected routes found.`);
  process.exit(1);
} else {
  console.log(
    "\n✅ SECURITY SCAN PASSED: All routes are structurally protected.",
  );
}
