-- Continue adding menu items - Fusion Indian Salads
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
-- Salads -> Fusion Indian
('Tandoori Paneer Delight', 'Tandoori Paneer Delight', 'Classic tandoori paneer meets fresh greens in a vibrant, Indian-inspired salad with a smoky twist.', 'Salads', 'Fusion Indian', 'Veg', 'Mint & Tamarind Chutney Dressing', 'Crispy Sev', 349, '{"calories": 350, "protein": 20, "carbs": 25, "fat": 18, "sugar": 8}', 'v, gf', 'Coming Soon!', 'https://i.postimg.cc/qBLk1QNp/17-Methi-Sprout-Medley.png', 'https://i.postimg.cc/bv0kTTJc/12-SPICY-CHANA-CHAAT.png', true),
('Madras Chicken Tikka', 'Madras Chicken Tikka', 'Juicy chicken tikka pieces tossed with crisp vegetables and a zesty, South Indian-inspired dressing.', 'Salads', 'Fusion Indian', 'Non-Veg', 'Curry Leaf Chimichurri', 'Roasted Peanuts', 399, '{"calories": 390, "protein": 30, "carbs": 20, "fat": 20, "sugar": 4}', 'hp, gf', 'Coming Soon!', 'https://i.postimg.cc/7Ytqk61c/18-Bitter-Gourd-Chickpea.png', 'https://i.postimg.cc/1t96Yqng/13-MORINGA-MILLET-MEDLEY.png', true),
('Aam Papad Quinoa Salad', 'Aam Papad Quinoa Salad', 'A unique blend of sweet and tangy aam papad (mango fruit leather) with wholesome quinoa and fresh greens.', 'Salads', 'Fusion Indian', 'Veg', 'Kokum-Chilli Dressing', 'Toasted Coconut Flakes', 319, '{"calories": 320, "protein": 10, "carbs": 45, "fat": 10, "sugar": 15}', 'v, gf', 'Coming Soon!', 'https://i.postimg.cc/MphxnFFm/19-Spinach-Almond-Crunch.png', 'https://i.postimg.cc/XJQFMYds/14-DESI-BEETROOT-AND-PEANUT.png', true),
('Spicy Chana Chaat Salad', 'Spicy Chana Chaat Salad', 'A healthy, deconstructed chaat with spiced chickpeas, potatoes, and tangy elements.', 'Salads', 'Fusion Indian', 'Veg', 'Spicy Green Chutney Vinaigrette', 'Crushed Papdi', 289, '{"calories": 300, "protein": 15, "carbs": 40, "fat": 8, "sugar": 7}', 'v, wl', 'Coming Soon!', 'https://i.postimg.cc/6Q5VGM4T/2-CHICKEN-CHARGRILL-FEAST.png', 'https://i.postimg.cc/T2NmChRw/15-SPICED-GRILLED-FISH.png', true),
('Moringa & Millet Medley', 'Moringa & Millet Medley', 'A superfood-rich salad featuring nutritious millets and moringa, with a subtle Indian flavor profile.', 'Salads', 'Fusion Indian', 'Veg', 'Moringa Tahini Dressing', 'Roasted Fox Nuts (Makhana)', 309, '{"calories": 330, "protein": 12, "carbs": 48, "fat": 10, "sugar": 6}', 'v, gf, mg, wl', 'Coming Soon!', 'https://i.postimg.cc/50JV3F1H/20-Grilled-Chicken-Quinoa.png', 'https://i.postimg.cc/mD2zSWJC/16-CURRY-LEAF-AND-COCONUT-CRUNCH.png', true),
('Desi Beetroot & Peanut', 'Desi Beetroot & Peanut', 'Earthy beetroot and crunchy peanuts come together in a vibrant, wholesome Indian-inspired salad.', 'Salads', 'Fusion Indian', 'Veg', 'Peanut-Sesame Chutney Vinaigrette', 'Crushed Roasted Peanuts', 299, '{"calories": 310, "protein": 10, "carbs": 35, "fat": 15, "sugar": 9}', 'v, gf', 'Coming Soon!', 'https://i.postimg.cc/xdMQMPrD/21-Avocado-Black-Bean.png', 'https://i.postimg.cc/sxbMyQX4/17-METHI-AND-SPROUT-MEDLEY.png', true),
('Spiced Grilled Fish Salad', 'Spiced Grilled Fish Salad', 'Flaky grilled fish marinated in Indian spices, served with fresh greens and a tangy dressing.', 'Salads', 'Fusion Indian', 'Non-Veg', 'Ginger-Garlic-Green Chili Dressing', 'Crispy Curry Leaves', 429, '{"calories": 380, "protein": 32, "carbs": 15, "fat": 20, "sugar": 3}', 'hp, gf', 'Coming Soon!', 'https://i.postimg.cc/9FrvyBT8/22-Lentil-Cucumber-Fresco.png', 'https://i.postimg.cc/054M73fK/18-BITTER-GOURD-AND-CHICKPEA.png', true),
('Curry Leaf & Coconut Crunch', 'Curry Leaf & Coconut Crunch', 'A unique South Indian inspired salad with the aromatic flavor of curry leaves and creamy coconut. Available with Chicken for non-veg option.', 'Salads', 'Fusion Indian', 'Veg', 'Beetroot-Coconut Dressing', 'Roasted Urad Dal', 359, '{"calories": 360, "protein": 18, "carbs": 28, "fat": 20, "sugar": 6}', 'v, gf', 'Coming Soon!', 'https://i.postimg.cc/Pq46gLYv/23-Cottage-Cheese-Greens.png', 'https://i.postimg.cc/htLXWGqV/19-SPINACH-AND-ALMOND-CRUNCH.png', true);