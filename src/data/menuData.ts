export interface MenuItem {
  dish_name: string;
  description: string;
  veg_or_nonveg: string;
  dressing: string;
  crunch_topping: string;
  price: number;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    sugar: number;
  };
  tags: string;
  recipe_link: string;
  image_opened_url: string;
  image_closed_url: string;
}

export interface SubCategory {
  name: string;
  products: MenuItem[];
}

export interface MenuCategory {
  category: string;
  subcategories: SubCategory[];
}

// Complete menu data organized by categories and subcategories
export const menuData: MenuCategory[] = [
  {
    "category": "Salads",
    "subcategories": [
      {
        "name": "High Protein",
        "products": [
          {
            "dish_name": "Paneer Power Bowl",
            "description": "A robust salad packed with grilled paneer and a medley of protein-rich legumes for sustained energy.",
            "veg_or_nonveg": "Veg",
            "dressing": "Mint-Coriander Yogurt Raita",
            "crunch_topping": "Roasted Pumpkin Seeds",
            "price": 369,
            "macros": {
              "calories": 420,
              "protein": 28,
              "carbs": 35,
              "fat": 20,
              "sugar": 5
            },
            "tags": "v, gf, hp",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/tJ3KR8Rv/1-PANEER-POWER-BOWL.png",
            "image_closed_url": "https://i.postimg.cc/ydpZ9B4b/1-PANEER-POWER-BOWL.png"
          },
          {
            "dish_name": "Chicken Chargrill Feast",
            "description": "Succulent grilled chicken breast with a vibrant mix of greens and a protein punch from eggs and lentils.",
            "veg_or_nonveg": "Non-Veg",
            "dressing": "Curry Leaf Chimichurri",
            "crunch_topping": "Toasted Almond Flakes",
            "price": 419,
            "macros": {
              "calories": 450,
              "protein": 38,
              "carbs": 25,
              "fat": 22,
              "sugar": 3
            },
            "tags": "hp, gf",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/wMjX3m9K/10-MADRAS-CHICKEN-TIKKA.png",
            "image_closed_url": "https://i.postimg.cc/sXWMBWmv/10-Madras-Chicken-Tikka.png"
          },
          {
            "dish_name": "Tofu & Edamame Zing",
            "description": "A vegan delight featuring pan-seared tofu and edamame, offering a complete protein profile with fresh veggies.",
            "veg_or_nonveg": "Veg",
            "dressing": "Peanut-Sesame Chutney Vinaigrette",
            "crunch_topping": "Crispy Fried Onions",
            "price": 349,
            "macros": {
              "calories": 390,
              "protein": 25,
              "carbs": 30,
              "fat": 18,
              "sugar": 6
            },
            "tags": "v, df, hp, gf",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/26kYbzMR/100-MEDITERRANEAN-MEZZE-PLATTER.png",
            "image_closed_url": "https://i.postimg.cc/tRh1ph7c/11-Aam-Papad-Quinoa-Salad.png"
          },
          {
            "dish_name": "Spiced Chickpea & Quinoa",
            "description": "A hearty vegetarian option with spiced chickpeas and quinoa, rich in plant-based protein and fiber.",
            "veg_or_nonveg": "Veg",
            "dressing": "Tamarind-Date Vinaigrette",
            "crunch_topping": "Roasted Cashew Halves",
            "price": 329,
            "macros": {
              "calories": 380,
              "protein": 22,
              "carbs": 45,
              "fat": 12,
              "sugar": 8
            },
            "tags": "v, gf, hp, wl",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/L40S5FVw/101-PROTEIN-ADD-ONS.png",
            "image_closed_url": "https://i.postimg.cc/L62JXn18/12-Spicy-Chana-Chaat-Salad.png"
          },
          {
            "dish_name": "Smoked Salmon & Avocado",
            "description": "Premium smoked salmon and creamy avocado paired with a nutrient-dense base for a high-protein, healthy fat meal.",
            "veg_or_nonveg": "Non-Veg",
            "dressing": "Lemon-Dill Yogurt Dressing",
            "crunch_topping": "Hemp Seeds",
            "price": 429,
            "macros": {
              "calories": 480,
              "protein": 35,
              "carbs": 15,
              "fat": 30,
              "sugar": 4
            },
            "tags": "hp, gf",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/m2vG33JS/102-OVERNIGHT-MUESLI-BOWL.png",
            "image_closed_url": "https://i.postimg.cc/bNgs2pxH/13-Moringa-Millet-Medley.png"
          },
          {
            "dish_name": "Lentil & Feta Medley",
            "description": "A Mediterranean-inspired salad with protein-packed lentils and savory feta, perfect for a balanced meal.",
            "veg_or_nonveg": "Veg",
            "dressing": "Balsamic Herb Vinaigrette",
            "crunch_topping": "Toasted Walnuts",
            "price": 339,
            "macros": {
              "calories": 370,
              "protein": 20,
              "carbs": 38,
              "fat": 15,
              "sugar": 6
            },
            "tags": "v, gf, hp",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/3w75V8K4/103-KETO-PANEER-SKEWERS.png",
            "image_closed_url": "https://i.postimg.cc/t4fRhTYP/14-Desi-Beetroot-Peanut.png"
          },
          {
            "dish_name": "Sprouts & Seed Power",
            "description": "A light yet potent salad featuring a variety of sprouts and seeds for a concentrated protein and nutrient boost.",
            "veg_or_nonveg": "Veg",
            "dressing": "Lemon-Ginger Vinaigrette",
            "crunch_topping": "Mixed Roasted Seeds (Flax, Chia, Sunflower)",
            "price": 299,
            "macros": {
              "calories": 310,
              "protein": 18,
              "carbs": 30,
              "fat": 12,
              "sugar": 5
            },
            "tags": "v, gf, hp, wl",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/QtdLNfKj/104-SWEET-POTATO-FRIES.png",
            "image_closed_url": "https://i.postimg.cc/zBwJZFpS/15-Spiced-Grilled-Fish-Salad.png"
          },
          {
            "dish_name": "Grilled Halloumi & Berry",
            "description": "Grilled halloumi cheese offers a satisfying protein, complemented by fresh berries and a vibrant green base.",
            "veg_or_nonveg": "Veg",
            "dressing": "Raspberry Balsamic Dressing",
            "crunch_topping": "Candied Pecans",
            "price": 379,
            "macros": {
              "calories": 400,
              "protein": 26,
              "carbs": 30,
              "fat": 20,
              "sugar": 10
            },
            "tags": "v, hp, gf",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/8P3RPc33/11-AAM-PAPAD-QUINOA.png",
            "image_closed_url": "https://i.postimg.cc/KjJx4c61/16-Curry-Leaf-Coconut-Crunch.png"
          }
        ]
      },
      {
        "name": "Fusion Indian",
        "products": [
          {
            "dish_name": "Tandoori Paneer Delight",
            "description": "Classic tandoori paneer meets fresh greens in a vibrant, Indian-inspired salad with a smoky twist.",
            "veg_or_nonveg": "Veg",
            "dressing": "Mint & Tamarind Chutney Dressing",
            "crunch_topping": "Crispy Sev",
            "price": 349,
            "macros": {
              "calories": 350,
              "protein": 20,
              "carbs": 25,
              "fat": 18,
              "sugar": 8
            },
            "tags": "v, gf",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/bv0kTTJc/12-SPICY-CHANA-CHAAT.png",
            "image_closed_url": "https://i.postimg.cc/qBLk1QNp/17-Methi-Sprout-Medley.png"
          },
          {
            "dish_name": "Madras Chicken Tikka",
            "description": "Juicy chicken tikka pieces tossed with crisp vegetables and a zesty, South Indian-inspired dressing.",
            "veg_or_nonveg": "Non-Veg",
            "dressing": "Curry Leaf Chimichurri",
            "crunch_topping": "Roasted Peanuts",
            "price": 399,
            "macros": {
              "calories": 390,
              "protein": 30,
              "carbs": 20,
              "fat": 20,
              "sugar": 4
            },
            "tags": "hp, gf",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/1t96Yqng/13-MORINGA-MILLET-MEDLEY.png",
            "image_closed_url": "https://i.postimg.cc/7Ytqk61c/18-Bitter-Gourd-Chickpea.png"
          },
          {
            "dish_name": "Aam Papad Quinoa Salad",
            "description": "A unique blend of sweet and tangy aam papad (mango fruit leather) with wholesome quinoa and fresh greens.",
            "veg_or_nonveg": "Veg",
            "dressing": "Kokum-Chilli Dressing",
            "crunch_topping": "Toasted Coconut Flakes",
            "price": 319,
            "macros": {
              "calories": 320,
              "protein": 10,
              "carbs": 45,
              "fat": 10,
              "sugar": 15
            },
            "tags": "v, gf",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/XJQFMYds/14-DESI-BEETROOT-AND-PEANUT.png",
            "image_closed_url": "https://i.postimg.cc/MphxnFFm/19-Spinach-Almond-Crunch.png"
          },
          {
            "dish_name": "Spicy Chana Chaat Salad",
            "description": "A healthy, deconstructed chaat with spiced chickpeas, potatoes, and tangy elements.",
            "veg_or_nonveg": "Veg",
            "dressing": "Spicy Green Chutney Vinaigrette",
            "crunch_topping": "Crushed Papdi",
            "price": 289,
            "macros": {
              "calories": 300,
              "protein": 15,
              "carbs": 40,
              "fat": 8,
              "sugar": 7
            },
            "tags": "v, wl",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/T2NmChRw/15-SPICED-GRILLED-FISH.png",
            "image_closed_url": "https://i.postimg.cc/6Q5VGM4T/2-CHICKEN-CHARGRILL-FEAST.png"
          },
          {
            "dish_name": "Moringa & Millet Medley",
            "description": "A superfood-rich salad featuring nutritious millets and moringa, with a subtle Indian flavor profile.",
            "veg_or_nonveg": "Veg",
            "dressing": "Moringa Tahini Dressing",
            "crunch_topping": "Roasted Fox Nuts (Makhana)",
            "price": 309,
            "macros": {
              "calories": 330,
              "protein": 12,
              "carbs": 48,
              "fat": 10,
              "sugar": 6
            },
            "tags": "v, gf, mg, wl",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/mD2zSWJC/16-CURRY-LEAF-AND-COCONUT-CRUNCH.png",
            "image_closed_url": "https://i.postimg.cc/50JV3F1H/20-Grilled-Chicken-Quinoa.png"
          },
          {
            "dish_name": "Desi Beetroot & Peanut",
            "description": "Earthy beetroot and crunchy peanuts come together in a vibrant, wholesome Indian-inspired salad.",
            "veg_or_nonveg": "Veg",
            "dressing": "Peanut-Sesame Chutney Vinaigrette",
            "crunch_topping": "Crushed Roasted Peanuts",
            "price": 299,
            "macros": {
              "calories": 310,
              "protein": 10,
              "carbs": 35,
              "fat": 15,
              "sugar": 9
            },
            "tags": "v, gf",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/sxbMyQX4/17-METHI-AND-SPROUT-MEDLEY.png",
            "image_closed_url": "https://i.postimg.cc/xdMQMPrD/21-Avocado-Black-Bean.png"
          },
          {
            "dish_name": "Spiced Grilled Fish Salad",
            "description": "Flaky grilled fish marinated in Indian spices, served with fresh greens and a tangy dressing.",
            "veg_or_nonveg": "Non-Veg",
            "dressing": "Ginger-Garlic-Green Chili Dressing",
            "crunch_topping": "Crispy Curry Leaves",
            "price": 429,
            "macros": {
              "calories": 380,
              "protein": 32,
              "carbs": 15,
              "fat": 20,
              "sugar": 3
            },
            "tags": "hp, gf",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/054M73fK/18-BITTER-GOURD-AND-CHICKPEA.png",
            "image_closed_url": "https://i.postimg.cc/9FrvyBT8/22-Lentil-Cucumber-Fresco.png"
          },
          {
            "dish_name": "Curry Leaf & Coconut Crunch",
            "description": "A unique South Indian inspired salad with the aromatic flavor of curry leaves and creamy coconut. Available with Chicken for non-veg option.",
            "veg_or_nonveg": "Veg",
            "dressing": "Beetroot-Coconut Dressing",
            "crunch_topping": "Roasted Urad Dal",
            "price": 359,
            "macros": {
              "calories": 360,
              "protein": 18,
              "carbs": 28,
              "fat": 20,
              "sugar": 6
            },
            "tags": "v, gf",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/htLXWGqV/19-SPINACH-AND-ALMOND-CRUNCH.png",
            "image_closed_url": "https://i.postimg.cc/Pq46gLYv/23-Cottage-Cheese-Greens.png"
          }
        ]
      },
      {
        "name": "Diabetic-Friendly",
        "products": [
          {
            "dish_name": "Methi & Sprout Medley",
            "description": "A low-GI salad featuring fenugreek leaves and nutrient-rich sprouts, designed for blood sugar management.",
            "veg_or_nonveg": "Veg",
            "dressing": "Lemon-Herb Vinaigrette",
            "crunch_topping": "Toasted Flax Seeds",
            "price": 299,
            "macros": {
              "calories": 280,
              "protein": 12,
              "carbs": 25,
              "fat": 15,
              "sugar": 4
            },
            "tags": "v, gf, wl",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/Lsg06GNk/2-CHARGRILL-CHICKEN-FEAST.png",
            "image_closed_url": "https://i.postimg.cc/V5QBr1Xc/24-Broccoli-Sprouted-Moong.png"
          },
          {
            "dish_name": "Bitter Gourd & Chickpea",
            "description": "A unique blend of bitter gourd (karela) with protein-rich chickpeas, known for its blood sugar benefits.",
            "veg_or_nonveg": "Veg",
            "dressing": "Light Cumin-Lime Dressing",
            "crunch_topping": "Bitter Gourd Crisps",
            "price": 289,
            "macros": {
              "calories": 290,
              "protein": 14,
              "carbs": 30,
              "fat": 12,
              "sugar": 5
            },
            "tags": "v, gf, hp",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/766h2MJN/20-GRILLED-CHICKEN-AND-QUINOA.png",
            "image_closed_url": "https://i.postimg.cc/MKVgspPV/25-Lean-Green-Detox.png"
          },
          {
            "dish_name": "Spinach & Almond Crunch",
            "description": "A vibrant, low-carb salad with iron-rich spinach and healthy fats from almonds.",
            "veg_or_nonveg": "Veg",
            "dressing": "Apple Cider Vinaigrette",
            "crunch_topping": "Sliced Almonds",
            "price": 309,
            "macros": {
              "calories": 320,
              "protein": 10,
              "carbs": 18,
              "fat": 25,
              "sugar": 4
            },
            "tags": "v, gf, kf",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/W3H36FMc/21-AVOCADO-AND-BLACK-BEAN.png",
            "image_closed_url": "https://i.postimg.cc/MZRswr78/26-Berry-Blast-Slim.png"
          },
          {
            "dish_name": "Grilled Chicken & Quinoa",
            "description": "Lean grilled chicken and low-GI quinoa combine for a satisfying and blood sugar-friendly meal.",
            "veg_or_nonveg": "Non-Veg",
            "dressing": "Dijon-Herb Vinaigrette",
            "crunch_topping": "Roasted Sunflower Seeds",
            "price": 399,
            "macros": {
              "calories": 380,
              "protein": 30,
              "carbs": 30,
              "fat": 18,
              "sugar": 3
            },
            "tags": "hp, gf, wl",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/w3KjZCfW/22-LENTIL-AND-CUCUMBER-FRESCO.png",
            "image_closed_url": "https://i.postimg.cc/vZPhXRs5/27-Quinoa-Veggie-Power.png"
          },
          {
            "dish_name": "Avocado & Black Bean",
            "description": "Creamy avocado and fiber-rich black beans provide a balanced, diabetic-friendly option.",
            "veg_or_nonveg": "Veg",
            "dressing": "Zesty Lime-Cilantro Dressing",
            "crunch_topping": "Crushed Walnuts",
            "price": 349,
            "macros": {
              "calories": 360,
              "protein": 15,
              "carbs": 35,
              "fat": 20,
              "sugar": 6
            },
            "tags": "v, gf, hp",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/vm8f0n64/23-COTTAGE-CHEESE-AND-GREENS.png",
            "image_closed_url": "https://i.postimg.cc/dVSRr82B/28-Grilled-Prawn-Citrus.png"
          },
          {
            "dish_name": "Lentil & Cucumber Fresco",
            "description": "A refreshing and low-carb salad with cooling cucumber and protein-packed lentils.",
            "veg_or_nonveg": "Veg",
            "dressing": "Fresh Mint-Lime Dressing",
            "crunch_topping": "Toasted Cumin Seeds",
            "price": 279,
            "macros": {
              "calories": 270,
              "protein": 14,
              "carbs": 28,
              "fat": 10,
              "sugar": 4
            },
            "tags": "v, gf, hp",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/rs4rDC7P/24-BROCCOLI-AND-SPROUTED-MOONG.png",
            "image_closed_url": "https://i.postimg.cc/prxKRkv2/29-Cabbage-Crunch-Chicken.png"
          },
          {
            "dish_name": "Cottage Cheese & Greens",
            "description": "A simple yet effective salad with high-protein cottage cheese and a generous serving of greens.",
            "veg_or_nonveg": "Veg",
            "dressing": "Light Yogurt-Dill Dressing",
            "crunch_topping": "Chia Seeds",
            "price": 359,
            "macros": {
              "calories": 350,
              "protein": 25,
              "carbs": 15,
              "fat": 20,
              "sugar": 3
            },
            "tags": "v, gf, hp, kf",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/Vs0MZm5W/25-LEAN-GREEN-DETOX.png",
            "image_closed_url": "https://i.postimg.cc/3wSXj221/3-TOFU-AND-EDAMAME-ZING.png"
          },
          {
            "dish_name": "Broccoli & Sprouted Moong",
            "description": "A nutrient-dense salad with crisp broccoli and sprouted moong, ideal for managing blood sugar levels.",
            "veg_or_nonveg": "Veg",
            "dressing": "Lemon-Garlic Vinaigrette",
            "crunch_topping": "Roasted Peanuts",
            "price": 289,
            "macros": {
              "calories": 290,
              "protein": 16,
              "carbs": 30,
              "fat": 10,
              "sugar": 5
            },
            "tags": "v, gf, hp",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/yYqRwtZ4/26-BERRY-BLAST-SLIM.png",
            "image_closed_url": "https://i.postimg.cc/PrVvRdCf/30-Watermelon-Feta-Fresco.png"
          }
        ]
      },
      {
        "name": "Weight Loss",
        "products": [
          {
            "dish_name": "Lean Green Detox",
            "description": "A cleansing and low-calorie salad packed with detoxifying greens and light protein.",
            "veg_or_nonveg": "Veg",
            "dressing": "Apple Cider Vinaigrette",
            "crunch_topping": "Crispy Kale Chips",
            "price": 299,
            "macros": {
              "calories": 280,
              "protein": 15,
              "carbs": 25,
              "fat": 12,
              "sugar": 7
            },
            "tags": "v, gf, wl",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/dt8Cv627/27-QUINOA-AND-VEGGIE-POWER.png",
            "image_closed_url": "https://i.postimg.cc/JhZy0JPt/31-Tofu-Mushroom-Medley.png"
          },
          {
            "dish_name": "Berry Blast Slim",
            "description": "A refreshing and antioxidant-rich salad with mixed berries, promoting satiety and aiding weight loss.",
            "veg_or_nonveg": "Veg",
            "dressing": "Light Berry Vinaigrette",
            "crunch_topping": "Goji Berries",
            "price": 279,
            "macros": {
              "calories": 250,
              "protein": 8,
              "carbs": 35,
              "fat": 7,
              "sugar": 10
            },
            "tags": "v, gf, wl",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/fLt3PfWR/28-GRILLED-PRAWN-AND-CITRUS.png",
            "image_closed_url": "https://i.postimg.cc/mDPQmhws/4-SPICED-CHICKPEA-AND-QUINOA.png"
          },
          {
            "dish_name": "Quinoa & Veggie Power",
            "description": "A fiber-rich and filling salad with wholesome quinoa and a vibrant mix of colorful vegetables.",
            "veg_or_nonveg": "Veg",
            "dressing": "Lemon-Herb Vinaigrette",
            "crunch_topping": "Toasted Sunflower Seeds",
            "price": 309,
            "macros": {
              "calories": 320,
              "protein": 10,
              "carbs": 40,
              "fat": 10,
              "sugar": 6
            },
            "tags": "v, gf, wl",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/B6r8fPtc/29-CABBAGE-CRUNCH-AND-CHICKEN.png",
            "image_closed_url": "https://i.postimg.cc/TYK3hgPG/42-Flax-Berry-Harmony.png"
          },
          {
            "dish_name": "Grilled Prawn & Citrus",
            "description": "Lean grilled prawns with zesty citrus fruits, offering a low-calorie, high-protein, and refreshing option.",
            "veg_or_nonveg": "Non-Veg",
            "dressing": "Orange-Ginger Vinaigrette",
            "crunch_topping": "Sesame Seeds",
            "price": 429,
            "macros": {
              "calories": 350,
              "protein": 28,
              "carbs": 20,
              "fat": 15,
              "sugar": 8
            },
            "tags": "hp, gf, wl",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/9M3g41n6/3-TOFU-AND-EDAMEME-ZING.png",
            "image_closed_url": "https://i.postimg.cc/02h2Sj6S/43-Chickpea-Amla-Detox.png"
          },
          {
            "dish_name": "Cabbage Crunch & Chicken",
            "description": "A satisfyingly crunchy salad with shredded cabbage and lean grilled chicken, low in calories but high in flavor.",
            "veg_or_nonveg": "Non-Veg",
            "dressing": "Light Peanut Dressing",
            "crunch_topping": "Crushed Roasted Peanuts",
            "price": 399,
            "macros": {
              "calories": 360,
              "protein": 30,
              "carbs": 20,
              "fat": 18,
              "sugar": 4
            },
            "tags": "hp, gf, wl",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/P5XCHjfc/30-WATERMELON-AND-FETO-FRESCO.png",
            "image_closed_url": "https://i.postimg.cc/8zhDrHg8/44-Moringa-Lentil-Support.png"
          },
          {
            "dish_name": "Watermelon & Feta Fresco",
            "description": "A classic refreshing salad that is hydrating and low in calories, perfect for light meals.",
            "veg_or_nonveg": "Veg",
            "dressing": "Balsamic Glaze",
            "crunch_topping": "Fresh Mint Leaves",
            "price": 269,
            "macros": {
              "calories": 260,
              "protein": 8,
              "carbs": 30,
              "fat": 10,
              "sugar": 12
            },
            "tags": "v, gf, wl",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/15c8btSw/31-TOFU-AND-MUSHROOM-MEDLEY.png",
            "image_closed_url": "https://i.postimg.cc/3w1Ttxwn/45-Avocado-Seed-Balance.png"
          },
          {
            "dish_name": "Tofu & Mushroom Medley",
            "description": "A light and flavorful plant-based salad with protein-rich tofu and earthy mushrooms.",
            "veg_or_nonveg": "Veg",
            "dressing": "Soy-Ginger Vinaigrette",
            "crunch_topping": "Crispy Garlic Bits",
            "price": 319,
            "macros": {
              "calories": 300,
              "protein": 18,
              "carbs": 25,
              "fat": 15,
              "sugar": 5
            },
            "tags": "v, df, hp, wl",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/Hn0LGSqd/32-GARDEN-HARVEST-WITH-SEEDS.png",
            "image_closed_url": "https://i.postimg.cc/2yBgNkzp/46-Grilled-Chicken-Greens.png"
          },
          {
            "dish_name": "Garden Harvest with Seeds",
            "description": "A simple, fresh garden salad enhanced with a mix of seeds for added nutrients and satiety.",
            "veg_or_nonveg": "Veg",
            "dressing": "Lemon-Herb Vinaigrette",
            "crunch_topping": "Mixed Roasted Seeds",
            "price": 249,
            "macros": {
              "calories": 270,
              "protein": 8,
              "carbs": 25,
              "fat": 15,
              "sugar": 4
            },
            "tags": "v, gf, wl",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/8PD5dSv5/33-CITRUS-AMLA-BOOST.png",
            "image_closed_url": "https://i.postimg.cc/NMnZn9v7/47-Spinach-Paneer-Delight.png"
          }
        ]
      },
      {
        "name": "Vitamin Deficiency",
        "products": [
          {
            "dish_name": "Citrus Amla Boost",
            "description": "A powerful vitamin C rich salad with citrus fruits and Indian gooseberry (Amla) for immunity.",
            "veg_or_nonveg": "Veg",
            "dressing": "Honey-Lime Vinaigrette",
            "crunch_topping": "Toasted Almonds",
            "price": 319,
            "macros": {
              "calories": 290,
              "protein": 5,
              "carbs": 40,
              "fat": 10,
              "sugar": 18
            },
            "tags": "v, gf",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/c171LbzN/34-KALE-AND-BERRY.png",
            "image_closed_url": "https://i.postimg.cc/637BTN9c/48-Broccoli-Quinoa-Boost.png"
          },
          {
            "dish_name": "Kale & Berry Iron Rich",
            "description": "A vibrant salad packed with iron-rich kale and berries, essential for combating iron deficiency.",
            "veg_or_nonveg": "Veg",
            "dressing": "Balsamic Vinaigrette",
            "crunch_topping": "Dried Cranberries",
            "price": 309,
            "macros": {
              "calories": 300,
              "protein": 6,
              "carbs": 45,
              "fat": 10,
              "sugar": 15
            },
            "tags": "v, gf",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/GtRcjFHN/35-SUNSHINE-VITAMIN-D.png",
            "image_closed_url": "https://i.postimg.cc/KvhmcVC7/49-Folic-Acid-Power-Bowl.png"
          },
          {
            "dish_name": "Sunshine Vitamin D Salad",
            "description": "A unique salad with ingredients known to support Vitamin D synthesis and absorption. Available with Tofu for a veg option.",
            "veg_or_nonveg": "Non-Veg",
            "dressing": "Creamy Mushroom Dressing",
            "crunch_topping": "Sun-Dried Tomato Bits",
            "price": 399,
            "macros": {
              "calories": 390,
              "protein": 25,
              "carbs": 20,
              "fat": 22,
              "sugar": 5
            },
            "tags": "hp, gf",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/Qx0XpWs4/36-CARROT-AND-TURMERIC-GLOW.png",
            "image_closed_url": "https://i.postimg.cc/0yCdQTQL/5-SMOKED-SALMON-AND-AVOCADO.png"
          },
          {
            "dish_name": "Carrot & Turmeric Glow",
            "description": "A beta-carotene rich salad with fresh turmeric, promoting skin health and overall vitality.",
            "veg_or_nonveg": "Veg",
            "dressing": "Orange-Turmeric Vinaigrette",
            "crunch_topping": "Toasted Pumpkin Seeds",
            "price": 299,
            "macros": {
              "calories": 280,
              "protein": 4,
              "carbs": 38,
              "fat": 12,
              "sugar": 10
            },
            "tags": "v, gf",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/zGQ8QZyT/37-BROCCOLI-AND-BELL-PEPPER.png",
            "image_closed_url": "https://i.postimg.cc/135hfZBF/50-Calcium-Iron-Rich.png"
          },
          {
            "dish_name": "Broccoli & Bell Pepper C",
            "description": "A potent dose of Vitamin C from broccoli and colorful bell peppers, supporting immune function.",
            "veg_or_nonveg": "Veg",
            "dressing": "Lemon-Garlic Vinaigrette",
            "crunch_topping": "Roasted Cashew Crumble",
            "price": 289,
            "macros": {
              "calories": 270,
              "protein": 6,
              "carbs": 28,
              "fat": 15,
              "sugar": 5
            },
            "tags": "v, gf",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/sD6rBd9b/38-AVOCADOS-AND-GREENS.png",
            "image_closed_url": "https://i.postimg.cc/HkZGMPvh/51-Omega-3-Berry-Blend.png"
          },
          {
            "dish_name": "Avocado & Greens K",
            "description": "A rich source of Vitamin K from leafy greens and healthy fats from avocado, supporting bone health.",
            "veg_or_nonveg": "Veg",
            "dressing": "Green Goddess Dressing",
            "crunch_topping": "Pistachio Crumble",
            "price": 349,
            "macros": {
              "calories": 380,
              "protein": 8,
              "carbs": 20,
              "fat": 30,
              "sugar": 6
            },
            "tags": "v, gf, kf",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/WzSP6QRF/39-NUTRIENT-BURST.png",
            "image_closed_url": "https://i.postimg.cc/K8sVj3RX/52-Hydration-Fiber-Fresco.png"
          },
          {
            "dish_name": "Nutrient Burst Salad",
            "description": "A comprehensive blend of ingredients providing a wide spectrum of essential vitamins and minerals.",
            "veg_or_nonveg": "Veg",
            "dressing": "Balsamic-Herb Vinaigrette",
            "crunch_topping": "Mixed Roasted Seeds",
            "price": 329,
            "macros": {
              "calories": 350,
              "protein": 15,
              "carbs": 40,
              "fat": 15,
              "sugar": 7
            },
            "tags": "v, gf, hp",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/Qtp4c1LH/4-SPICED-CHICKPEA-AND-QUINOA.png",
            "image_closed_url": "https://i.postimg.cc/zfbQgDgy/53-Protein-Fiber-Boost.png"
          },
          {
            "dish_name": "Spinach & Egg B-Complex",
            "description": "A powerhouse of B vitamins from spinach and eggs, crucial for energy metabolism.",
            "veg_or_nonveg": "Non-Veg",
            "dressing": "Light Yogurt-Dill Dressing",
            "crunch_topping": "Crispy Chickpea Croutons",
            "price": 319,
            "macros": {
              "calories": 330,
              "protein": 20,
              "carbs": 15,
              "fat": 20,
              "sugar": 3
            },
            "tags": "hp, gf",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/JzsWZ6p0/40-SPINACH-AND-EGG-B-COMPLEX.png",
            "image_closed_url": "https://i.postimg.cc/HnBzNFMG/54-Ginger-Carrot-Glow.png"
          }
        ]
      },
      {
        "name": "PCOD-Friendly",
        "products": [
          {
            "dish_name": "Cinnamon Quinoa Balance",
            "description": "Quinoa with a touch of cinnamon, known to help with insulin sensitivity, combined with balancing ingredients.",
            "veg_or_nonveg": "Veg",
            "dressing": "Light Cinnamon-Apple Vinaigrette",
            "crunch_topping": "Toasted Walnuts",
            "price": 319,
            "macros": {
              "calories": 340,
              "protein": 10,
              "carbs": 45,
              "fat": 14,
              "sugar": 8
            },
            "tags": "v, gf, pc",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/K8ChNPWN/41-CINNAMON-AND-QUINOA-BALANCE.png",
            "image_closed_url": "https://i.postimg.cc/wTj0NTK9/55-Nutrient-Dense-Delight.png"
          },
          {
            "dish_name": "Flax & Berry Harmony",
            "description": "A blend of berries and flax seeds, rich in antioxidants and omega-3s, beneficial for hormonal balance.",
            "veg_or_nonveg": "Veg",
            "dressing": "Berry Chia Seed Dressing",
            "crunch_topping": "Ground Flax Seeds",
            "price": 299,
            "macros": {
              "calories": 280,
              "protein": 6,
              "carbs": 38,
              "fat": 10,
              "sugar": 12
            },
            "tags": "v, gf, pc",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/3wp5by5H/42-FLAX-AND-BERRY-HARMONY.png",
            "image_closed_url": "https://i.postimg.cc/PxHM5dzs/56-Spinach-Lentil-Power.png"
          },
          {
            "dish_name": "Chickpea & Amla Detox",
            "description": "Protein-rich chickpeas with amla, supporting detoxification and hormonal health.",
            "veg_or_nonveg": "Veg",
            "dressing": "Lemon-Coriander Dressing",
            "crunch_topping": "Roasted Cumin Seeds",
            "price": 299,
            "macros": {
              "calories": 310,
              "protein": 15,
              "carbs": 35,
              "fat": 10,
              "sugar": 6
            },
            "tags": "v, gf, hp, pc",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/63XJs9t4/43-CHICKPEA-AMLA-DETOX.png",
            "image_closed_url": "https://i.postimg.cc/CL2HfGH4/57-Microgreen-Superfood-Bowl.png"
          },
          {
            "dish_name": "Moringa & Lentil Support",
            "description": "A nutrient-dense salad with moringa and lentils, promoting overall hormonal well-being.",
            "veg_or_nonveg": "Veg",
            "dressing": "Moringa Tahini Dressing",
            "crunch_topping": "Roasted Almond Slivers",
            "price": 309,
            "macros": {
              "calories": 320,
              "protein": 18,
              "carbs": 30,
              "fat": 12,
              "sugar": 5
            },
            "tags": "v, gf, hp, pc",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/76nvwpZs/44-MORINGA-AND-LENTIL-SUPPORT.png",
            "image_closed_url": "https://i.postimg.cc/jSNNwGjs/58-Sprouted-Lentil-Microgreen.png"
          },
          {
            "dish_name": "Avocado & Seed Balance",
            "description": "Healthy fats from avocado and seeds provide essential nutrients for hormonal regulation.",
            "veg_or_nonveg": "Veg",
            "dressing": "Apple Cider Vinaigrette",
            "crunch_topping": "Mixed Roasted Seeds",
            "price": 359,
            "macros": {
              "calories": 390,
              "protein": 8,
              "carbs": 18,
              "fat": 32,
              "sugar": 4
            },
            "tags": "v, gf, kf, pc",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/fy860mXY/45-AVOCADO-AND-SEED-BALANCE.png",
            "image_closed_url": "https://i.postimg.cc/ZKXpqT47/59-Quinoa-Microgreen-Medley.png"
          },
          {
            "dish_name": "Grilled Chicken & Greens",
            "description": "Lean protein from grilled chicken with a focus on leafy greens for PCOD management.",
            "veg_or_nonveg": "Non-Veg",
            "dressing": "Light Lemon-Herb Dressing",
            "crunch_topping": "Toasted Walnuts",
            "price": 399,
            "macros": {
              "calories": 380,
              "protein": 30,
              "carbs": 15,
              "fat": 20,
              "sugar": 3
            },
            "tags": "hp, gf, pc",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/sD8LdVJf/46-GRILLED-CHICKEN-AND-GREENS.png",
            "image_closed_url": "https://i.postimg.cc/6pznwCbK/6-LENTIL-AND-FETA-MEDLEY.png"
          },
          {
            "dish_name": "Spinach & Paneer Delight",
            "description": "Iron-rich spinach and high-protein paneer in a balanced, PCOD-friendly combination.",
            "veg_or_nonveg": "Veg",
            "dressing": "Mint-Coriander Yogurt Raita",
            "crunch_topping": "Crispy Chickpea Croutons",
            "price": 369,
            "macros": {
              "calories": 370,
              "protein": 25,
              "carbs": 20,
              "fat": 22,
              "sugar": 5
            },
            "tags": "v, gf, hp, pc",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/PrN7RLYF/47-SPINACH-AND-PANEER-DELIGHT.png",
            "image_closed_url": "https://i.postimg.cc/zfFgpKW6/60-Grilled-Chicken-Microgreens.png"
          },
          {
            "dish_name": "Broccoli & Quinoa Boost",
            "description": "A nutrient-packed salad with broccoli and quinoa, supporting hormonal health and satiety.",
            "veg_or_nonveg": "Veg",
            "dressing": "Balsamic Glaze",
            "crunch_topping": "Roasted Almonds",
            "price": 309,
            "macros": {
              "calories": 330,
              "protein": 12,
              "carbs": 40,
              "fat": 12,
              "sugar": 7
            },
            "tags": "v, gf, pc",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/s2C0xw8t/48-BROCCOLI-AND-QUINOA-BOOST.png",
            "image_closed_url": "https://i.postimg.cc/dQxTWqks/61-Beetroot-Microgreen-Fusion.png"
          }
        ]
      },
      {
        "name": "Pregnancy-Safe",
        "products": [
          {
            "dish_name": "Folic Acid Power Bowl",
            "description": "Rich in folic acid from leafy greens and lentils, crucial for healthy fetal development.",
            "veg_or_nonveg": "Veg",
            "dressing": "Lemon-Herb Vinaigrette",
            "crunch_topping": "Roasted Sunflower Seeds",
            "price": 309,
            "macros": {
              "calories": 320,
              "protein": 15,
              "carbs": 35,
              "fat": 12,
              "sugar": 5
            },
            "tags": "v, gf, pg",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/KY7pMth4/49-FOLIC-ACID-POWER-BOWL.png",
            "image_closed_url": "https://i.postimg.cc/CMXzGmXd/62-Tofu-Microgreen-Zen.png"
          },
          {
            "dish_name": "Calcium & Iron Rich",
            "description": "Packed with calcium from paneer/tofu and iron from spinach, vital for maternal and fetal health.",
            "veg_or_nonveg": "Veg",
            "dressing": "Light Yogurt-Dill Dressing",
            "crunch_topping": "Sesame Seeds",
            "price": 349,
            "macros": {
              "calories": 350,
              "protein": 20,
              "carbs": 25,
              "fat": 18,
              "sugar": 4
            },
            "tags": "v, hp, gf, pg",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/QCh6mCsS/5-SMOKED-SALMON-AND-AVOCADO.png",
            "image_closed_url": "https://i.postimg.cc/QC2Cjd1c/63-Mediterranean-Microgreen.png"
          },
          {
            "dish_name": "Omega-3 Berry Blend",
            "description": "A delicious source of omega-3 fatty acids from chia seeds and berries, supporting brain development.",
            "veg_or_nonveg": "Veg",
            "dressing": "Berry Chia Seed Dressing",
            "crunch_topping": "Chia Seeds",
            "price": 299,
            "macros": {
              "calories": 290,
              "protein": 6,
              "carbs": 38,
              "fat": 12,
              "sugar": 12
            },
            "tags": "v, gf, pg",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/D00xHDJb/50-CLACIUM-AND-IRON-RICH.png",
            "image_closed_url": "https://i.postimg.cc/yYRWv0Cj/64-Spicy-Prawn-Microgreen.png"
          },
          {
            "dish_name": "Hydration & Fiber Fresco",
            "description": "High water content fruits and fiber-rich ingredients to aid digestion and hydration during pregnancy.",
            "veg_or_nonveg": "Veg",
            "dressing": "Fresh Mint-Lime Dressing",
            "crunch_topping": "Toasted Coconut Flakes",
            "price": 279,
            "macros": {
              "calories": 260,
              "protein": 4,
              "carbs": 35,
              "fat": 8,
              "sugar": 15
            },
            "tags": "v, gf, pg",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/fT68q8wJ/51-OMEGA-3-BERRY-BLEND.png",
            "image_closed_url": "https://i.postimg.cc/85szW6bh/65-Tropical-Sunrise-Fruit-Bowl.png"
          },
          {
            "dish_name": "Protein & Fiber Boost",
            "description": "A balanced salad with lean protein and ample fiber for sustained energy and digestive comfort. Available with Chickpeas for veg option.",
            "veg_or_nonveg": "Non-Veg",
            "dressing": "Balsamic Vinaigrette",
            "crunch_topping": "Roasted Pumpkin Seeds",
            "price": 399,
            "macros": {
              "calories": 380,
              "protein": 28,
              "carbs": 35,
              "fat": 18,
              "sugar": 6
            },
            "tags": "hp, gf, pg",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/VknDxX64/52-HYDRATION-AND-FIBER-FRESCO.png",
            "image_closed_url": "https://i.postimg.cc/DZWXrZQb/66-Berry-Burst-Fruit-Salad.png"
          },
          {
            "dish_name": "Ginger & Carrot Glow",
            "description": "Ginger for nausea relief and carrots for Vitamin A, supporting overall maternal wellness.",
            "veg_or_nonveg": "Veg",
            "dressing": "Orange-Ginger Vinaigrette",
            "crunch_topping": "Sliced Almonds",
            "price": 289,
            "macros": {
              "calories": 270,
              "protein": 4,
              "carbs": 30,
              "fat": 12,
              "sugar": 10
            },
            "tags": "v, gf, pg",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/nL1TzZqD/53-PROTEIN-AND-FIBER-BOOST.png",
            "image_closed_url": "https://i.postimg.cc/sXtZwrKH/67-Fig-Date-Delight.png"
          },
          {
            "dish_name": "Nutrient-Dense Delight",
            "description": "A comprehensive salad providing a wide array of vitamins and minerals essential for pregnancy. Available with Grilled Chicken for non-veg option.",
            "veg_or_nonveg": "Veg",
            "dressing": "Honey-Mustard Vinaigrette",
            "crunch_topping": "Mixed Roasted Nuts",
            "price": 369,
            "macros": {
              "calories": 390,
              "protein": 18,
              "carbs": 35,
              "fat": 22,
              "sugar": 9
            },
            "tags": "v, hp, gf, pg",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/85KHRHKk/54-GINGER-CARROT-GLOW.png",
            "image_closed_url": "https://i.postimg.cc/RhKJYDDS/68-Mediterranean-Fruit-Medley.png"
          },
          {
            "dish_name": "Spinach & Lentil Power",
            "description": "A hearty salad combining iron-rich spinach with protein-packed lentils, vital for energy and blood count.",
            "veg_or_nonveg": "Veg",
            "dressing": "Lemon-Tahini Dressing",
            "crunch_topping": "Crispy Garlic Bits",
            "price": 309,
            "macros": {
              "calories": 310,
              "protein": 16,
              "carbs": 30,
              "fat": 12,
              "sugar": 5
            },
            "tags": "v, gf, hp, pg",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/6q8hYvgr/55-NUTRIENT-DENSE-DELIGHT.png",
            "image_closed_url": "https://i.postimg.cc/sDChW3Mv/69-Spicy-Guava-Pomegranate.png"
          }
        ]
      },
      {
        "name": "Microgreen-Based",
        "products": [
          {
            "dish_name": "Microgreen Superfood Bowl",
            "description": "A vibrant salad showcasing the intense nutrients of mixed microgreens with a light, refreshing base.",
            "veg_or_nonveg": "Veg",
            "dressing": "Lemon-Herb Vinaigrette",
            "crunch_topping": "Toasted Pine Nuts",
            "price": 349,
            "macros": {
              "calories": 300,
              "protein": 8,
              "carbs": 20,
              "fat": 20,
              "sugar": 4
            },
            "tags": "v, gf, mg",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/Pf7yNSv2/56-SPINACH-AND-LENTIL-POWER.png",
            "image_closed_url": "https://i.postimg.cc/Gp2Yp96y/7-SPROUTS-AND-SEED-POWER.png"
          },
          {
            "dish_name": "Sprouted Lentil & Microgreen",
            "description": "Protein-packed sprouted lentils combined with fresh microgreens for a nutrient-dense meal.",
            "veg_or_nonveg": "Veg",
            "dressing": "Cumin-Lime Dressing",
            "crunch_topping": "Roasted Cumin Seeds",
            "price": 329,
            "macros": {
              "calories": 310,
              "protein": 16,
              "carbs": 30,
              "fat": 10,
              "sugar": 5
            },
            "tags": "v, gf, hp, mg",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/FH5xV1ZS/57-MICROGREEN-SUPERFOOD-BOWL.png",
            "image_closed_url": "https://i.postimg.cc/J054ZVFk/70-Grape-Walnut-Crunch.png"
          },
          {
            "dish_name": "Quinoa & Microgreen Medley",
            "description": "Wholesome quinoa mixed with a generous serving of microgreens, offering a complete and balanced meal.",
            "veg_or_nonveg": "Veg",
            "dressing": "Balsamic Glaze",
            "crunch_topping": "Toasted Almond Slivers",
            "price": 339,
            "macros": {
              "calories": 350,
              "protein": 12,
              "carbs": 45,
              "fat": 15,
              "sugar": 8
            },
            "tags": "v, gf, mg",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/9MndRf0r/58-SPROUTED-LENTIL-AND-MICROGREEN.png",
            "image_closed_url": "https://i.postimg.cc/TYTPG1yq/71-Kiwi-Spinach-Detox.png"
          },
          {
            "dish_name": "Grilled Chicken & Microgreens",
            "description": "Lean grilled chicken breast paired with a fresh bed of microgreens for a light yet satisfying protein boost.",
            "veg_or_nonveg": "Non-Veg",
            "dressing": "Light Lemon-Herb Dressing",
            "crunch_topping": "Crispy Garlic Bits",
            "price": 419,
            "macros": {
              "calories": 380,
              "protein": 30,
              "carbs": 15,
              "fat": 20,
              "sugar": 3
            },
            "tags": "hp, gf, mg",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/0jKppqKZ/59-QUINOA-AND-MICROGREEN-MEDLEY.png",
            "image_closed_url": "https://i.postimg.cc/NG60Wm0j/72-Power-Berry-Banana.png"
          },
          {
            "dish_name": "Beetroot & Microgreen Fusion",
            "description": "Earthy beetroot and vibrant microgreens create a visually stunning and nutrient-rich salad.",
            "veg_or_nonveg": "Veg",
            "dressing": "Orange-Ginger Vinaigrette",
            "crunch_topping": "Roasted Pumpkin Seeds",
            "price": 319,
            "macros": {
              "calories": 320,
              "protein": 8,
              "carbs": 35,
              "fat": 18,
              "sugar": 9
            },
            "tags": "v, gf, mg",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/R0tXzKZX/6-LENTIL-FETA-MEDLEY.png",
            "image_closed_url": "https://i.postimg.cc/fRLTtPfV/73-Cardamom-Fig-Overnight-Oats.png"
          },
          {
            "dish_name": "Tofu & Microgreen Zen",
            "description": "Pan-seared tofu with a calming blend of microgreens, offering a plant-based protein option.",
            "veg_or_nonveg": "Veg",
            "dressing": "Soy-Ginger Vinaigrette",
            "crunch_topping": "Toasted Sesame Seeds",
            "price": 339,
            "macros": {
              "calories": 340,
              "protein": 20,
              "carbs": 25,
              "fat": 18,
              "sugar": 5
            },
            "tags": "v, df, hp, mg",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/RCW8P6cp/60-GRILLED-CHICKEN-AND-MICROGREENS.png",
            "image_closed_url": "https://i.postimg.cc/mgtB2HTM/74-Tropical-Coconut-Overnight-Oats.png"
          },
          {
            "dish_name": "Mediterranean Microgreen",
            "description": "A fresh take on Mediterranean flavors, with microgreens adding an extra layer of nutrition.",
            "veg_or_nonveg": "Veg",
            "dressing": "Lemon-Tahini Dressing",
            "crunch_topping": "Toasted Pine Nuts",
            "price": 349,
            "macros": {
              "calories": 360,
              "protein": 15,
              "carbs": 30,
              "fat": 20,
              "sugar": 6
            },
            "tags": "v, gf, mg",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/Z0k6HDrm/61-BEETROOT-AND-MICROGREEN-FUSION.png",
            "image_closed_url": "https://i.postimg.cc/pTtHZczY/75-Berry-Blast-Overnight-Oats.png"
          },
          {
            "dish_name": "Spicy Prawn & Microgreen",
            "description": "Succulent prawns with a kick of spice, balanced by the freshness of microgreens.",
            "veg_or_nonveg": "Non-Veg",
            "dressing": "Chilli-Lime Dressing",
            "crunch_topping": "Crispy Fried Shallots",
            "price": 429,
            "macros": {
              "calories": 400,
              "protein": 32,
              "carbs": 18,
              "fat": 22,
              "sugar": 4
            },
            "tags": "hp, gf, mg",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/c4YzSpkQ/62-TOFU-AND-MICROGREEN-ZEN.png",
            "image_closed_url": "https://i.postimg.cc/YqSwbWGV/76-Peanut-Butter-Power-Oats.png"
          }
        ]
      },
      {
        "name": "Assorted Fruit Salad",
        "products": [
          {
            "dish_name": "Tropical Sunrise Fruit Bowl",
            "description": "A vibrant mix of seasonal tropical fruits, light and refreshing, perfect for a healthy start or mid-day energizer.",
            "veg_or_nonveg": "Veg",
            "dressing": "Honey-Lime Mint Drizzle",
            "crunch_topping": "Toasted Coconut Chips",
            "price": 279,
            "macros": {
              "calories": 280,
              "protein": 4,
              "carbs": 65,
              "fat": 5,
              "sugar": 35
            },
            "tags": "v, gf, df, wl",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/bwhBNm44/63-MEDITERRANEAN-MICROGREEN.png",
            "image_closed_url": "https://i.postimg.cc/zvxYqJM0/77-Apple-Cinnamon-Overnight-Oats.png"
          },
          {
            "dish_name": "Berry Burst Fruit Salad",
            "description": "An antioxidant-rich blend of mixed berries with a hint of citrus, promoting vitality and freshness.",
            "veg_or_nonveg": "Veg",
            "dressing": "Orange-Ginger Vinaigrette",
            "crunch_topping": "Toasted Almond Slivers",
            "price": 289,
            "macros": {
              "calories": 260,
              "protein": 3,
              "carbs": 60,
              "fat": 4,
              "sugar": 30
            },
            "tags": "v, gf, df, wl",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/g0ct3nzD/64-SPICY-PRAWN-AND-MICROGREEN.png",
            "image_closed_url": "https://i.postimg.cc/g0FQFXjG/78-Moong-Dal-Overnight-Oats-Savory.png"
          },
          {
            "dish_name": "Fig & Date Delight",
            "description": "Sweet and earthy flavors of fresh figs and dates, balanced with crisp apple for a wholesome indulgence.",
            "veg_or_nonveg": "Veg",
            "dressing": "Cardamom Honey Drizzle",
            "crunch_topping": "Crushed Pistachios",
            "price": 309,
            "macros": {
              "calories": 320,
              "protein": 6,
              "carbs": 70,
              "fat": 8,
              "sugar": 40
            },
            "tags": "v, gf",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/k5j1sqDd/65-TROPICAL-SUNRISE-FRUIT-BOWL.png",
            "image_closed_url": "https://i.postimg.cc/85w06ZHC/79-Chocolate-Hazelnut-Overnight-Oats.png"
          },
          {
            "dish_name": "Mediterranean Fruit Medley",
            "description": "A refreshing fruit salad with a Mediterranean twist, featuring cooling cucumber and mint.",
            "veg_or_nonveg": "Veg",
            "dressing": "Lemon-Mint Infusion",
            "crunch_topping": "Toasted Pine Nuts",
            "price": 279,
            "macros": {
              "calories": 250,
              "protein": 5,
              "carbs": 55,
              "fat": 7,
              "sugar": 28
            },
            "tags": "v, gf",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/G2VM0Kk7/66-BERRY-BURST-FRUIT-SALAD.png",
            "image_closed_url": "https://i.postimg.cc/bvBnSpjF/8-Grilled-Halloumi-Berry.png"
          },
          {
            "dish_name": "Spicy Guava & Pomegranate",
            "description": "A zesty and spicy fruit salad with popular Indian street food flavors for a unique kick.",
            "veg_or_nonveg": "Veg",
            "dressing": "Chilli-Lime-Chaat Masala Vinaigrette",
            "crunch_topping": "Roasted Cumin Seeds",
            "price": 269,
            "macros": {
              "calories": 240,
              "protein": 4,
              "carbs": 58,
              "fat": 3,
              "sugar": 25
            },
            "tags": "v, gf, df, wl",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/tJ6B96kX/67-FIG-AND-DATE-DELIGHT.png",
            "image_closed_url": "https://i.postimg.cc/T1wHqn7J/80-Pistachio-Rose-Overnight-Oats.png"
          },
          {
            "dish_name": "Grape & Walnut Crunch",
            "description": "Sweet grapes and crunchy walnuts with a creamy base, a satisfying and healthy treat.",
            "veg_or_nonveg": "Veg",
            "dressing": "Light Yogurt-Dill Dressing",
            "crunch_topping": "Toasted Walnuts",
            "price": 289,
            "macros": {
              "calories": 300,
              "protein": 7,
              "carbs": 50,
              "fat": 12,
              "sugar": 28
            },
            "tags": "v, gf, wl",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/c4qDXD16/68-MEDITERRANEAN-FRUIT-MELDY.png",
            "image_closed_url": "https://i.postimg.cc/WzHY9txL/81-Moringa-Magic-Smoothie-Bowl.png"
          },
          {
            "dish_name": "Kiwi & Spinach Detox",
            "description": "A revitalizing fruit salad blending tangy kiwi with iron-rich spinach for a cleansing effect.",
            "veg_or_nonveg": "Veg",
            "dressing": "Kiwi-Lime Vinaigrette",
            "crunch_topping": "Pumpkin Seeds",
            "price": 279,
            "macros": {
              "calories": 230,
              "protein": 4,
              "carbs": 50,
              "fat": 5,
              "sugar": 22
            },
            "tags": "v, gf, df, wl",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/m2QmqQhj/69-SPICY-GUAVA-AND-POMEGRANATE.png",
            "image_closed_url": "https://i.postimg.cc/bvpg9QdS/82-Tropical-Sunshine-Smoothie-Bowl.png"
          }
        ]
      }
    ]
  },
  {
    "category": "Salad",
    "subcategories": [
      {
        "name": "Assorted Fruit Salad",
        "products": [
          {
            "dish_name": "Power Berry & Banana",
            "description": "A simple yet potent fruit salad with high-energy fruits and superfoods for a quick boost.",
            "veg_or_nonveg": "Veg",
            "dressing": "Berry Chia Seed Dressing",
            "crunch_topping": "Hemp Seeds",
            "price": 319,
            "macros": {
              "calories": 350,
              "protein": 9,
              "carbs": 60,
              "fat": 12,
              "sugar": 30
            },
            "tags": "v, gf, df, hp",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/xTd51Wdk/7-SPROUTS-AND-SEED-POWER.png",
            "image_closed_url": "https://i.postimg.cc/XvL8HpyH/83-Berry-Bliss-Smoothie-Bowl.png"
          }
        ]
      }
    ]
  },
  {
    "category": "BOWLS",
    "subcategories": [
      {
        "name": "Overnight Oat Bowls",
        "products": [
          {
            "dish_name": "Cardamom & Fig Overnight Oats",
            "description": "Creamy overnight oats infused with aromatic cardamom and sweet figs, a comforting start to your day.",
            "veg_or_nonveg": "Veg",
            "dressing": "Classic Vinaigrette",
            "crunch_topping": "Mixed Seeds",
            "price": 289,
            "macros": {
              "calories": 360,
              "protein": 8,
              "carbs": 60,
              "fat": 12,
              "sugar": 20
            },
            "tags": "v, gf, df, wl",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/Mp5dZq7j/70-GRAPE-AND-WALNUT-CRUNCH.png",
            "image_closed_url": "https://i.postimg.cc/nzL16p4H/84-Cacao-Power-Smoothie-Bowl.png"
          },
          {
            "dish_name": "Tropical Coconut Overnight Oats",
            "description": "A taste of the tropics with coconut-infused oats, fresh mango, and pineapple.",
            "veg_or_nonveg": "Veg",
            "dressing": "Classic Vinaigrette",
            "crunch_topping": "Mixed Seeds",
            "price": 299,
            "macros": {
              "calories": 380,
              "protein": 7,
              "carbs": 65,
              "fat": 15,
              "sugar": 25
            },
            "tags": "v, gf, df, wl",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/q77QzSwD/71-KIWI-AND-SPINACH-DETOX.png",
            "image_closed_url": "https://i.postimg.cc/wvbkzZ2D/85-Green-Detox-Smoothie-Bowl.png"
          },
          {
            "dish_name": "Berry Blast Overnight Oats",
            "description": "Antioxidant-rich mixed berries swirled into creamy overnight oats, perfect for a refreshing breakfast.",
            "veg_or_nonveg": "Veg",
            "dressing": "Classic Vinaigrette",
            "crunch_topping": "Mixed Seeds",
            "price": 279,
            "macros": {
              "calories": 350,
              "protein": 9,
              "carbs": 55,
              "fat": 10,
              "sugar": 18
            },
            "tags": "v, gf, df, wl",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/xCJRPmWK/72-POWER-BERRY-AND-BANANA.png",
            "image_closed_url": "https://i.postimg.cc/4yChwPy6/9-Tandoori-Paneer-Delight.png"
          },
          {
            "dish_name": "Peanut Butter Power Oats",
            "description": "A high-protein, energy-packed overnight oat bowl with creamy peanut butter and a hint of chocolate.",
            "veg_or_nonveg": "Veg",
            "dressing": "Classic Vinaigrette",
            "crunch_topping": "Mixed Seeds",
            "price": 319,
            "macros": {
              "calories": 420,
              "protein": 20,
              "carbs": 45,
              "fat": 22,
              "sugar": 15
            },
            "tags": "v, gf, df, hp",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/HxqtvxgF/73-CARDAMOM-AND-FIG-OVERNIGHT-OATS.png",
            "image_closed_url": "/placeholder.svg"
          },
          {
            "dish_name": "Apple Cinnamon Overnight Oats",
            "description": "Classic comforting flavors of apple and cinnamon combined with nutritious overnight oats.",
            "veg_or_nonveg": "Veg",
            "dressing": "Classic Vinaigrette",
            "crunch_topping": "Mixed Seeds",
            "price": 269,
            "macros": {
              "calories": 340,
              "protein": 8,
              "carbs": 58,
              "fat": 10,
              "sugar": 16
            },
            "tags": "v, gf, df, wl",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/qBKwh8cr/74-TROPICAL-COCONUT-OVERNIGHT-OATS.png",
            "image_closed_url": "/placeholder.svg"
          },
          {
            "dish_name": "Moong Dal Overnight Oats (Savory)",
            "description": "A unique savory twist on overnight oats, featuring moong dal, Indian spices, and fresh herbs.",
            "veg_or_nonveg": "Veg",
            "dressing": "Classic Vinaigrette",
            "crunch_topping": "Mixed Seeds",
            "price": 309,
            "macros": {
              "calories": 330,
              "protein": 15,
              "carbs": 48,
              "fat": 8,
              "sugar": 3
            },
            "tags": "v, gf, hp",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/7YyVgfX2/75-BERRYBLAST-OVERNIGHT-OATS.png",
            "image_closed_url": "/placeholder.svg"
          },
          {
            "dish_name": "Chocolate Hazelnut Overnight Oats",
            "description": "Indulgent yet healthy overnight oats with rich chocolate and crunchy hazelnuts.",
            "veg_or_nonveg": "Veg",
            "dressing": "Classic Vinaigrette",
            "crunch_topping": "Mixed Seeds",
            "price": 329,
            "macros": {
              "calories": 400,
              "protein": 10,
              "carbs": 50,
              "fat": 20,
              "sugar": 20
            },
            "tags": "v, gf, df",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/9QLY512d/76-PEANUT-BUTTER-POWER-OATS.png",
            "image_closed_url": "/placeholder.svg"
          },
          {
            "dish_name": "Pistachio Rose Overnight Oats",
            "description": "Exotic flavors of pistachio and rose elevate this creamy overnight oat bowl.",
            "veg_or_nonveg": "Veg",
            "dressing": "Classic Vinaigrette",
            "crunch_topping": "Mixed Seeds",
            "price": 339,
            "macros": {
              "calories": 370,
              "protein": 9,
              "carbs": 55,
              "fat": 18,
              "sugar": 18
            },
            "tags": "v, gf, df",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/PqNztZfB/77-APPLE-CINNAMON-OVERNIGHT-OATS.png",
            "image_closed_url": "/placeholder.svg"
          }
        ]
      },
      {
        "name": "Smoothie Bowls",
        "products": [
          {
            "dish_name": "Moringa Magic Smoothie Bowl",
            "description": "A superfood powerhouse bowl blended with moringa, banana, and spinach, topped with vibrant goodness.",
            "veg_or_nonveg": "Veg",
            "dressing": "Classic Vinaigrette",
            "crunch_topping": "Mixed Seeds",
            "price": 320,
            "macros": {
              "calories": 340,
              "protein": 8,
              "carbs": 50,
              "fat": 10,
              "sugar": 20
            },
            "tags": "v, df, mg",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/25Jd36V3/78-MOONDAL-OVERNIGHT-OATS-SAVORY.png",
            "image_closed_url": "/placeholder.svg"
          },
          {
            "dish_name": "Tropical Sunshine Smoothie Bowl",
            "description": "Bright and refreshing, loaded with tropical fruits and a creamy coconut base.",
            "veg_or_nonveg": "Veg",
            "dressing": "Classic Vinaigrette",
            "crunch_topping": "Mixed Seeds",
            "price": 349,
            "macros": {
              "calories": 390,
              "protein": 7,
              "carbs": 60,
              "fat": 12,
              "sugar": 28
            },
            "tags": "v, df, wl",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/0QwYSswn/79-CHOCOLATE-HAZELNUT-OVERNIGHT-OATS.png",
            "image_closed_url": "/placeholder.svg"
          },
          {
            "dish_name": "Berry Bliss Smoothie Bowl",
            "description": "An antioxidant-rich explosion of mixed berries, perfect for a skin-glowing and energizing meal.",
            "veg_or_nonveg": "Veg",
            "dressing": "Classic Vinaigrette",
            "crunch_topping": "Mixed Seeds",
            "price": 339,
            "macros": {
              "calories": 360,
              "protein": 9,
              "carbs": 55,
              "fat": 10,
              "sugar": 22
            },
            "tags": "v, df",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/Y2R8kptK/8-GRILLED-HALLOUMI-AND-BERRY.png",
            "image_closed_url": "/placeholder.svg"
          },
          {
            "dish_name": "Cacao Power Smoothie Bowl",
            "description": "Indulgent dark chocolate flavors with a nutrient punch, powered by raw cacao and nuts.",
            "veg_or_nonveg": "Veg",
            "dressing": "Classic Vinaigrette",
            "crunch_topping": "Mixed Seeds",
            "price": 359,
            "macros": {
              "calories": 400,
              "protein": 15,
              "carbs": 48,
              "fat": 20,
              "sugar": 18
            },
            "tags": "v, df, hp",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/rFJSxgKB/80-PISTACHIO-ROSE-OVERNIGHT-OATS.png",
            "image_closed_url": "/placeholder.svg"
          },
          {
            "dish_name": "Green Detox Smoothie Bowl",
            "description": "A vibrant green bowl designed for detoxification, packed with leafy greens and cleansing fruits.",
            "veg_or_nonveg": "Veg",
            "dressing": "Classic Vinaigrette",
            "crunch_topping": "Mixed Seeds",
            "price": 319,
            "macros": {
              "calories": 300,
              "protein": 6,
              "carbs": 45,
              "fat": 8,
              "sugar": 15
            },
            "tags": "v, df, wl",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/R03KrBXm/81-MORINGA-MAGIC-SMOOTHIE-BOWL.png",
            "image_closed_url": "/placeholder.svg"
          },
          {
            "dish_name": "Spiced Apple Pie Smoothie Bowl",
            "description": "Comforting apple pie flavors in a healthy bowl, with warming spices and fresh apple chunks.",
            "veg_or_nonveg": "Veg",
            "dressing": "Classic Vinaigrette",
            "crunch_topping": "Mixed Seeds",
            "price": 309,
            "macros": {
              "calories": 320,
              "protein": 7,
              "carbs": 52,
              "fat": 10,
              "sugar": 18
            },
            "tags": "v, df, wl",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/jSSyXNfL/82-TROPICAL-SUNSHINE-SMOOTHIE-BOWL.png",
            "image_closed_url": "/placeholder.svg"
          },
          {
            "dish_name": "Mango Turmeric Glow Bowl",
            "description": "Radiant yellow bowl featuring the anti-inflammatory power of turmeric and sweet mango.",
            "veg_or_nonveg": "Veg",
            "dressing": "Classic Vinaigrette",
            "crunch_topping": "Mixed Seeds",
            "price": 349,
            "macros": {
              "calories": 370,
              "protein": 6,
              "carbs": 58,
              "fat": 15,
              "sugar": 25
            },
            "tags": "v, df",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/Z5spDRPj/83-BERRY-BLISS-SMOOTHIE-BOWL.png",
            "image_closed_url": "/placeholder.svg"
          },
          {
            "dish_name": "Indian Summer Rose Smoothie Bowl",
            "description": "A uniquely Indian-inspired bowl with the delicate flavors of rose, pistachio, and cashew.",
            "veg_or_nonveg": "Veg",
            "dressing": "Classic Vinaigrette",
            "crunch_topping": "Mixed Seeds",
            "price": 369,
            "macros": {
              "calories": 390,
              "protein": 10,
              "carbs": 50,
              "fat": 18,
              "sugar": 20
            },
            "tags": "v, gf, df",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/tRdPGDts/84-CACAO-POWER-SMOOTHIE-BOWL.png",
            "image_closed_url": "/placeholder.svg"
          }
        ]
      }
    ]
  },
  {
    "category": "Smoothies",
    "subcategories": [
      {
        "name": "Smoothies",
        "products": [
          {
            "dish_name": "Madras Protein Punch",
            "description": "A creamy, high-protein smoothie with a hint of South Indian flavor, perfect for post-workout.",
            "veg_or_nonveg": "Non-Veg",
            "dressing": "Classic Vinaigrette",
            "crunch_topping": "Mixed Seeds",
            "price": 379,
            "macros": {
              "calories": 380,
              "protein": 30,
              "carbs": 40,
              "fat": 12,
              "sugar": 18
            },
            "tags": "hp",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/rF84VWQQ/85-GREEN-DETOX-SMOOTHIE-BOWL.png",
            "image_closed_url": "/placeholder.svg"
          },
          {
            "dish_name": "Green Detox Elixir",
            "description": "A vibrant, cleansing smoothie packed with leafy greens and detoxifying fruits.",
            "veg_or_nonveg": "Veg",
            "dressing": "Classic Vinaigrette",
            "crunch_topping": "Mixed Seeds",
            "price": 309,
            "macros": {
              "calories": 250,
              "protein": 5,
              "carbs": 45,
              "fat": 5,
              "sugar": 15
            },
            "tags": "v, gf, df, wl",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/YqbWh9Pk/86-SPICED-APPLE-PIE-SMOOTHIE-BOWL.png",
            "image_closed_url": "/placeholder.svg"
          },
          {
            "dish_name": "Skin Glow Berry Blast",
            "description": "A refreshing smoothie rich in antioxidants and vitamins for radiant skin.",
            "veg_or_nonveg": "Veg",
            "dressing": "Classic Vinaigrette",
            "crunch_topping": "Mixed Seeds",
            "price": 329,
            "macros": {
              "calories": 320,
              "protein": 6,
              "carbs": 40,
              "fat": 15,
              "sugar": 12
            },
            "tags": "v, gf, df",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/htv7xnFm/87-MANGO-TURMERIC-GLOW-BOWL.png",
            "image_closed_url": "/placeholder.svg"
          },
          {
            "dish_name": "Weight Loss Warrior",
            "description": "A filling and low-calorie smoothie designed to support weight management.",
            "veg_or_nonveg": "Veg",
            "dressing": "Classic Vinaigrette",
            "crunch_topping": "Mixed Seeds",
            "price": 299,
            "macros": {
              "calories": 300,
              "protein": 12,
              "carbs": 35,
              "fat": 15,
              "sugar": 10
            },
            "tags": "v, gf, df, wl",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/Bv1LYCnQ/88-INDIAN-SUMMER-ROSE-SMOOTHIE-BOWL.png",
            "image_closed_url": "/placeholder.svg"
          },
          {
            "dish_name": "Tropical Vegan Dream",
            "description": "A creamy, dairy-free tropical escape with a blend of exotic fruits and coconut.",
            "veg_or_nonveg": "Veg",
            "dressing": "Classic Vinaigrette",
            "crunch_topping": "Mixed Seeds",
            "price": 339,
            "macros": {
              "calories": 350,
              "protein": 5,
              "carbs": 55,
              "fat": 12,
              "sugar": 28
            },
            "tags": "v, gf, df",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/NMqyWrK8/89-MADRAS-PROTEIN-PUNCH.png",
            "image_closed_url": "/placeholder.svg"
          },
          {
            "dish_name": "Coffee Kick Protein",
            "description": "Your morning coffee transformed into a high-protein, energizing smoothie.",
            "veg_or_nonveg": "Non-Veg",
            "dressing": "Classic Vinaigrette",
            "crunch_topping": "Mixed Seeds",
            "price": 369,
            "macros": {
              "calories": 360,
              "protein": 28,
              "carbs": 30,
              "fat": 15,
              "sugar": 10
            },
            "tags": "hp",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/DyYgJBWx/9-TANDOORI-PANEER-DELIGHT.png",
            "image_closed_url": "/placeholder.svg"
          },
          {
            "dish_name": "Amla & Ginger Immunity",
            "description": "A powerful immunity-boosting smoothie featuring Indian gooseberry (Amla) and ginger.",
            "veg_or_nonveg": "Veg",
            "dressing": "Classic Vinaigrette",
            "crunch_topping": "Mixed Seeds",
            "price": 319,
            "macros": {
              "calories": 280,
              "protein": 4,
              "carbs": 50,
              "fat": 5,
              "sugar": 22
            },
            "tags": "v, gf, df",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/B6T8sQFr/90-GREEN-DETOX-ELIXIR.png",
            "image_closed_url": "/placeholder.svg"
          },
          {
            "dish_name": "Chocolate Peanut Butter Bliss",
            "description": "A decadent yet healthy smoothie, combining rich chocolate with creamy peanut butter.",
            "veg_or_nonveg": "Veg",
            "dressing": "Classic Vinaigrette",
            "crunch_topping": "Mixed Seeds",
            "price": 359,
            "macros": {
              "calories": 400,
              "protein": 15,
              "carbs": 45,
              "fat": 20,
              "sugar": 20
            },
            "tags": "v, gf, df, hp",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/vTG4mFLc/91-SKIN-GLOW-BERRY-BLAST.png",
            "image_closed_url": "/placeholder.svg"
          }
        ]
      }
    ]
  },
  {
    "category": "Extras",
    "subcategories": [
      {
        "name": "Extras",
        "products": [
          {
            "dish_name": "Fresh Cold-Pressed Juices (Assorted)",
            "description": "A selection of 100% fresh, cold-pressed juices with no added sugar. Choose from Orange, Watermelon, Pineapple, or Carrot-Beet-Amla.",
            "veg_or_nonveg": "Veg",
            "dressing": "Classic Vinaigrette",
            "crunch_topping": "Mixed Seeds",
            "price": 219,
            "macros": {
              "calories": 150,
              "protein": 3,
              "carbs": 35,
              "fat": 0,
              "sugar": 28
            },
            "tags": "v, gf, df, wl",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/2jxqKyrv/92-WEIGHT-LOSS-WARRIOR.png",
            "image_closed_url": "/placeholder.svg"
          },
          {
            "dish_name": "Immunity Detox Shots (Pack of 3)",
            "description": "Concentrated shots designed to boost immunity and aid detoxification. A quick and potent wellness boost.",
            "veg_or_nonveg": "Veg",
            "dressing": "Classic Vinaigrette",
            "crunch_topping": "Mixed Seeds",
            "price": 149,
            "macros": {
              "calories": 40,
              "protein": 1,
              "carbs": 10,
              "fat": 0,
              "sugar": 5
            },
            "tags": "v, gf, df",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/RVV35mZY/93-TROPICAL-VEGAN-DREAM.png",
            "image_closed_url": "/placeholder.svg"
          },
          {
            "dish_name": "Hummus & Multigrain Pita",
            "description": "Creamy homemade hummus served with wholesome multigrain pita bread. Perfect for a healthy snack.",
            "veg_or_nonveg": "Veg",
            "dressing": "Classic Vinaigrette",
            "crunch_topping": "Mixed Seeds",
            "price": 249,
            "macros": {
              "calories": 300,
              "protein": 10,
              "carbs": 40,
              "fat": 12,
              "sugar": 3
            },
            "tags": "v, hp",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/CxRz54DH/94-COFFEE-KICK-PROTEIN.png",
            "image_closed_url": "/placeholder.svg"
          },
          {
            "dish_name": "Mediterranean Mezze Platter",
            "description": "A delightful platter with hummus, baba ghanoush, olives, and fresh veggie sticks. Ideal for sharing.",
            "veg_or_nonveg": "Veg",
            "dressing": "Classic Vinaigrette",
            "crunch_topping": "Mixed Seeds",
            "price": 349,
            "macros": {
              "calories": 380,
              "protein": 12,
              "carbs": 30,
              "fat": 25,
              "sugar": 7
            },
            "tags": "v, gf, df",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/MpgXQjmk/95-AMLA-GINGER-IMMUNITY-SMOOTHIE.png",
            "image_closed_url": "/placeholder.svg"
          },
          {
            "dish_name": "Protein Add-Ons (Per Serving)",
            "description": "Boost your meal's protein content with these convenient add-ons. Choose your favorite lean protein.",
            "veg_or_nonveg": "Non-Veg",
            "dressing": "Classic Vinaigrette",
            "crunch_topping": "Mixed Seeds",
            "price": 99,
            "macros": {
              "calories": 100,
              "protein": 15,
              "carbs": 5,
              "fat": 5,
              "sugar": 1
            },
            "tags": "hp, gf",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/tgPJtCBs/96-CHOCOLATE-PEANUT-BUTTER-BLISS.png",
            "image_closed_url": "/placeholder.svg"
          },
          {
            "dish_name": "Overnight Muesli Bowl",
            "description": "A classic muesli bowl soaked overnight for a soft texture, perfect for breakfast or a light snack.",
            "veg_or_nonveg": "Veg",
            "dressing": "Classic Vinaigrette",
            "crunch_topping": "Mixed Seeds",
            "price": 269,
            "macros": {
              "calories": 320,
              "protein": 8,
              "carbs": 50,
              "fat": 10,
              "sugar": 18
            },
            "tags": "v",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/xC2CsDZt/97-A-FRESH-COLD-PRESSED-JUICE.png",
            "image_closed_url": "/placeholder.svg"
          },
          {
            "dish_name": "Keto Paneer Skewers",
            "description": "Flavorful paneer skewers, grilled to perfection, a high-fat, low-carb keto-friendly side.",
            "veg_or_nonveg": "Veg",
            "dressing": "Classic Vinaigrette",
            "crunch_topping": "Mixed Seeds",
            "price": 299,
            "macros": {
              "calories": 280,
              "protein": 18,
              "carbs": 8,
              "fat": 20,
              "sugar": 2
            },
            "tags": "v, gf, kf",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/NFNjfyjz/97-B-FRESH-COLD-PRESSED-JUICE.png",
            "image_closed_url": "/placeholder.svg"
          },
          {
            "dish_name": "Sweet Potato Fries with Dip",
            "description": "Healthy baked sweet potato fries served with a creamy, wholesome dip. A guilt-free indulgence.",
            "veg_or_nonveg": "Veg",
            "dressing": "Classic Vinaigrette",
            "crunch_topping": "Mixed Seeds",
            "price": 229,
            "macros": {
              "calories": 250,
              "protein": 5,
              "carbs": 35,
              "fat": 10,
              "sugar": 8
            },
            "tags": "v, gf, wl",
            "recipe_link": "Coming Soon!",
            "image_opened_url": "https://i.postimg.cc/MKTG3Ys2/97-C-FRESH-COLD-PRESSED-JUICE.png",
            "image_closed_url": "/placeholder.svg"
          }
        ]
      }
    ]
  }
];