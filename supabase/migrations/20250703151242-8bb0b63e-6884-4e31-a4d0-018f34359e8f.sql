-- First, let's add any missing columns to the products table that we need for the menu data
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS veg_or_nonveg TEXT,
ADD COLUMN IF NOT EXISTS dressing TEXT,
ADD COLUMN IF NOT EXISTS crunch_topping TEXT,
ADD COLUMN IF NOT EXISTS macros JSONB,
ADD COLUMN IF NOT EXISTS tags TEXT,
ADD COLUMN IF NOT EXISTS recipe_link TEXT,
ADD COLUMN IF NOT EXISTS image_opened_url TEXT,
ADD COLUMN IF NOT EXISTS subcategory TEXT;

-- Clear existing products data to avoid duplicates
DELETE FROM public.products;

-- Insert Salads category data into products table
-- High Protein subcategory
INSERT INTO public.products (name, description, veg_or_nonveg, dressing, crunch_topping, price, macros, tags, recipe_link, image_opened_url, image_url, category, subcategory, is_active) VALUES
('Paneer Power Bowl', 'A robust salad packed with grilled paneer and a medley of protein-rich legumes for sustained energy.', 'Veg', 'Mint-Coriander Yogurt Raita', 'Roasted Pumpkin Seeds', 369, '{"calories": 420, "protein": 28, "carbs": 35, "fat": 20, "sugar": 5}', 'v, gf, hp', 'Coming Soon!', 'https://i.postimg.cc/tJ3KR8Rv/1-PANEER-POWER-BOWL.png', 'https://i.postimg.cc/ydpZ9B4b/1-PANEER-POWER-BOWL.png', 'Salads', 'High Protein', true),

('Chicken Chargrill Feast', 'Succulent grilled chicken breast with a vibrant mix of greens and a protein punch from eggs and lentils.', 'Non-Veg', 'Curry Leaf Chimichurri', 'Toasted Almond Flakes', 419, '{"calories": 450, "protein": 38, "carbs": 25, "fat": 22, "sugar": 3}', 'hp, gf', 'Coming Soon!', 'https://i.postimg.cc/wMjX3m9K/10-MADRAS-CHICKEN-TIKKA.png', 'https://i.postimg.cc/sXWMBWmv/10-Madras-Chicken-Tikka.png', 'Salads', 'High Protein', true),

('Tofu & Edamame Zing', 'A vegan delight featuring pan-seared tofu and edamame, offering a complete protein profile with fresh veggies.', 'Veg', 'Peanut-Sesame Chutney Vinaigrette', 'Crispy Fried Onions', 349, '{"calories": 390, "protein": 25, "carbs": 30, "fat": 18, "sugar": 6}', 'v, df, hp, gf', 'Coming Soon!', 'https://i.postimg.cc/26kYbzMR/100-MEDITERRANEAN-MEZZE-PLATTER.png', 'https://i.postimg.cc/tRh1ph7c/11-Aam-Papad-Quinoa-Salad.png', 'Salads', 'High Protein', true),

('Spiced Chickpea & Quinoa', 'A hearty vegetarian option with spiced chickpeas and quinoa, rich in plant-based protein and fiber.', 'Veg', 'Tamarind-Date Vinaigrette', 'Roasted Cashew Halves', 329, '{"calories": 380, "protein": 22, "carbs": 45, "fat": 12, "sugar": 8}', 'v, gf, hp, wl', 'Coming Soon!', 'https://i.postimg.cc/L40S5FVw/101-PROTEIN-ADD-ONS.png', 'https://i.postimg.cc/L62JXn18/12-Spicy-Chana-Chaat-Salad.png', 'Salads', 'High Protein', true),

