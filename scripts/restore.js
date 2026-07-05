const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'original_store.ts');
const destPath = path.join(__dirname, '../src/store/useProductStore.ts');

if (fs.existsSync(srcPath)) {
  let content = fs.readFileSync(srcPath, 'utf8');
  // Replace category_id: "snacks" and id: "snacks"
  content = content.replace(/category_id:\s*['"]snacks['"]/g, 'category_id: "snacks-sales"');
  content = content.replace(/id:\s*['"]snacks['"]/g, 'id: "snacks-sales"');
  fs.writeFileSync(destPath, content, 'utf8');
  console.log("Successfully restored useProductStore.ts!");
} else {
  console.error("original_store.ts not found!");
}
