-- Continue adding menu items - Multiple categories
INSERT INTO products (
  name, 
  dish_name, 
  description, 
  category, 
  subcategory,
  veg_or_nonveg,
  dressing,
  crunch_topping,
  price,
  macros,
  tags,
  recipe_link,
  image_url,
  image_opened_url,
  is_enabled
) VALUES
-- Salads -> Diabetic-Friendly
('Methi & Sprout Medley', 'Methi & Sprout Medley', 'A low-GI salad featuring fenugreek leaves and nutrient-rich sprouts, designed for blood sugar management.', 'Salads', 'Diabetic-Friendly', 'Veg', 'Lemon-Herb Vinaigrette', 'Toasted Flax Seeds', 299, '{"calories": 280, "protein": 12, "carbs": 25, "fat": 15, "sugar": 4}', 'v, gf, wl', 'Coming Soon!', 'https://i.postimg.cc/V5QBr1Xc/24-Broccoli-Sprouted-Moong.png', 'https://i.postimg.cc/Lsg06GNk/2-CHARGRILL-CHICKEN-FEAST.png', true),
('Bitter Gourd & Chickpea', 'Bitter Gourd & Chickpea', 'A unique blend of bitter gourd (karela) with protein-rich chickpeas, known for its blood sugar benefits.', 'Salads', 'Diabetic-Friendly', 'Veg', 'Light Cumin-Lime Dressing', 'Bitter Gourd Crisps', 289, '{"calories": 290, "protein": 14, "carbs": 30, "fat": 12, "sugar": 5}', 'v, gf, hp', 'Coming Soon!', 'https://i.postimg.cc/MKVgspPV/25-Lean-Green-Detox.png', 'https://i.postimg.cc/766h2MJN/20-GRILLED-CHICKEN-AND-QUINOA.png', true),
('Spinach & Almond Crunch', 'Spinach & Almond Crunch', 'A vibrant, low-carb salad with iron-rich spinach and healthy fats from almonds.', 'Salads', 'Diabetic-Friendly', 'Veg', 'Apple Cider Vinaigrette', 'Sliced Almonds', 309, '{"calories": 320, "protein": 10, "carbs": 18, "fat": 25, "sugar": 4}', 'v, gf, kf', 'Coming Soon!', 'https://i.postimg.cc/MZRswr78/26-Berry-Blast-Slim.png', 'https://i.postimg.cc/W3H36FMc/21-AVOCADO-AND-BLACK-BEAN.png', true),
('Grilled Chicken & Quinoa', 'Grilled Chicken & Quinoa', 'Lean grilled chicken and low-GI quinoa combine for a satisfying and blood sugar-friendly meal.', 'Salads', 'Diabetic-Friendly', 'Non-Veg', 'Dijon-Herb Vinaigrette', 'Roasted Sunflower Seeds', 399, '{"calories": 380, "protein": 30, "carbs": 30, "fat": 18, "sugar": 3}', 'hp, gf, wl', 'Coming Soon!', 'https://i.postimg.cc/vZPhXRs5/27-Quinoa-Veggie-Power.png', 'https://i.postimg.cc/w3KjZCfW/22-LENTIL-AND-CUCUMBER-FRESCO.png', true),
('Avocado & Black Bean', 'Avocado & Black Bean', 'Creamy avocado and fiber-rich black beans provide a balanced, diabetic-friendly option.', 'Salads', 'Diabetic-Friendly', 'Veg', 'Zesty Lime-Cilantro Dressing', 'Crushed Walnuts', 349, '{"calories": 360, "protein": 15, "carbs": 35, "fat": 20, "sugar": 6}', 'v, gf, hp', 'Coming Soon!', 'https://i.postimg.cc/9FrvyBT8/22-Lentil-Cucumber-Fresco.png', 'https://i.postimg.cc/xdMQMPrD/21-Avocado-Black-Bean.png', true),
('Lentil & Cucumber Fresco', 'Lentil & Cucumber Fresco', 'A refreshing and low-carb salad with cooling cucumber and protein-packed lentils.', 'Salads', 'Diabetic-Friendly', 'Veg', 'Fresh Mint-Lime Dressing', 'Toasted Cumin Seeds', 279, '{"calories": 270, "protein": 14, "carbs": 28, "fat": 10, "sugar": 4}', 'v, gf, hp', 'Coming Soon!', 'https://i.postimg.cc/prxKRkv2/29-Cabbage-Crunch-Chicken.png', 'https://i.postimg.cc/rs4rDC7P/24-BROCCOLI-AND-SPROUTED-MOONG.png', true),
('Cottage Cheese & Greens', 'Cottage Cheese & Greens', 'A simple yet effective salad with high-protein cottage cheese and a generous serving of greens.', 'Salads', 'Diabetic-Friendly', 'Veg', 'Light Yogurt-Dill Dressing', 'Chia Seeds', 359, '{"calories": 350, "protein": 25, "carbs": 15, "fat": 20, "sugar": 3}', 'v, gf, hp, kf', 'Coming Soon!', 'https://i.postimg.cc/3wSXj221/3-TOFU-AND-EDAMAME-ZING.png', 'https://i.postimg.cc/Vs0MZm5W/25-LEAN-GREEN-DETOX.png', true),
('Broccoli & Sprouted Moong', 'Broccoli & Sprouted Moong', 'A nutrient-dense salad with crisp broccoli and sprouted moong, ideal for managing blood sugar levels.', 'Salads', 'Diabetic-Friendly', 'Veg', 'Lemon-Garlic Vinaigrette', 'Roasted Peanuts', 289, '{"calories": 290, "protein": 16, "carbs": 30, "fat": 10, "sugar": 5}', 'v, gf, hp', 'Coming Soon!', 'https://i.postimg.cc/PrVvRdCf/30-Watermelon-Feta-Fresco.png', 'https://i.postimg.cc/yYqRwtZ4/26-BERRY-BLAST-SLIM.png', true);