('Smoked Salmon & Avocado', 'Premium smoked salmon and creamy avocado paired with a nutrient-dense base for a high-protein, healthy fat meal.', 'Non-Veg', 'Lemon-Dill Yogurt Dressing', 'Hemp Seeds', 429, '{"calories": 480, "protein": 35, "carbs": 15, "fat": 30, "sugar": 4}', 'hp, gf', 'Coming Soon!', 'https://i.postimg.cc/m2vG33JS/102-OVERNIGHT-MUESLI-BOWL.png', 'https://i.postimg.cc/bNgs2pxH/13-Moringa-Millet-Medley.png', 'Salads', 'High Protein', true),

('Lentil & Feta Medley', 'A Mediterranean-inspired salad with protein-packed lentils and savory feta, perfect for a balanced meal.', 'Veg', 'Balsamic Herb Vinaigrette', 'Toasted Walnuts', 339, '{"calories": 370, "protein": 20, "carbs": 38, "fat": 15, "sugar": 6}', 'v, gf, hp', 'Coming Soon!', 'https://i.postimg.cc/3w75V8K4/103-KETO-PANEER-SKEWERS.png', 'https://i.postimg.cc/t4fRhTYP/14-Desi-Beetroot-Peanut.png', 'Salads', 'High Protein', true),

('Sprouts & Seed Power', 'A light yet potent salad featuring a variety of sprouts and seeds for a concentrated protein and nutrient boost.', 'Veg', 'Lemon-Ginger Vinaigrette', 'Mixed Roasted Seeds (Flax, Chia, Sunflower)', 299, '{"calories": 310, "protein": 18, "carbs": 30, "fat": 12, "sugar": 5}', 'v, gf, hp, wl', 'Coming Soon!', 'https://i.postimg.cc/QtdLNfKj/104-SWEET-POTATO-FRIES.png', 'https://i.postimg.cc/zBwJZFpS/15-Spiced-Grilled-Fish-Salad.png', 'Salads', 'High Protein', true),

('Grilled Halloumi & Berry', 'Grilled halloumi cheese offers a satisfying protein, complemented by fresh berries and a vibrant green base.', 'Veg', 'Raspberry Balsamic Dressing', 'Candied Pecans', 379, '{"calories": 400, "protein": 26, "carbs": 30, "fat": 20, "sugar": 10}', 'v, hp, gf', 'Coming Soon!', 'https://i.postimg.cc/8P3RPc33/11-AAM-PAPAD-QUINOA.png', 'https://i.postimg.cc/KjJx4c61/16-Curry-Leaf-Coconut-Crunch.png', 'Salads', 'High Protein', true);

-- Continue with a second batch for better readability
INSERT INTO public.products (name, description, veg_or_nonveg, dressing, crunch_topping, price, macros, tags, recipe_link, image_opened_url, image_url, category, subcategory, is_active) VALUES
-- Fusion Indian subcategory
('Tandoori Paneer Delight', 'Classic tandoori paneer meets fresh greens in a vibrant, Indian-inspired salad with a smoky twist.', 'Veg', 'Mint & Tamarind Chutney Dressing', 'Crispy Sev', 349, '{"calories": 350, "protein": 20, "carbs": 25, "fat": 18, "sugar": 8}', 'v, gf', 'Coming Soon!', 'https://i.postimg.cc/bv0kTTJc/12-SPICY-CHANA-CHAAT.png', 'https://i.postimg.cc/qBLk1QNp/17-Methi-Sprout-Medley.png', 'Salads', 'Fusion Indian', true),

('Madras Chicken Tikka', 'Juicy chicken tikka pieces tossed with crisp vegetables and a zesty, South Indian-inspired dressing.', 'Non-Veg', 'Curry Leaf Chimichurri', 'Roasted Peanuts', 399, '{"calories": 390, "protein": 30, "carbs": 20, "fat": 20, "sugar": 4}', 'hp, gf', 'Coming Soon!', 'https://i.postimg.cc/1t96Yqng/13-MORINGA-MILLET-MEDLEY.png', 'https://i.postimg.cc/7Ytqk61c/18-Bitter-Gourd-Chickpea.png', 'Salads', 'Fusion Indian', true),

