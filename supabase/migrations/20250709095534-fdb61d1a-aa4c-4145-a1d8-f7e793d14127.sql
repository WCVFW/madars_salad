-- Insert all 104 menu items from the JSON data into the products table
-- First, let's clear any existing test data and then add all the menu items

-- Clear existing products (if any test data exists)
DELETE FROM products WHERE name LIKE 'Test%' OR name = 'Sample Product';

-- Insert all menu items from the JSON data
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
-- Salads -> High Protein
('Paneer Power Bowl', 'Paneer Power Bowl', 'A robust salad packed with grilled paneer and a medley of protein-rich legumes for sustained energy.', 'Salads', 'High Protein', 'Veg', 'Mint-Coriander Yogurt Raita', 'Roasted Pumpkin Seeds', 369, '{"calories": 420, "protein": 28, "carbs": 35, "fat": 20, "sugar": 5}', 'v, gf, hp', 'Coming Soon!', 'https://i.postimg.cc/ydpZ9B4b/1-PANEER-POWER-BOWL.png', 'https://i.postimg.cc/tJ3KR8Rv/1-PANEER-POWER-BOWL.png', true),
('Chicken Chargrill Feast', 'Chicken Chargrill Feast', 'Succulent grilled chicken breast with a vibrant mix of greens and a protein punch from eggs and lentils.', 'Salads', 'High Protein', 'Non-Veg', 'Curry Leaf Chimichurri', 'Toasted Almond Flakes', 419, '{"calories": 450, "protein": 38, "carbs": 25, "fat": 22, "sugar": 3}', 'hp, gf', 'Coming Soon!', 'https://i.postimg.cc/sXWMBWmv/10-Madras-Chicken-Tikka.png', 'https://i.postimg.cc/wMjX3m9K/10-MADRAS-CHICKEN-TIKKA.png', true),
('Tofu & Edamame Zing', 'Tofu & Edamame Zing', 'A vegan delight featuring pan-seared tofu and edamame, offering a complete protein profile with fresh veggies.', 'Salads', 'High Protein', 'Veg', 'Peanut-Sesame Chutney Vinaigrette', 'Crispy Fried Onions', 349, '{"calories": 390, "protein": 25, "carbs": 30, "fat": 18, "sugar": 6}', 'v, df, hp, gf', 'Coming Soon!', 'https://i.postimg.cc/tRh1ph7c/11-Aam-Papad-Quinoa-Salad.png', 'https://i.postimg.cc/26kYbzMR/100-MEDITERRANEAN-MEZZE-PLATTER.png', true),
('Spiced Chickpea & Quinoa', 'Spiced Chickpea & Quinoa', 'A hearty vegetarian option with spiced chickpeas and quinoa, rich in plant-based protein and fiber.', 'Salads', 'High Protein', 'Veg', 'Tamarind-Date Vinaigrette', 'Roasted Cashew Halves', 329, '{"calories": 380, "protein": 22, "carbs": 45, "fat": 12, "sugar": 8}', 'v, gf, hp, wl', 'Coming Soon!', 'https://i.postimg.cc/L62JXn18/12-Spicy-Chana-Chaat-Salad.png', 'https://i.postimg.cc/L40S5FVw/101-PROTEIN-ADD-ONS.png', true),
('Smoked Salmon & Avocado', 'Smoked Salmon & Avocado', 'Premium smoked salmon and creamy avocado paired with a nutrient-dense base for a high-protein, healthy fat meal.', 'Salads', 'High Protein', 'Non-Veg', 'Lemon-Dill Yogurt Dressing', 'Hemp Seeds', 429, '{"calories": 480, "protein": 35, "carbs": 15, "fat": 30, "sugar": 4}', 'hp, gf', 'Coming Soon!', 'https://i.postimg.cc/bNgs2pxH/13-Moringa-Millet-Medley.png', 'https://i.postimg.cc/m2vG33JS/102-OVERNIGHT-MUESLI-BOWL.png', true),
('Lentil & Feta Medley', 'Lentil & Feta Medley', 'A Mediterranean-inspired salad with protein-packed lentils and savory feta, perfect for a balanced meal.', 'Salads', 'High Protein', 'Veg', 'Balsamic Herb Vinaigrette', 'Toasted Walnuts', 339, '{"calories": 370, "protein": 20, "carbs": 38, "fat": 15, "sugar": 6}', 'v, gf, hp', 'Coming Soon!', 'https://i.postimg.cc/t4fRhTYP/14-Desi-Beetroot-Peanut.png', 'https://i.postimg.cc/3w75V8K4/103-KETO-PANEER-SKEWERS.png', true),
('Sprouts & Seed Power', 'Sprouts & Seed Power', 'A light yet potent salad featuring a variety of sprouts and seeds for a concentrated protein and nutrient boost.', 'Salads', 'High Protein', 'Veg', 'Lemon-Ginger Vinaigrette', 'Mixed Roasted Seeds (Flax, Chia, Sunflower)', 299, '{"calories": 310, "protein": 18, "carbs": 30, "fat": 12, "sugar": 5}', 'v, gf, hp, wl', 'Coming Soon!', 'https://i.postimg.cc/zBwJZFpS/15-Spiced-Grilled-Fish-Salad.png', 'https://i.postimg.cc/QtdLNfKj/104-SWEET-POTATO-FRIES.png', true),
('Grilled Halloumi & Berry', 'Grilled Halloumi & Berry', 'Grilled halloumi cheese offers a satisfying protein, complemented by fresh berries and a vibrant green base.', 'Salads', 'High Protein', 'Veg', 'Raspberry Balsamic Dressing', 'Candied Pecans', 379, '{"calories": 400, "protein": 26, "carbs": 30, "fat": 20, "sugar": 10}', 'v, hp, gf', 'Coming Soon!', 'https://i.postimg.cc/KjJx4c61/16-Curry-Leaf-Coconut-Crunch.png', 'https://i.postimg.cc/8P3RPc33/11-AAM-PAPAD-QUINOA.png', true);