const fs = require('fs');

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  // Regex to match git conflict markers and keep HEAD
  const regex = /<<<<<<< HEAD\n([\s\S]*?)=======\n[\s\S]*?>>>>>>>[^\n]*\n/g;
  content = content.replace(regex, '$1');
  
  try {
    JSON.parse(content);
    fs.writeFileSync(file, content);
    console.log(`Fixed ${file}`);
  } catch(e) {
    console.error(`Still invalid ${file}: ${e.message}`);
    // If still invalid, try keeping the other side
    let content2 = fs.readFileSync(file, 'utf8');
    const regex2 = /<<<<<<< HEAD\n[\s\S]*?=======\n([\s\S]*?)>>>>>>>[^\n]*\n/g;
    content2 = content2.replace(regex2, '$1');
    try {
      JSON.parse(content2);
      fs.writeFileSync(file, content2);
      console.log(`Fixed ${file} (kept incoming)`);
    } catch(e2) {
      console.error(`Incoming also invalid ${file}: ${e2.message}`);
    }
  }
}

fixFile('packages/db/migrations/meta/0020_snapshot.json');
fixFile('packages/db/migrations/meta/0021_snapshot.json');