('Aam Papad Quinoa Salad', 'A unique blend of sweet and tangy aam papad (mango fruit leather) with wholesome quinoa and fresh greens.', 'Veg', 'Kokum-Chilli Dressing', 'Toasted Coconut Flakes', 319, '{"calories": 320, "protein": 10, "carbs": 45, "fat": 10, "sugar": 15}', 'v, gf', 'Coming Soon!', 'https://i.postimg.cc/XJQFMYds/14-DESI-BEETROOT-AND-PEANUT.png', 'https://i.postimg.cc/MphxnFFm/19-Spinach-Almond-Crunch.png', 'Salads', 'Fusion Indian', true),

('Spicy Chana Chaat Salad', 'A healthy, deconstructed chaat with spiced chickpeas, potatoes, and tangy elements.', 'Veg', 'Spicy Green Chutney Vinaigrette', 'Crushed Papdi', 289, '{"calories": 300, "protein": 15, "carbs": 40, "fat": 8, "sugar": 7}', 'v, wl', 'Coming Soon!', 'https://i.postimg.cc/T2NmChRw/15-SPICED-GRILLED-FISH.png', 'https://i.postimg.cc/6Q5VGM4T/2-CHICKEN-CHARGRILL-FEAST.png', 'Salads', 'Fusion Indian', true),

('Moringa & Millet Medley', 'A superfood-rich salad featuring nutritious millets and moringa, with a subtle Indian flavor profile.', 'Veg', 'Moringa Tahini Dressing', 'Roasted Fox Nuts (Makhana)', 309, '{"calories": 330, "protein": 12, "carbs": 48, "fat": 10, "sugar": 6}', 'v, gf, mg, wl', 'Coming Soon!', 'https://i.postimg.cc/mD2zSWJC/16-CURRY-LEAF-AND-COCONUT-CRUNCH.png', 'https://i.postimg.cc/50JV3F1H/20-Grilled-Chicken-Quinoa.png', 'Salads', 'Fusion Indian', true),

('Desi Beetroot & Peanut', 'Earthy beetroot and crunchy peanuts come together in a vibrant, wholesome Indian-inspired salad.', 'Veg', 'Peanut-Sesame Chutney Vinaigrette', 'Crushed Roasted Peanuts', 299, '{"calories": 310, "protein": 10, "carbs": 35, "fat": 15, "sugar": 9}', 'v, gf', 'Coming Soon!', 'https://i.postimg.cc/sxbMyQX4/17-METHI-AND-SPROUT-MEDLEY.png', 'https://i.postimg.cc/xdMQMPrD/21-Avocado-Black-Bean.png', 'Salads', 'Fusion Indian', true),

('Spiced Grilled Fish Salad', 'Flaky grilled fish marinated in Indian spices, served with fresh greens and a tangy dressing.', 'Non-Veg', 'Ginger-Garlic-Green Chili Dressing', 'Crispy Curry Leaves', 429, '{"calories": 380, "protein": 32, "carbs": 15, "fat": 20, "sugar": 3}', 'hp, gf', 'Coming Soon!', 'https://i.postimg.cc/054M73fK/18-BITTER-GOURD-AND-CHICKPEA.png', 'https://i.postimg.cc/9FrvyBT8/22-Lentil-Cucumber-Fresco.png', 'Salads', 'Fusion Indian', true),

('Curry Leaf & Coconut Crunch', 'A unique South Indian inspired salad with the aromatic flavor of curry leaves and creamy coconut. Available with Chicken for non-veg option.', 'Veg', 'Beetroot-Coconut Dressing', 'Roasted Urad Dal', 359, '{"calories": 360, "protein": 18, "carbs": 28, "fat": 20, "sugar": 6}', 'v, gf', 'Coming Soon!', 'https://i.postimg.cc/htLXWGqV/19-SPINACH-AND-ALMOND-CRUNCH.png', 'https://i.postimg.cc/Pq46gLYv/23-Cottage-Cheese-Greens.png', 'Salads', 'Fusion Indian', true);