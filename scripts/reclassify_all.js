const fs = require('fs');
const path = require('path');

// 1. Update src/app/menu/page.tsx
const menuPath = path.join(__dirname, '../src/app/menu/page.tsx');
if (fs.existsSync(menuPath)) {
  let content = fs.readFileSync(menuPath, 'utf8');
  const startIdx = content.indexOf('const FALLBACK_CATEGORIES = [');
  const endIdx = content.indexOf('];', startIdx);
  if (startIdx !== -1 && endIdx !== -1) {
    const newFallbackCatsStr = `const FALLBACK_CATEGORIES = [
  { id: "all", name: "Tous", icon: "🍽️" },
  { id: "coffee", name: "Boissons chaudes", icon: "☕" },
  { id: "cold-drinks", name: "Boissons fresh", icon: "🧊" },
  { id: "mocktails", name: "Mocktail", icon: "🍹" },
  { id: "smoothies", name: "Smoothies", icon: "🥑" },
  { id: "milkshakes", name: "Milkshakes", icon: "🥤" },
  { id: "desserts", name: "Gâteaux (viennoiserie)", icon: "🍰" },
  { id: "snacks-sales", name: "Salés", icon: "🍕" },
]`;
    content = content.substring(0, startIdx) + newFallbackCatsStr + content.substring(endIdx + 2);
    fs.writeFileSync(menuPath, content, 'utf8');
    console.log("Updated src/app/menu/page.tsx");
  }
}

// 2. Update src/components/home/CategoriesGrid.tsx
const gridPath = path.join(__dirname, '../src/components/home/CategoriesGrid.tsx');
if (fs.existsSync(gridPath)) {
  let content = fs.readFileSync(gridPath, 'utf8');
  const startIdx = content.indexOf('const fallbackCats = [');
  const endIdx = content.indexOf('];', startIdx);
  if (startIdx !== -1 && endIdx !== -1) {
    const newGridCatsStr = `const fallbackCats = [
        { id: "coffee", name: { fr: "Boissons chaudes" }, icon: "☕" },
        { id: "cold-drinks", name: { fr: "Boissons fresh" }, icon: "🧊" },
        { id: "mocktails", name: { fr: "Mocktail" }, icon: "🍹" },
        { id: "smoothies", name: { fr: "Smoothies" }, icon: "🥑" },
        { id: "milkshakes", name: { fr: "Milkshakes" }, icon: "🥤" },
        { id: "desserts", name: { fr: "Gâteaux (viennoiserie)" }, icon: "🍰" },
        { id: "snacks-sales", name: { fr: "Salés" }, icon: "🍕" },
      ]`;
    content = content.substring(0, startIdx) + newGridCatsStr + content.substring(endIdx + 2);
    fs.writeFileSync(gridPath, content, 'utf8');
    console.log("Updated src/components/home/CategoriesGrid.tsx");
  }
}

// 3. Update src/app/admin/categories/page.tsx
const adminCatsPath = path.join(__dirname, '../src/app/admin/categories/page.tsx');
if (fs.existsSync(adminCatsPath)) {
  let content = fs.readFileSync(adminCatsPath, 'utf8');
  const startIdx = content.indexOf('const DEFAULT_CATEGORIES: AdminCategory[] = [');
  const endIdx = content.indexOf('];', startIdx);
  if (startIdx !== -1 && endIdx !== -1) {
    const newDefaultCatsStr = `const DEFAULT_CATEGORIES: AdminCategory[] = [
  { id: "coffee", name: "Boissons chaudes", icon: "☕", itemCount: 0, status: "Active" },
  { id: "cold-drinks", name: "Boissons fresh", icon: "🧊", itemCount: 0, status: "Active" },
  { id: "mocktails", name: "Mocktail", icon: "🍹", itemCount: 0, status: "Active" },
  { id: "smoothies", name: "Smoothies", icon: "🥑", itemCount: 0, status: "Active" },
  { id: "milkshakes", name: "Milkshakes", icon: "🥤", itemCount: 0, status: "Active" },
  { id: "desserts", name: "Gâteaux (viennoiserie)", icon: "🍰", itemCount: 0, status: "Active" },
  { id: "snacks-sales", name: "Salés", icon: "🍕", itemCount: 0, status: "Active" },
]`;
    content = content.substring(0, startIdx) + newDefaultCatsStr + content.substring(endIdx + 2);
    fs.writeFileSync(adminCatsPath, content, 'utf8');
    console.log("Updated src/app/admin/categories/page.tsx");
  }
}

// 4. Update src/app/admin/products/page.tsx
const adminProdsPath = path.join(__dirname, '../src/app/admin/products/page.tsx');
if (fs.existsSync(adminProdsPath)) {
  let content = fs.readFileSync(adminProdsPath, 'utf8');
  const listRegex = /setCategories\(\[\s*\{\s*id:\s*"coffee",[\s\S]*?\}\s*\]\);/g;
  const listReplacement = `setCategories([
            { id: "coffee", name: "Boissons chaudes" },
            { id: "cold-drinks", name: "Boissons fresh" },
            { id: "mocktails", name: "Mocktail" },
            { id: "smoothies", name: "Smoothies" },
            { id: "milkshakes", name: "Milkshakes" },
            { id: "desserts", name: "Gâteaux (viennoiserie)" },
            { id: "snacks-sales", name: "Salés" },
          ]);`;
  content = content.replace(listRegex, listReplacement);
  fs.writeFileSync(adminProdsPath, content, 'utf8');
  console.log("Updated src/app/admin/products/page.tsx");
}

// 5. Update src/app/admin/products/new/page.tsx
const adminNewProdPath = path.join(__dirname, '../src/app/admin/products/new/page.tsx');
if (fs.existsSync(adminNewProdPath)) {
  let content = fs.readFileSync(adminNewProdPath, 'utf8');
  const listRegex = /const mapped = \[\s*\{\s*id:\s*"coffee",[\s\S]*?\}\s*\];/g;
  const listReplacement = `const mapped = [
          { id: "coffee", name: "Boissons chaudes" },
          { id: "cold-drinks", name: "Boissons fresh" },
          { id: "mocktails", name: "Mocktail" },
          { id: "smoothies", name: "Smoothies" },
          { id: "milkshakes", name: "Milkshakes" },
          { id: "desserts", name: "Gâteaux (viennoiserie)" },
          { id: "snacks-sales", name: "Salés" },
        ];`;
  content = content.replace(listRegex, listReplacement);
  fs.writeFileSync(adminNewProdPath, content, 'utf8');
  console.log("Updated src/app/admin/products/new/page.tsx");
}
