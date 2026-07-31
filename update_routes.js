const fs = require('fs');

const routes = {
  'students/page.js': 'students_feature',
  'enquiries/page.js': 'enquiries_feature',
  'calls/page.js': 'calls_feature',
  'team/page.js': 'team_feature',
  'eod/page.js': 'eod_feature',
  'eod/analytics/page.js': 'eod_analytics_feature',
  'counselling/page.js': 'counselling_feature',
  'leaves/page.js': 'leaves_feature',
  'breaks/page.js': 'breaks_feature',
  'users/page.js': 'users_feature'
};

const basePath = 'apps/admin/src/app/(authenticated)/';

for (const [route, flag] of Object.entries(routes)) {
  const filePath = basePath + route;
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${filePath}, does not exist`);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf8');

  // Add imports if missing
  if (!content.includes('getSettings')) {
    content = `import { getSettings } from "@/actions/settings";\n` + content;
  }
  if (!content.includes('import { redirect }')) {
    content = `import { redirect } from "next/navigation";\n` + content;
  }

  // Find export default async function
  const exportRegex = /export\s+default\s+(async\s+)?function\s+(\w+)?\s*\([^)]*\)\s*\{/;
  const match = content.match(exportRegex);
  
  if (match) {
    // Check if we already injected
    if (content.includes(`settings.${flag} === false`)) {
        console.log(`Already injected in ${filePath}`);
        continue;
    }

    const injectCode = `\n  const settings = await getSettings();\n  if (settings.${flag} === false) redirect("/dashboard");\n`;
    const insertionPoint = match.index + match[0].length;
    
    // Ensure the function is async
    let newContent = content;
    if (!match[1]) {
      newContent = newContent.replace(/export\s+default\s+function/, 'export default async function');
    }
    
    newContent = newContent.substring(0, insertionPoint) + injectCode + newContent.substring(insertionPoint);
    fs.writeFileSync(filePath, newContent);
    console.log(`Updated ${filePath}`);
  } else {
    console.log(`Could not find export default in ${filePath}`);
  }
}
