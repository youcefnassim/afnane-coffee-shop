const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 1. Read environment variables from .env.local
const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf-8');
const urlMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.*)/);
const keyMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=\s*(.*)/);

if (!urlMatch || !keyMatch) {
  console.error("Error: Could not read Supabase configuration from .env.local");
  process.exit(1);
}

const supabaseUrl = urlMatch[1].trim();
const supabaseAnonKey = keyMatch[1].trim();

console.log("Connecting to Supabase at:", supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const categories = [
  { id: "pizza-sandwich", name: { fr: "Pizza & Sandwich", en: "Pizza & Sandwich", ar: "بيتزا وسندويش" }, icon: "🍕", sort_order: 1 },
  { id: "sucre", name: { fr: "Sucré", en: "Sweet", ar: "حلويات" }, icon: "🍰", sort_order: 2 },
  { id: "sale", name: { fr: "Salé", en: "Savory", ar: "موالح" }, icon: "🍔", sort_order: 3 },
  { id: "salades", name: { fr: "Salades", en: "Salads", ar: "سلطات" }, icon: "🥗", sort_order: 4 },
  { id: "cafe", name: { fr: "Café", en: "Coffee", ar: "قهوة" }, icon: "☕", sort_order: 5 },
  { id: "matcha", name: { fr: "Matcha", en: "Matcha", ar: "ماتشا" }, icon: "🍵", sort_order: 6 },
  { id: "ube", name: { fr: "Ubé", en: "Ube", ar: "أوبي" }, icon: "🍠", sort_order: 7 },
  { id: "milkshakes", name: { fr: "Milkshakes", en: "Milkshakes", ar: "ميلك شيك" }, icon: "🥤", sort_order: 8 },
  { id: "smoothies-bowls", name: { fr: "Smoothies & Bowls", en: "Smoothies & Bowls", ar: "سموذي وبول" }, icon: "🥑", sort_order: 9 },
  { id: "frappes", name: { fr: "Frappés", en: "Frappés", ar: "فرابيه" }, icon: "🧊", sort_order: 10 },
  { id: "toasts", name: { fr: "Toasts", en: "Toasts", ar: "توست" }, icon: "🍞", sort_order: 11 },
  { id: "omelettes", name: { fr: "Omelettes", en: "Omelettes", ar: "أومليت" }, icon: "🍳", sort_order: 12 },
  { id: "mocktails", name: { fr: "Mocktails", en: "Mocktails", ar: "موكتيل" }, icon: "🍹", sort_order: 13 },
  { id: "jus-presses", name: { fr: "Jus Pressés & Détox", en: "Fresh Juice & Detox", ar: "عصائر طبيعية" }, icon: "🍊", sort_order: 14 }
];

const products = [
  // Pizza & Sandwich
  {
    category_id: "pizza-sandwich",
    name: { fr: "Pizza au thon", en: "Tuna Pizza", ar: "بيتزا تونة" },
    description: { fr: "Sauce tomate, thon, mozzarella et origan", en: "Tomato sauce, tuna, mozzarella, and oregano", ar: "صلصة طماطم، تونة، موزاريلا وزعتر" },
    price: 950,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Pâte à pizza, sauce tomate, thon, mozzarella, origan", en: "Pizza dough, tomato sauce, tuna, mozzarella, oregano", ar: "عجينة البيتزا، صلصة الطماطم، التونة، جبنة الموزاريلا، الزعتر البري" }
  },
  {
    category_id: "pizza-sandwich",
    name: { fr: "Pizza Margherita", en: "Margherita Pizza", ar: "بيتزا مارغريتا" },
    description: { fr: "Sauce tomate maison, mozzarella fraîche et basilic", en: "Homemade tomato sauce, fresh mozzarella, and basil", ar: "صلصة طماطم منزلية، موزاريلا طازجة وريحان" },
    price: 750,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=800",
    available: true,
    best_seller: true,
    featured: true,
    promotion: false,
    ingredients: { fr: "Pâte à pizza, sauce tomate, mozzarella, basilic", en: "Pizza dough, tomato sauce, mozzarella, basil", ar: "عجينة البيتزا، صلصة الطماطم، جبنة الموزاريلا، الريحان" }
  },
  {
    category_id: "pizza-sandwich",
    name: { fr: "Mamaka chicken", en: "Mamaka Chicken Sandwich", ar: "ماماكا تشيكن" },
    description: { fr: "Sandwich gourmand préparé avec notre pâte à pizza maison, garni de poulet pané croustillant ou poulet grillé, accompagné de fromage fondant et de notre sauce maison • salade • tomate • oignon", en: "Gourmet sandwich with pizza dough, crispy pane chicken or grilled chicken, melted cheese, homemade sauce, salad, tomato, onion", ar: "سندويش محضر بعجينة البيتزا المنزلية، دجاج كريسبي أو مشوي، جبن ذائب، صلصة منزلية، سلطة، طماطم وبصل" },
    price: 1200,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1567256561270-17242d4f2c79?q=80&w=800",
    available: true,
    best_seller: true,
    featured: true,
    promotion: false,
    ingredients: { fr: "Pâte à pizza maison, poulet pané/grillé, fromage fondant, sauce maison, salade, tomate, oignon", en: "Homemade pizza dough, pane/grilled chicken, melted cheese, house sauce, salad, tomato, onion", ar: "عجينة بيتزا منزلية، دجاج مقلي/مشوي، جبن، صلصة خاصة، سلطة، طماطم، بصل" }
  },

  // Sucré
  {
    category_id: "sucre",
    name: { fr: "Waffle Duo Chocolat Caramel", en: "Chocolate Caramel Waffle Duo", ar: "وافل شوكولاتة وكاراميل" },
    description: { fr: "Waffle, sauce chocolat & caramel, crème à la vanille maison, cacahuètes caramélisées, noisettes grillées", en: "Waffle, chocolate & caramel sauce, homemade vanilla cream, caramelized peanuts, grilled hazelnuts", ar: "وافل، صلصة الشوكولاتة والكاراميل، كريمة الفانيليا المنزلية، فول سوداني مكرمل، بندق محمص" },
    price: 1400,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1562376502-6f769499c886?q=80&w=800",
    available: true,
    best_seller: true,
    featured: false,
    promotion: false,
    ingredients: { fr: "Gaufre, sauce chocolat, caramel, crème vanille, cacahuètes, noisettes", en: "Waffle, chocolate sauce, caramel, vanilla cream, peanuts, hazelnuts", ar: "وافل، صلصة شوكولاتة، كاراميل، كريمة فانيليا، فول سوداني، بندق" }
  },
  {
    category_id: "sucre",
    name: { fr: "Pancake Duo Chocolat Caramel", en: "Chocolate Caramel Pancake Duo", ar: "بانكيك شوكولاتة وكاراميل" },
    description: { fr: "Pancake (préparation minute • 15 à 20 min), sauce chocolat & caramel, crème à la vanille maison, cacahuètes caramélisées, noisettes grillées", en: "Freshly made pancakes, chocolate & caramel sauce, homemade vanilla cream, caramelized peanuts, grilled hazelnuts", ar: "بانكيك طازج، صلصة الشوكولاتة والكاراميل، كريمة الفانيليا المنزلية، فول سوداني مكرمل، بندق محمص" },
    price: 1400,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Pancakes, sauce chocolat, caramel, crème vanille, cacahuètes, noisettes", en: "Pancakes, chocolate sauce, caramel, vanilla cream, peanuts, hazelnuts", ar: "بانكيك، صلصة شوكولاتة، كاراميل، كريمة فانيليا، فول سوداني، بندق" }
  },
  {
    category_id: "sucre",
    name: { fr: "Brioche Caramel Doré", en: "Golden Caramel Brioche", ar: "بريوش كاراميل ذهبي" },
    description: { fr: "Brioche maison à la vanille, sauce caramel beurre salé, fruits de saison, crème à la vanille maison, cacahuètes caramélisées", en: "Homemade vanilla brioche, salted butter caramel sauce, seasonal fruits, homemade vanilla cream, caramelized peanuts", ar: "بريوش فانيليا منزلي، صلصة كاراميل زبدة مملحة، فواكه موسمية، كريمة فانيليا منزلية، فول سوداني مكرمل" },
    price: 1400,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=800",
    available: true,
    best_seller: false,
    featured: true,
    promotion: false,
    ingredients: { fr: "Brioche vanille, caramel beurre salé, fruits, crème vanille, cacahuètes", en: "Vanilla brioche, salted caramel, fruits, vanilla cream, peanuts", ar: "بريوش فانيليا، كاراميل زبدة مملحة، فواكه، كريمة فانيليا، فول سوداني" }
  },
  {
    category_id: "sucre",
    name: { fr: "Brioche Tiramisu", en: "Tiramisu Brioche", ar: "بريوش تيراميسو" },
    description: { fr: "Brioche maison, boudoirs de café, crème tiramisu au café, éclats de spéculoos, sauce caramel", en: "Homemade brioche, coffee biscuits, coffee tiramisu cream, speculoos crumbs, caramel sauce", ar: "بريوش منزلي، بسكويت قهوة، كريمة تيراميسو بالقهوة، فتات سبيكولوس، صلصة كاراميل" },
    price: 1500,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=800",
    available: true,
    best_seller: true,
    featured: true,
    promotion: false,
    ingredients: { fr: "Brioche, café, crème tiramisu, spéculoos, sauce caramel", en: "Brioche, coffee, tiramisu cream, speculoos, caramel sauce", ar: "بريوش، قهوة، كريمة تيراميسو، سبيكولوس، صلصة كاراميل" }
  },
  {
    category_id: "sucre",
    name: { fr: "Brioche Duo Gourmand", en: "Gourmet Duo Brioche", ar: "بريوش ثنائي جورماند" },
    description: { fr: "Brioche maison, sauce chocolat et pistache, crème à la vanille maison, noisettes grillées", en: "Homemade brioche, chocolate and pistachio sauce, homemade vanilla cream, grilled hazelnuts", ar: "بريوش منزلي، صلصة الشوكولاتة والفستق، كريمة الفانيليا المنزلية، بندق محمص" },
    price: 1400,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Brioche, sauce chocolat, sauce pistache, crème vanille, noisettes", en: "Brioche, chocolate sauce, pistachio sauce, vanilla cream, hazelnuts", ar: "بريوش، صلصة شوكولاتة، صلصة فستق، كريمة فانيليا، بندق" }
  },
  {
    category_id: "sucre",
    name: { fr: "La Dolce", en: "La Dolce Crepe", ar: "لا دولتشي" },
    description: { fr: "Tagliatelles de crêpe • chocolat • sauce pistache • fruits de saison • pistaches concassées • éclats de lotus et boule de glace", en: "Crepe ribbons, chocolate, pistachio sauce, seasonal fruits, crushed pistachios, lotus crumbs, ice cream scoop", ar: "شرائط الكريب، شوكولاتة، صلصة الفستق، فواكه موسمية، فستق مطحون، فتات اللوتس وكرة مثلجات" },
    price: 1200,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1562376502-6f769499c886?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Crêpe, chocolat, sauce pistache, fruits, pistaches, lotus, glace", en: "Crepe, chocolate, pistachio sauce, fruits, pistachios, lotus, ice cream", ar: "كريب، شوكولاتة، صلصة فستق، فواكه، فستق، لوتس، مثلجات" }
  },

  // Salé
  {
    category_id: "sale",
    name: { fr: "Brioche Maison (Saumon / Bacon)", en: "Salmon / Bacon Brioche", ar: "بريوش منزلي بالسمون أو الباكون" },
    description: { fr: "Brioche maison, guacamole, galette de pomme de terre, deux œufs mollets, sauce hollandaise, bacon ou saumon", en: "Homemade brioche, guacamole, potato patty, two soft-boiled eggs, hollandaise sauce, bacon or smoked salmon", ar: "بريوش منزلي، غواكامولي، قرص بطاطس، بيضتان مسلوقتان، صلصة هولنديز، باكون أو سلمون مدخن" },
    price: 1900,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=800",
    available: true,
    best_seller: true,
    featured: true,
    promotion: false,
    ingredients: { fr: "Brioche, guacamole, galette pomme de terre, œufs, sauce hollandaise, bacon/saumon", en: "Brioche, guacamole, potato patty, eggs, hollandaise, bacon/salmon", ar: "بريوش، غواكامولي، قرص بطاطس، بيض، صلصة هولنديز، باكون/سلمون" }
  },
  {
    category_id: "sale",
    name: { fr: "Les Trois Saveurs", en: "The Three Flavors Pancakes", ar: "النكهات الثلاث" },
    description: { fr: "Trois pancakes fluffy, guacamole saumon / fromage poulet crispy / épinards champignons sauce maison", en: "Three fluffy pancakes: guacamole & salmon, cheese & crispy chicken, spinach & mushrooms with house sauce", ar: "ثلاث حبات بانكيك رقيقة: غواكامولي وسلمون، جبن ودجاج كريسبي، سبانخ وفطر بصلصة خاصة" },
    price: 1800,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=800",
    available: true,
    best_seller: true,
    featured: false,
    promotion: false,
    ingredients: { fr: "Pancakes fluffy, saumon, poulet crispy, guacamole, fromage, épinards, champignons, sauce maison", en: "Fluffy pancakes, salmon, crispy chicken, guacamole, cheese, spinach, mushrooms, house sauce", ar: "بانكيك، سلمون، دجاج كريسبي، غواكامولي، جبن، سبانخ، فطر، صلصة منزلية" }
  },
  {
    category_id: "sale",
    name: { fr: "Brioche Forestière", en: "Forest Brioche", ar: "بريوش فوريستيار" },
    description: { fr: "Brioche maison, épinards, champignons, deux œufs mollets, sauce hollandaise", en: "Homemade brioche, spinach, mushrooms, two soft-boiled eggs, hollandaise sauce", ar: "بريوش منزلي، سبانخ، فطر، بيضتان مسلوقتان، صلصة هولنديز" },
    price: 1500,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Brioche, épinards, champignons, œufs, sauce hollandaise", en: "Brioche, spinach, mushrooms, eggs, hollandaise sauce", ar: "بريوش، سبانخ، فطر، بيض، صلصة هولنديز" }
  },
  {
    category_id: "sale",
    name: { fr: "Waffle Chicken", en: "Chicken Waffle", ar: "وافل دجاج" },
    description: { fr: "Gaufre salée garnie de poulet croustillant et de sauce maison", en: "Savory waffle topped with crispy chicken and house sauce", ar: "وافل مالح مع دجاج كريسبي وصلصة منزلية" },
    price: 1300,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1562376502-6f769499c886?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Gaufre, poulet pané, sauce maison", en: "Waffle, pane chicken, house sauce", ar: "وافل، دجاج مقلي، صلصة منزلية" }
  },
  {
    category_id: "sale",
    name: { fr: "Croissant Burger", en: "Croissant Burger", ar: "كرواسون برجر" },
    description: { fr: "Croissant au beurre, oignon caramélisé, laitue, tomate, viande hachée, fromage et sauce maison", en: "Butter croissant, caramelized onion, lettuce, tomato, minced beef, cheese, and house sauce", ar: "كرواسون بالزبدة، بصل مكرمل، خس، طماطم، لحم مفروم، جبن وصلصة منزلية" },
    price: 1200,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800",
    available: true,
    best_seller: false,
    featured: true,
    promotion: false,
    ingredients: { fr: "Croissant, viande hachée, fromage, oignon caramélisé, laitue, tomate, sauce", en: "Croissant, ground beef, cheese, caramelized onion, lettuce, tomato, sauce", ar: "كرواسون، لحم مفروم، جبن، بصل مكرمل، خس، طماطم، صلصة" }
  },
  {
    category_id: "sale",
    name: { fr: "Mamaka Quesa", en: "Mamaka Quesadilla", ar: "ماماكا كيساديلا" },
    description: { fr: "Quesadilla gourmande garnie de fromage fondant et de poulet avec sauce maison", en: "Gourmet quesadilla stuffed with melted cheese, chicken, and house sauce", ar: "كيساديلا لذيذة محشية بالجبن الذائب والدجاج مع صلصة منزلية" },
    price: 1200,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1567256561270-17242d4f2c79?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Tortilla, fromage, poulet, sauce", en: "Tortilla, cheese, chicken, sauce", ar: "تورتيلا، جبن، دجاج، صلصة" }
  },
  {
    category_id: "sale",
    name: { fr: "Chicken Burger", en: "Chicken Burger", ar: "تشيكن برجر" },
    description: { fr: "Pain maison au beurre, tartare de fromage, poulet crispy, laitue, tomate, œuf au plat, sauce maison, pickles d'oignon", en: "Homemade butter bun, cheese spread, crispy chicken, lettuce, tomato, fried egg, house sauce, pickled onion", ar: "خبز منزلي بالزبدة، جبن، دجاج كريسبي، خس، طماطم، بيض عيون، صلصة منزلية ومخلل البصل" },
    price: 900,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Pain burger, poulet pané, œuf au plat, fromage, laitue, tomate, pickles, sauce", en: "Burger bun, pane chicken, fried egg, cheese, lettuce, tomato, pickles, sauce", ar: "خبز برجر، دجاج مقلي، بيض مقلي، جبن، خس، طماطم، مخلل، صلصة" }
  },

  // Salades
  {
    category_id: "salades",
    name: { fr: "Salade Burrata", en: "Burrata Salad", ar: "سلطة البوراتا" },
    description: { fr: "Burrata, laitue, tomate cerise, sauce pesto maison, fruits de saison, sauce balsamique", en: "Burrata cheese, lettuce, cherry tomatoes, homemade pesto sauce, seasonal fruits, balsamic glaze", ar: "جبن بوراتا، خس، طماطم كرزية، صلصة بيستو منزلية، فواكه موسمية، صلصة بلسمية" },
    price: 1500,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800",
    available: true,
    best_seller: true,
    featured: true,
    promotion: false,
    ingredients: { fr: "Burrata, laitue, tomates cerises, pesto, fruits de saison, sauce balsamique", en: "Burrata, lettuce, cherry tomatoes, pesto, seasonal fruits, balsamic", ar: "بوراتا، خس، طماطم كرزية، بيستو، فواكه، بلسمك" }
  },
  {
    category_id: "salades",
    name: { fr: "Salade Tropicale", en: "Tropical Salad", ar: "سلطة استوائية" },
    description: { fr: "Laitue, concombre, mangue, croutons, poulet, maïs, chou rouge, feta", en: "Lettuce, cucumber, mango, croutons, chicken, corn, red cabbage, feta", ar: "خس، خيار، مانجو، قطع خبز محمص، دجاج، ذرة، ملفوف أحمر، جبنة فيتا" },
    price: 1100,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Laitue, mangue, concombre, poulet, maïs, chou, feta, croûtons", en: "Lettuce, mango, cucumber, chicken, corn, cabbage, feta, croutons", ar: "خس، مانجو، خيار، دجاج، ذرة، ملفوف، فيتا، خبز" }
  },
  {
    category_id: "salades",
    name: { fr: "Salade Mamaka", en: "Mamaka Salad", ar: "سلطة ماماكا" },
    description: { fr: "Laitue, cornichon, concombre, oignon, galette de pomme de terre avec sa sauce maison", en: "Lettuce, pickle, cucumber, onion, potato patty with homemade dressing", ar: "خس، مخلل، خيار، بصل، قرص بطاطس مع صلصة منزلية خاصة" },
    price: 1000,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Laitue, concombre, cornichons, oignons, galette de pomme de terre, sauce", en: "Lettuce, cucumber, pickles, onions, potato patty, dressing", ar: "خس، خيار، مخلل، بصل، قرص بطاطس، صلصة" }
  },

  // Café
  {
    category_id: "cafe",
    name: { fr: "Espresso", en: "Espresso", ar: "إسبريسو" },
    description: { fr: "Café court intense et riche en arômes", en: "Short, rich, and aromatic espresso shot", ar: "قهوة مركزة وغنية بالنكهات" },
    price: 300,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-151097252790b-af4f902673a1?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Grains de café torréfiés, eau chaude", en: "Roasted coffee beans, hot water", ar: "حبوب قهوة محمصة، ماء ساخن" }
  },
  {
    category_id: "cafe",
    name: { fr: "Americano", en: "Americano", ar: "أمركانو" },
    description: { fr: "Espresso allongé d'eau chaude pour un goût adouci", en: "Espresso shot diluted with hot water for a smooth taste", ar: "إسبريسو مخفف بالماء الساخن لنكهة أخف" },
    price: 400,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-151097252790b-af4f902673a1?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Espresso, eau chaude", en: "Espresso, hot water", ar: "إسبريسو، ماء ساخن" }
  },
  {
    category_id: "cafe",
    name: { fr: "Cappuccino", en: "Cappuccino", ar: "كابوتشينو" },
    description: { fr: "Tiers d'espresso, tiers de lait chaud et tiers de mousse de lait", en: "Equal parts of espresso, steamed milk, and milk foam", ar: "أجزاء متساوية من الإسبريسو، الحليب الساخن ورغوة الحليب" },
    price: 550,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800",
    available: true,
    best_seller: true,
    featured: true,
    promotion: false,
    ingredients: { fr: "Espresso, lait frais", en: "Espresso, fresh milk", ar: "إسبريسو، حليب طازج" }
  },
  {
    category_id: "cafe",
    name: { fr: "Cortado", en: "Cortado", ar: "كورتادو" },
    description: { fr: "Espresso coupé avec une quantité égale de lait chaud", en: "Espresso cut with an equal amount of warm milk", ar: "إسبريسو مع كمية مساوية له من الحليب الساخن" },
    price: 450,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-151097252790b-af4f902673a1?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Espresso, lait chaud", en: "Espresso, warm milk", ar: "إسبريسو، حليب ساخن" }
  },
  {
    category_id: "cafe",
    name: { fr: "Flat white", en: "Flat White", ar: "فلات وايت" },
    description: { fr: "Double shot d'espresso mélangé avec du lait micro-mousseux", en: "Double shot of espresso mixed with micro-foam milk", ar: "جرعة مضاعفة من الإسبريسو ممزوجة برغوة الحليب الرقيقة" },
    price: 450,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Double espresso, lait micro-mousse", en: "Double espresso, micro-foam milk", ar: "إسبريسو مضاعف، حليب رغوي" }
  },
  {
    category_id: "cafe",
    name: { fr: "Café Bonbon", en: "Cafe Bonbon", ar: "كافيه بونبون" },
    description: { fr: "Espresso marié à du lait concentré sucré", en: "Espresso layered with sweet condensed milk", ar: "إسبريسو ممزوج بالحليب المكثف المحلى" },
    price: 450,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-151097252790b-af4f902673a1?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Espresso, lait concentré sucré", en: "Espresso, sweetened condensed milk", ar: "إسبريسو، حليب مكثف محلى" }
  },
  {
    category_id: "cafe",
    name: { fr: "Café Latté", en: "Cafe Latte", ar: "لاتيه" },
    description: { fr: "Espresso avec une bonne dose de lait chaud et mousse fine", en: "Espresso shot with steamed milk and a thin layer of foam", ar: "إسبريسو مع كمية وفيرة من الحليب الساخن ورغوة رقيقة" },
    price: 450,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Espresso, lait chaud, mousse", en: "Espresso, steamed milk, foam", ar: "إسبريسو، حليب ساخن، رغوة" }
  },
  {
    category_id: "cafe",
    name: { fr: "Caramel Latté", en: "Caramel Latte", ar: "كاراميل لاتيه" },
    description: { fr: "Café latté onctueux aromatisé au caramel", en: "Creamy cafe latte infused with caramel syrup", ar: "لاتيه ناعم بنكهة الكاراميل" },
    price: 550,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Espresso, lait, sirop de caramel", en: "Espresso, milk, caramel syrup", ar: "إسبريسو، حليب، شراب الكاراميل" }
  },
  {
    category_id: "cafe",
    name: { fr: "Pistachio Latté", en: "Pistachio Latte", ar: "فستق لاتيه" },
    description: { fr: "Café latté gourmand à la crème de pistache", en: "Creamy cafe latte blended with pistachio sauce", ar: "لاتيه غني بنكهة كريمة الفستق" },
    price: 550,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800",
    available: true,
    best_seller: true,
    featured: true,
    promotion: false,
    ingredients: { fr: "Espresso, lait, sauce pistache", en: "Espresso, milk, pistachio sauce", ar: "إسبريسو، حليب، صلصة الفستق" }
  },
  {
    category_id: "cafe",
    name: { fr: "Speculoos Latté", en: "Speculoos Latte", ar: "سبيكولوس لاتيه" },
    description: { fr: "Café latté infusé aux biscuits spéculoos caramélisés", en: "Cafe latte mixed with speculoos biscuit spread", ar: "لاتيه بنكهة بسكويت السبيكولوس المكرمل" },
    price: 550,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Espresso, lait, pâte de spéculoos", en: "Espresso, milk, speculoos spread", ar: "إسبريسو، حليب، زبدة السبيكولوس" }
  },
  {
    category_id: "cafe",
    name: { fr: "Cinnamon Latté", en: "Cinnamon Latte", ar: "قرفة لاتيه" },
    description: { fr: "Latté parfumé à la cannelle moulue", en: "Steamed latte with ground cinnamon", ar: "لاتيه معطر بنكهة القرفة المطحونة" },
    price: 550,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Espresso, lait, cannelle", en: "Espresso, milk, cinnamon", ar: "إسبريسو، حليب، قرفة" }
  },
  {
    category_id: "cafe",
    name: { fr: "Tiramisu Latté", en: "Tiramisu Latte", ar: "تيراميسو لاتيه" },
    description: { fr: "Double espresso, lait mousseux et crème parfumée au tiramisu", en: "Double espresso, foamy milk, and tiramisu flavored cream", ar: "إسبريسو مضاعف، حليب رغوي وكريمة التيراميسو" },
    price: 600,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Espresso, lait, crème tiramisu, cacao", en: "Espresso, milk, tiramisu cream, cocoa", ar: "إسبريسو، حليب، كريمة تيراميسو، كاكاو" }
  },
  {
    category_id: "cafe",
    name: { fr: "Crème Brûlée Latté", en: "Creme Brulee Latte", ar: "كريم بروليه لاتيه" },
    description: { fr: "Latté sucré à la vanille, surmonté de sucre caramélisé au chalumeau", en: "Sweet vanilla latte topped with caramelized torched sugar", ar: "لاتيه حلو بالفانيليا مغطى بالسكر المكرمل" },
    price: 600,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Espresso, lait, saveur crème brûlée, sucre", en: "Espresso, milk, creme brulee syrup, sugar", ar: "إسبريسو، حليب، نكهة الكريم بروليه، سكر" }
  },
  {
    category_id: "cafe",
    name: { fr: "Iced Americano", en: "Iced Americano", ar: "أمركانو مثلج" },
    description: { fr: "Espresso allongé à l'eau froide et glaçons", en: "Espresso shot over cold water and ice", ar: "إسبريسو مخفف بالماء البارد ومكعبات الثلج" },
    price: 400,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Espresso, eau froide, glaçons", en: "Espresso, cold water, ice", ar: "إسبريسو، ماء بارد، ثلج" }
  },
  {
    category_id: "cafe",
    name: { fr: "Iced Café Latté", en: "Iced Cafe Latte", ar: "لاتيه مثلج" },
    description: { fr: "Espresso et lait frais versés sur de la glace", en: "Espresso shot and cold milk over ice", ar: "إسبريسو وحليب بارد يسكب فوق الثلج" },
    price: 500,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Espresso, lait froid, glaçons", en: "Espresso, cold milk, ice", ar: "إسبريسو، حليب بارد، ثلج" }
  },
  {
    category_id: "cafe",
    name: { fr: "Iced Spanish Latté", en: "Iced Spanish Latte", ar: "سبانيش لاتيه مثلج" },
    description: { fr: "Espresso glacé adouci au lait concentré sucré et lait frais", en: "Iced espresso sweetened with condensed milk and fresh milk", ar: "إسبريسو مثلج محلى بالحليب المكثف والحليب الطازج" },
    price: 550,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800",
    available: true,
    best_seller: true,
    featured: false,
    promotion: false,
    ingredients: { fr: "Espresso, lait concentré, lait, glaçons", en: "Espresso, condensed milk, milk, ice", ar: "إسبريسو، حليب مكثف، حليب، ثلج" }
  },
  {
    category_id: "cafe",
    name: { fr: "Iced Caramel Latté", en: "Iced Caramel Latte", ar: "كاراميل لاتيه مثلج" },
    price: 600,
    description: { fr: "Café latté glacé sucré au caramel", en: "Iced latte sweet with caramel", ar: "لاتيه مثلج محلى بالكاراميل" },
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Espresso, lait, caramel, glaçons", en: "Espresso, milk, caramel, ice", ar: "إسبريسو، حليب، كاراميل، ثلج" }
  },
  {
    category_id: "cafe",
    name: { fr: "Iced Pistachio Latté", en: "Iced Pistachio Latte", ar: "فستق لاتيه مثلج" },
    price: 600,
    description: { fr: "Café latté glacé gourmand à la pistache", en: "Iced latte rich with pistachio", ar: "لاتيه مثلج غني بالفستق" },
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Espresso, lait, pistache, glaçons", en: "Espresso, milk, pistachio, ice", ar: "إسبريسو، حليب، فستق، ثلج" }
  },
  {
    category_id: "cafe",
    name: { fr: "Iced Speculoos Latté", en: "Iced Speculoos Latte", ar: "سبيكولوس لاتيه مثلج" },
    price: 600,
    description: { fr: "Café latté glacé parfumé au spéculoos", en: "Iced latte flavored with speculoos", ar: "لاتيه مثلج بنكهة السبيكولوس" },
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Espresso, lait, spéculoos, glaçons", en: "Espresso, milk, speculoos, ice", ar: "إسبريسو، حليب، سبيكولوس، ثلج" }
  },
  {
    category_id: "cafe",
    name: { fr: "Iced Tiramisu Latté", en: "Iced Tiramisu Latte", ar: "تيراميسو لاتيه مثلج" },
    price: 700,
    description: { fr: "Café latté glacé crémeux façon tiramisu", en: "Iced latte creamy tiramisu style", ar: "لاتيه مثلج بطعم التيراميسو" },
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Espresso, lait, crème tiramisu, spéculoos, glaçons", en: "Espresso, milk, tiramisu cream, speculoos, ice", ar: "إسبريسو، حليب، كريمة تيراميسو، سبيكولوس، ثلج" }
  },
  {
    category_id: "cafe",
    name: { fr: "Iced Crème Brûlée Latté", en: "Iced Creme Brulee Latte", ar: "كريم بروليه لاتيه مثلج" },
    price: 700,
    description: { fr: "Café latté glacé au parfum de caramel brûlé", en: "Iced latte flavored with burnt caramel", ar: "لاتيه مثلج بطعم الكريم بروليه" },
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Espresso, lait, crème brûlée, caramel, glaçons", en: "Espresso, milk, creme brulee syrup, caramel, ice", ar: "إسبريسو، حليب، كريم بروليه، كاراميل، ثلج" }
  },
  {
    category_id: "cafe",
    name: { fr: "Chocolat chaud", en: "Hot Chocolate", ar: "شوكولاتة ساخنة" },
    description: { fr: "Chocolat crémeux et onctueux fait maison", en: "Rich and creamy homemade hot chocolate", ar: "شوكولاتة ساخنة منزلية الصنع" },
    price: 500,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Cacao premium, lait entier, sucre", en: "Premium cocoa, whole milk, sugar", ar: "بودرة الكاكاو، حليب، سكر" }
  },

  // Matcha
  {
    category_id: "matcha",
    name: { fr: "Iced Matcha Latté", en: "Iced Matcha Latte", ar: "ماتشا لاتيه مثلج" },
    description: { fr: "Poudre de matcha japonais fouettée et lait sur glace", en: "Japanese matcha powder whisked with milk over ice", ar: "بودرة الماتشا اليابانية المخفوقة مع الحليب والثلج" },
    price: 700,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=800",
    available: true,
    best_seller: true,
    featured: true,
    promotion: false,
    ingredients: { fr: "Matcha japonais, lait, glaçons", en: "Japanese matcha, milk, ice", ar: "ماتشا ياباني، حليب، ثلج" }
  },
  {
    category_id: "matcha",
    name: { fr: "Iced Matcha Aromatisé", en: "Iced Flavored Matcha", ar: "ماتشا مثلج بنكهات" },
    description: { fr: "Matcha glacé avec saveur au choix : caramel, vanille, pistache ou fraise", en: "Iced matcha with choice of flavor: caramel, vanilla, pistachio, or strawberry", ar: "ماتشا مثلج مع نكهة من اختيارك: كاراميل، فانيليا، فستق، أو فراولة" },
    price: 850,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Matcha, lait, sirop aromatisé, glaçons", en: "Matcha, milk, flavored syrup, ice", ar: "ماتشا، حليب، شراب نكهة، ثلج" }
  },

  // Ubé
  {
    category_id: "ube",
    name: { fr: "Iced Ubé Latté", en: "Iced Ube Latte", ar: "أوبي لاتيه مثلج" },
    description: { fr: "Lait à l'ube violet glacé doux et crémeux avec espresso", en: "Steamed ube milk with espresso shot over ice", ar: "حليب الأوبي البنفسجي الحلو مع الإسبريسو والثلج" },
    price: 650,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800",
    available: true,
    best_seller: false,
    featured: true,
    promotion: false,
    ingredients: { fr: "Ube, lait, espresso, glaçons", en: "Ube, milk, espresso, ice", ar: "أوبي، حليب، إسبريسو، ثلج" }
  },
  {
    category_id: "ube",
    name: { fr: "Iced Ubé Aromatisé", en: "Iced Flavored Ube", ar: "أوبي مثلج بنكهات" },
    description: { fr: "Ubé latté glacé parfumé au choix : caramel, vanille ou pistache", en: "Iced ube latte with choice of flavor: caramel, vanilla, or pistachio", ar: "أوبي لاتيه مثلج مع نكهة من اختيارك: كاراميل، فانيليا أو فستق" },
    price: 750,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Ube, lait, espresso, sirop aromatisé, glaçons", en: "Ube, milk, espresso, flavored syrup, ice", ar: "أوبي، حليب، إسبريسو، شراب نكهة، ثلج" }
  },

  // Milkshakes
  {
    category_id: "milkshakes",
    name: { fr: "Milkshake Chocolat", en: "Chocolate Milkshake", ar: "ميلك شيك شوكولاتة" },
    description: { fr: "Glace chocolat premium mixée avec du lait frais", en: "Premium chocolate ice cream blended with fresh milk", ar: "مثلجات الشوكولاتة الفاخرة ممزوجة مع الحليب" },
    price: 600,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Glace chocolat, lait, chantilly", en: "Chocolate ice cream, milk, whipped cream", ar: "مثلجات شوكولاتة، حليب، كريمة مخفوقة" }
  },
  {
    category_id: "milkshakes",
    name: { fr: "Milkshake Lotus Banane", en: "Lotus Banana Milkshake", ar: "ميلك شيك لوتس وموز" },
    description: { fr: "Glace vanille mixée avec des biscuits Lotus spéculoos et banane fraîche", en: "Vanilla ice cream blended with Lotus speculoos biscuits and fresh banana", ar: "مثلجات الفانيليا ممزوجة ببسكويت اللوتس وموز طازج" },
    price: 850,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=800",
    available: true,
    best_seller: true,
    featured: true,
    promotion: false,
    ingredients: { fr: "Glace, biscuit lotus, banane, lait", en: "Ice cream, lotus biscuit, banana, milk", ar: "مثلجات، بسكويت لوتس، موز، حليب" }
  },
  {
    category_id: "milkshakes",
    name: { fr: "Milkshake Pistache", en: "Pistachio Milkshake", ar: "ميلك شيك فستق" },
    description: { fr: "Glace à la pistache d'Italie et éclats de pistaches grillées", en: "Italian pistachio ice cream topped with roasted pistachio pieces", ar: "مثلجات الفستق الإيطالي مع قطع الفستق المحمص" },
    price: 800,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Glace pistache, lait, pistaches concassées", en: "Pistachio ice cream, milk, crushed pistachios", ar: "مثلجات الفستق، حليب، فستق مطحون" }
  },
  {
    category_id: "milkshakes",
    name: { fr: "Milkshake Chocolat Framboise", en: "Chocolate Raspberry Milkshake", ar: "ميلك شيك شوكولاتة وتوت" },
    description: { fr: "Mariage gourmand de chocolat et de coulis de framboises fraîches", en: "A delicious blend of chocolate and fresh raspberry coulis", ar: "مزيج من الشوكولاتة وتوت العليق الطازج" },
    price: 700,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Glace chocolat, coulis de framboise, lait", en: "Chocolate ice cream, raspberry sauce, milk", ar: "مثلجات شوكولاتة، صلصة التوت، حليب" }
  },

  // Smoothies
  {
    category_id: "smoothies-bowls",
    name: { fr: "Avobane", en: "Avobane Smoothie", ar: "أفوبان" },
    description: { fr: "Smoothie onctueux avocat, banane, lait d'amande et miel", en: "Creamy smoothie with avocado, banana, almond milk, and honey", ar: "سموذي ناعم بالأفوكادو والموز وحليب اللوز والعسل" },
    price: 900,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=800",
    available: true,
    best_seller: true,
    featured: true,
    promotion: false,
    ingredients: { fr: "Avocat, banane, lait d'amande, miel", en: "Avocado, banana, almond milk, honey", ar: "أفوكادو، موز، حليب اللوز، عسل" }
  },
  {
    category_id: "smoothies-bowls",
    name: { fr: "Bali Boost", en: "Bali Boost Smoothie", ar: "بالي بوست" },
    description: { fr: "Smoothie énergisant aux dattes, banane et graines de chia", en: "Energizing smoothie with dates, banana, and chia seeds", ar: "سموذي طاقة بالتمر والموز وبذور الشيا" },
    price: 800,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Dattes, banane, lait, graines de chia", en: "Dates, banana, milk, chia seeds", ar: "تمر، موز، حليب، بذور الشيا" }
  },
  {
    category_id: "smoothies-bowls",
    name: { fr: "Tropical", en: "Tropical Smoothie", ar: "سموذي استوائي" },
    description: { fr: "Mélange fruité de mangue et ananas pressés", en: "Fruity blend of squeezed mango and pineapple", ar: "مزيج فواكه من المانجو والأناناس" },
    price: 900,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Mangue, ananas, jus de pomme", en: "Mango, pineapple, apple juice", ar: "مانجو، أناناس، عصير تفاح" }
  },

  // Bowl
  {
    category_id: "smoothies-bowls",
    name: { fr: "Granola bowl", en: "Granola Bowl", ar: "جرانولا بول" },
    description: { fr: "Yaourt grec crémeux, granola croustillant maison, miel et fruits frais", en: "Creamy Greek yogurt, homemade crispy granola, honey, and fresh fruits", ar: "لبن يوناني، جرانولا مقرمشة منزلية الصنع، عسل وفواكه طازجة" },
    price: 800,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Yaourt grec, granola, miel, fruits de saison", en: "Greek yogurt, granola, honey, seasonal fruits", ar: "لبن يوناني، جرانولا، عسل، فواكه موسمية" }
  },

  // Frappé
  {
    category_id: "frappes",
    name: { fr: "Lotus Frappé", en: "Lotus Frappe", ar: "لوتس فرابيه" },
    description: { fr: "Boisson glacée frappée au biscuit Biscoff Lotus", en: "Ice blended coffee with Biscoff Lotus cookies", ar: "قهوة مثلجة ممزوجة ببسكويت اللوتس" },
    price: 800,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800",
    available: true,
    best_seller: true,
    featured: false,
    promotion: false,
    ingredients: { fr: "Lait, glace, biscuit lotus, café", en: "Milk, ice, lotus biscuit, coffee", ar: "حليب، ثلج، بسكويت لوتس، قهوة" }
  },
  {
    category_id: "frappes",
    name: { fr: "Chocolat Frappé", en: "Chocolate Frappe", ar: "شوكولاتة فرابيه" },
    price: 750,
    description: { fr: "Boisson chocolatée glacée et frappée", en: "Ice blended chocolate drink", ar: "شوكولاتة مثلجة مخفوقة" },
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Chocolat, lait, glace, chantilly", en: "Chocolate, milk, ice, whipped cream", ar: "شوكولاتة، حليب، ثلج، كريمة" }
  },
  {
    category_id: "frappes",
    name: { fr: "Pistache Frappé", en: "Pistachio Frappe", ar: "فستق فرابيه" },
    price: 750,
    description: { fr: "Boisson frappée glacée à la pistache", en: "Ice blended pistachio drink", ar: "فستق مثلج مخفوق" },
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Pistache, lait, glace", en: "Pistachio, milk, ice", ar: "فستق، حليب، ثلج" }
  },
  {
    category_id: "frappes",
    name: { fr: "Caramel Frappé", en: "Caramel Frappe", ar: "كاراميل فرابيه" },
    price: 750,
    description: { fr: "Boisson frappée glacée au caramel", en: "Ice blended caramel drink", ar: "كاراميل مثلج مخفوق" },
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Caramel, lait, glace, café", en: "Caramel, milk, ice, coffee", ar: "كاراميل، حليب، ثلج، قهوة" }
  },
  {
    category_id: "frappes",
    name: { fr: "Vanille Frappé", en: "Vanilla Frappe", ar: "فانيليا فرابيه" },
    price: 750,
    description: { fr: "Boisson frappée glacée à la vanille", en: "Ice blended vanilla drink", ar: "فانيليا مثلجة مخفوقة" },
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Vanille, lait, glace", en: "Vanilla, milk, ice", ar: "فانيليا، حليب، ثلج" }
  },

  // Toast
  {
    category_id: "toasts",
    name: { fr: "Toast Fresh", en: "Toast Fresh", ar: "توست فريش" },
    description: { fr: "Guacamole fêta, noisettes grillées, saumon fumé, miel, pickles d'oignon", en: "Guacamole, feta, toasted hazelnuts, smoked salmon, honey, pickled onions", ar: "غواكامولي، جبنة فيتا، بندق محمص، سلمون مدخن، عسل ومخلل البصل" },
    price: 1700,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800",
    available: true,
    best_seller: true,
    featured: true,
    promotion: false,
    ingredients: { fr: "Pain de campagne, guacamole, feta, noisettes, saumon, miel, oignons", en: "Sourdough, guacamole, feta, hazelnuts, salmon, honey, onions", ar: "خبز ريفي، غواكامولي، فيتا، بندق، سلمون، عسل، بصل" }
  },
  {
    category_id: "toasts",
    name: { fr: "Green Toast", en: "Green Toast", ar: "جرين توست" },
    description: { fr: "Guacamole, champignons aux herbes, épinards, œufs au plat", en: "Guacamole, herbed mushrooms, spinach, fried eggs", ar: "غواكامولي، فطر بالأعشاب، سبانخ، بيض عيون" },
    price: 1200,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Pain, guacamole, champignons, épinards, œufs", en: "Bread, guacamole, mushrooms, spinach, eggs", ar: "خبز، غواكامولي، فطر، سبانخ، بيض" }
  },
  {
    category_id: "toasts",
    name: { fr: "Toast Healthy", en: "Healthy Toast", ar: "توست صحي" },
    description: { fr: "Beurre de cacahuète, banane, graines de chia, miel", en: "Peanut butter, banana, chia seeds, honey", ar: "زبدة الفول السوداني، موز، بذور الشيا وعسل" },
    price: 800,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Pain, beurre de cacahuète, banane, chia, miel", en: "Bread, peanut butter, banana, chia, honey", ar: "خبز، زبدة فول سوداني، موز، شيا، عسل" }
  },

  // Omelettes
  {
    category_id: "omelettes",
    name: { fr: "Omelette du Jardin", en: "Garden Omelette", ar: "أومليت الحديقة" },
    description: { fr: "Œufs brouillés aux légumes (oignon, poivron vert, carotte) et fromage artisanal maison", en: "Scrambled eggs with vegetables (onion, green pepper, carrot) and homemade cheese", ar: "بيض مخفوق مع الخضار (بصل، فلفل أخدر، جزر) وجبن منزلي" },
    price: 1000,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Œufs, oignons, poivrons, carottes, fromage artisanal", en: "Eggs, onions, peppers, carrots, artisanal cheese", ar: "بيض، بصل، فلفل، جزر، جبن" }
  },
  {
    category_id: "omelettes",
    name: { fr: "Omelette Verte", en: "Green Omelette", ar: "أومليت خضراء" },
    description: { fr: "Omelette aux épinards, champignons, fromage et petite salade", en: "Omelette with spinach, mushrooms, cheese, and a side salad", ar: "أومليت بالسبانخ والفطر والجبن مع سلطة صغيرة" },
    price: 800,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Œufs, épinards, champignons, fromage, salade", en: "Eggs, spinach, mushrooms, cheese, salad", ar: "بيض، سبانخ، فطر، جبن، سلطة" }
  },
  {
    category_id: "omelettes",
    name: { fr: "Omelette Crémeuse", en: "Creamy Omelette", ar: "أومليت كريمية" },
    description: { fr: "Omelette moelleuse au fromage fondu, servie avec petite salade", en: "Fluffy omelette with melted cheese, served with a side salad", ar: "أومليت طرية بالجبن الذائب، تقدم مع سلطة صغيرة" },
    price: 700,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Œufs, fromage fondant, crème, salade", en: "Eggs, cheese, cream, salad", ar: "بيض، جبن، كريمة، سلطة" }
  },

  // Mocktails
  {
    category_id: "mocktails",
    name: { fr: "Mojito Classic", en: "Classic Mojito", ar: "موخيتو كلاسيك" },
    description: { fr: "Menthe fraîche, citron vert pressé, soda et glace pilée", en: "Fresh mint, squeezed lime, soda, and crushed ice", ar: "نعناع طازج، ليمون، صودا وثلج" },
    price: 600,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800",
    available: true,
    best_seller: true,
    featured: true,
    promotion: false,
    ingredients: { fr: "Citron vert, menthe, soda, sucre, glace", en: "Lime, mint, soda, sugar, ice", ar: "ليمون، نعناع، صودا، سكر، ثلج" }
  },
  {
    category_id: "mocktails",
    name: { fr: "Mojito Bleu Ocean", en: "Blue Ocean Mojito", ar: "موخيتو المحيط الأزرق" },
    price: 650,
    description: { fr: "Mojito rafraîchissant au sirop de curaçao bleu", en: "Refreshing mojito with blue curacao syrup", ar: "موخيتو منعش مع شراب الكوراساو الأزرق" },
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Citron, menthe, soda, curaçao bleu, glace", en: "Lime, mint, soda, blue curacao, ice", ar: "ليمون، نعناع، صودا، كوراساو أزرق، ثلج" }
  },
  {
    category_id: "mocktails",
    name: { fr: "Mojito Bleu Berry", en: "Blueberry Mojito", ar: "موخيتو توت بري" },
    price: 650,
    description: { fr: "Mojito aux notes de baies bleues fraîches", en: "Mojito with notes of fresh blueberries", ar: "موخيتو بنكهة التوت البري الأزرق" },
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Citron, menthe, soda, myrtilles, glace", en: "Lime, mint, soda, blueberries, ice", ar: "ليمون، نعناع، صودا، توت بري، ثلج" }
  },
  {
    category_id: "mocktails",
    name: { fr: "Mojito Strawberry", en: "Strawberry Mojito", ar: "موخيتو فراولة" },
    price: 650,
    description: { fr: "Mojito fruité à la fraise écrasée", en: "Fruity mojito with crushed strawberries", ar: "موخيتو فواكه بالفراولة المهروسة" },
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Citron, menthe, soda, fraises, glace", en: "Lime, mint, soda, strawberries, ice", ar: "ليمون، نعناع، صودا، فراولة، ثلج" }
  },
  {
    category_id: "mocktails",
    name: { fr: "Pina Colada", en: "Pina Colada", ar: "بينا كولادا" },
    description: { fr: "Cocktail onctueux ananas et crème de coco", en: "Creamy blend of pineapple juice and coconut cream", ar: "مزيج كريمي من عصير الأناناس وكريمة جوز الهند" },
    price: 650,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Jus d'ananas, crème de coco, glace", en: "Pineapple juice, coconut cream, ice", ar: "عصير أناناس، كريمة جوز الهند، ثلج" }
  },
  {
    category_id: "mocktails",
    name: { fr: "Blue Wave", en: "Blue Wave", ar: "بلو ويف" },
    description: { fr: "Cocktail tropical à base d'ananas et mangue", en: "Tropical mocktail made with pineapple and mango", ar: "كوكتيل استوائي من الأناناس والمانجو" },
    price: 600,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Ananas, mangue, sirop bleu, glace", en: "Pineapple, mango, blue syrup, ice", ar: "أناناس، مانجو، شراب أزرق، ثلج" }
  },
  {
    category_id: "mocktails",
    name: { fr: "Bora Bora", en: "Bora Bora", ar: "بورا بورا" },
    description: { fr: "Mélange exotique de jus de fruits tropicaux et grenadine", en: "Exotic blend of tropical fruit juices and grenadine", ar: "مزيج من عصير الفواكه الاستوائية والغرينادين" },
    price: 600,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Jus de passion, ananas, grenadine, glace", en: "Passion fruit juice, pineapple, grenadine, ice", ar: "عصير ماراكوجا، أناناس، غرينادين، ثلج" }
  },
  {
    category_id: "mocktails",
    name: { fr: "Mamaka Green Glow", en: "Mamaka Green Glow", ar: "ماماكا جرين جلو" },
    description: { fr: "Citron, mangue, fruit de la passion, orange, ananas", en: "Lime, mango, passion fruit, orange, pineapple", ar: "ليمون، مانجو، ماراكوجا، برتقال، أناناس" },
    price: 600,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Citron, mangue, passion, orange, ananas, glace", en: "Lime, mango, passion, orange, pineapple, ice", ar: "ليمون، مانجو، ماراكوجا، برتقال، أناناس، ثلج" }
  },
  {
    category_id: "mocktails",
    name: { fr: "Ice Tea Peach", en: "Peach Ice Tea", ar: "شاي مثلج بالخوخ" },
    description: { fr: "Thé infusé glacé saveur pêche", en: "Chilled brewed black tea flavored with sweet peach", ar: "شاي أسود بارد بنكهة الخوخ" },
    price: 800,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Thé noir, sirop de pêche, eau, glaçons", en: "Black tea, peach syrup, water, ice", ar: "شاي أسود، شراب الخوخ، ماء، ثلج" }
  },
  {
    category_id: "mocktails",
    name: { fr: "Mojito Énergétique", en: "Energy Mojito", ar: "موخيتو طاقة" },
    description: { fr: "Mojito classique boosté à la boisson énergisante", en: "Classic mojito boosted with energy drink", ar: "موخيتو كلاسيكي مدعم بمشروب الطاقة" },
    price: 1000,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Citron, menthe, boisson énergisante, glace", en: "Lime, mint, energy drink, ice", ar: "ليمون، نعناع، مشروب طاقة، ثلج" }
  },

  // Jus Pressés
  {
    category_id: "jus-presses",
    name: { fr: "Jus d'orange", en: "Orange Juice", ar: "عصير برتقال" },
    description: { fr: "Oranges fraîches pressées à la minute", en: "Freshly squeezed oranges", ar: "برتقال طازج معصور" },
    price: 550,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Oranges fraîches", en: "Fresh oranges", ar: "برتقال طازج" }
  },
  {
    category_id: "jus-presses",
    name: { fr: "Jus de citron", en: "Lemon Juice", ar: "عصير ليمون" },
    description: { fr: "Citrons frais pressés", en: "Freshly squeezed lemons", ar: "ليمون طازج معصور" },
    price: 500,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Citrons frais, eau, sucre", en: "Fresh lemons, water, sugar", ar: "ليمون طازج، ماء، سكر" }
  },
  {
    category_id: "jus-presses",
    name: { fr: "Jus de citron menthe", en: "Mint Lemonade", ar: "ليمون بالنعناع" },
    description: { fr: "Jus de citron pressé mixé avec de la menthe fraîche", en: "Fresh lemon juice blended with fresh mint", ar: "عصير الليمون ممزوج بالنعناع الطازج" },
    price: 600,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800",
    available: true,
    best_seller: true,
    featured: false,
    promotion: false,
    ingredients: { fr: "Citrons, menthe fraîche, eau, sucre", en: "Lemons, fresh mint, water, sugar", ar: "ليمون، نعناع طازج، ماء، سكر" }
  },
  {
    category_id: "jus-presses",
    name: { fr: "Jus d'orange & carotte", en: "Orange & Carrot Juice", ar: "عصير برتقال وجزر" },
    description: { fr: "Mélange vitaminé d'orange et carotte pressées", en: "Vitamin-rich blend of fresh orange and carrot", ar: "عصير برتقال وجزر طازج غني بالفيتامينات" },
    price: 600,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Oranges, carottes", en: "Oranges, carrots", ar: "برتقال، جزر" }
  },
  {
    category_id: "jus-presses",
    name: { fr: "Cocktail de fruits", en: "Fruit Cocktail", ar: "كوكتيل فواكه" },
    description: { fr: "Mélange gourmand de fruits frais de saison mixés", en: "Freshly blended seasonal fruits cocktail", ar: "مزيج من فواكه الموسم الطازجة" },
    price: 700,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Fruits frais assortis de saison", en: "Assorted fresh seasonal fruits", ar: "فواكه موسمية طازجة مشكلة" }
  },
  {
    category_id: "jus-presses",
    name: { fr: "Ubud Sunrise (Détox)", en: "Ubud Sunrise", ar: "أوبود سانرايز" },
    description: { fr: "Mélange détox orange, mangue et une touche de cannelle", en: "Detox blend of orange, mango, and a touch of cinnamon", ar: "عصير ديتوكس برتقال ومانجو مع لمسة قرفة" },
    price: 800,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Orange, mangue, cannelle", en: "Orange, mango, cinnamon", ar: "برتقال، مانجو، قرفة" }
  },
  {
    category_id: "jus-presses",
    name: { fr: "Golden Bali (Détox)", en: "Golden Bali", ar: "جولدن بالي" },
    description: { fr: "Mélange détox pressé orange, pomme et gingembre", en: "Detox blend of fresh orange, apple, and ginger", ar: "عصير ديتوكس برتقال وتفاح وزنجبيل" },
    price: 800,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Orange, pomme, gingembre", en: "Orange, apple, ginger", ar: "برتقال، تفاح، زنجبيل" }
  },
  {
    category_id: "jus-presses",
    name: { fr: "Green Cleanse (Détox)", en: "Green Cleanse", ar: "جرين كلينز" },
    description: { fr: "Mélange détox concombre, menthe et citron", en: "Detox blend of cucumber, mint, and lemon", ar: "عصير ديتوكس خيار ونعناع وليمون" },
    price: 800,
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800",
    available: true,
    best_seller: false,
    featured: false,
    promotion: false,
    ingredients: { fr: "Concombre, menthe, citron", en: "Cucumber, mint, lemon", ar: "خيار، نعناع، ليمون" }
  }
];

async function main() {
  try {
    // 1. Delete all existing products
    console.log("Deleting existing products...");
    const { error: delProdError } = await supabase
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (delProdError) throw delProdError;
    console.log("Successfully deleted products.");

    // 2. Delete all existing categories
    console.log("Deleting existing categories...");
    const { error: delCatError } = await supabase
      .from('categories')
      .delete()
      .neq('id', 'none'); // Delete all

    if (delCatError) throw delCatError;
    console.log("Successfully deleted categories.");

    // 3. Insert new categories
    console.log("Inserting new Mamaka categories...");
    const { error: insertCatError } = await supabase
      .from('categories')
      .insert(categories);

    if (insertCatError) throw insertCatError;
    console.log(`Successfully inserted ${categories.length} categories.`);

    // 4. Insert new products
    console.log("Inserting new Mamaka products...");
    const { error: insertProdError } = await supabase
      .from('products')
      .insert(products);

    if (insertProdError) throw insertProdError;
    console.log(`Successfully inserted ${products.length} products.`);

    console.log("Database successfully populated with Mamaka menu! 🎉");
  } catch (error) {
    console.error("Error populating database:", error);
    process.exit(1);
  }
}

main();
