import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BuyNowButton from "@/components/BuyNowButton";
import { ChevronDown, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  dish_name: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  image_opened_url: string | null;
  category: string | null;
  subcategory: string | null;
  veg_or_nonveg: string | null;
  dressing: string | null;
  crunch_topping: string | null;
  macros: any;
  tags: string | null;
  recipe_link: string | null;
  swiggy_url: string | null;
  zomato_url: string | null;
  is_enabled: boolean;
}

const Products = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [expandedCategory, setExpandedCategory] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDisabled, setShowDisabled] = useState(false);

  // Get unique categories and subcategories from products
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const getSubcategories = (category: string) => 
    [...new Set(products.filter(p => p.category === category).map(p => p.subcategory).filter(Boolean))];

  useEffect(() => {
    fetchProducts();
    checkAdminRole();

    // Listen for hamburger menu clicks from header
    const handleOpenSidebar = () => {
      setSidebarOpen(true);
    };

    window.addEventListener('openProductsSidebar', handleOpenSidebar);
    
    return () => {
      window.removeEventListener('openProductsSidebar', handleOpenSidebar);
    };
  }, []);

  useEffect(() => {
    // Filter products based on admin view and show disabled toggle
    const visibleProducts = showDisabled && isAdmin ? allProducts : allProducts.filter(p => p.is_enabled);
    setProducts(visibleProducts);
    setFilteredProducts(visibleProducts);
  }, [allProducts, showDisabled, isAdmin]);

  const checkAdminRole = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setIsAdmin(!!data);
    } catch (error) {
      console.error('Error checking admin role:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      // Fetch all products if admin, only enabled if not
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('dish_name');

      if (error) throw error;
      
      const productsData = data || [];
      setAllProducts(productsData);
      
      // Initially show only enabled products
      const enabledProducts = productsData.filter(p => p.is_enabled);
      setProducts(enabledProducts);
      setFilteredProducts(enabledProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error loading products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_enabled: !currentStatus })
        .eq('id', productId);

      if (error) throw error;

      // Update local state
      setAllProducts(prev => 
        prev.map(p => p.id === productId ? { ...p, is_enabled: !currentStatus } : p)
      );

      toast({
        title: `Product ${!currentStatus ? 'enabled' : 'disabled'} successfully`,
      });
    } catch (error) {
      console.error('Error updating product status:', error);
      toast({
        title: "Error updating product",
        variant: "destructive"
      });
    }
  };

  const handleCategoryClick = (category: string) => {
    if (expandedCategory === category) {
      setExpandedCategory("");
      setSelectedCategory("");
      setFilteredProducts(products);
    } else {
      setExpandedCategory(category);
      setSelectedCategory(category);
      setSelectedSubcategory("");
      
      const categoryProducts = products.filter(p => p.category === category);
      setFilteredProducts(categoryProducts);
    }
  };

  const handleSubcategoryClick = (category: string, subcategory: string) => {
    setSelectedSubcategory(subcategory);
    
    const subcategoryProducts = products.filter(p => 
      p.category === category && p.subcategory === subcategory
    );
    setFilteredProducts(subcategoryProducts);
    setSidebarOpen(false);
  };

  const getDietaryTags = (tags: string | null) => {
    if (!tags) return [];
    
    const tagArray = tags.split(', ').map(tag => tag.trim());
    const tagMap: { [key: string]: { label: string; color: string } } = {
      'v': { label: 'Veg', color: 'bg-green-100 text-green-800' },
      'nv': { label: 'Non-Veg', color: 'bg-red-100 text-red-800' },
      'gf': { label: 'Gluten Free', color: 'bg-blue-100 text-blue-800' },
      'df': { label: 'Dairy Free', color: 'bg-purple-100 text-purple-800' },
      'hp': { label: 'High Protein', color: 'bg-amber-100 text-amber-800' },
      'wl': { label: 'Weight Loss', color: 'bg-emerald-100 text-emerald-800' }
    };

    return tagArray.map(tag => tagMap[tag]).filter(Boolean);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        {/* Category Panel */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-80 p-0">
            <div className="h-full bg-card text-card-foreground">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-foreground">Menu Categories</h2>
              </div>
              
              <div className="p-4 space-y-2">
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    setSelectedSubcategory("");
                    setExpandedCategory("");
                    setFilteredProducts(products);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedCategory === ""
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  All Products
                </button>
                
                {categories.map((category) => (
                  <div key={category} className="space-y-1">
                    <button
                      onClick={() => handleCategoryClick(category)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
                        selectedCategory === category
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span>{category}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          expandedCategory === category ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    {expandedCategory === category && (
                      <div className="ml-4 space-y-1 animate-accordion-down">
                        {getSubcategories(category).map((subcategory) => (
                          <button
                            key={subcategory}
                            onClick={() => handleSubcategoryClick(category, subcategory)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                              selectedSubcategory === subcategory
                                ? 'bg-primary/5 text-primary underline'
                                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {subcategory}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {selectedSubcategory ? `${selectedCategory} - ${selectedSubcategory}` : 
                   selectedCategory || 'All Products'}
                </h1>
                <p className="text-muted-foreground mt-2">
                  {filteredProducts.length} delicious options available
                </p>
              </div>
              
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center sm:justify-items-stretch">
            {filteredProducts.map((item) => (
              <Card
                key={item.id}
                className={`group cursor-pointer transition-all duration-500 hover:shadow-lg hover:scale-105 bg-gradient-to-br from-gray-50 to-green-50 border-border hover:border-green-300 max-w-[320px] relative z-10 ${
                  !item.is_enabled ? 'opacity-50' : ''
                }`}
                onClick={() => setSelectedProduct(item)}
              >
                
                <div 
                  className="aspect-[5:4] bg-muted rounded-t-xl relative overflow-hidden"
                  onMouseEnter={() => setHoveredCard(item.dish_name)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <img 
                    src={hoveredCard === item.dish_name ? item.image_opened_url : (item.image_url || item.image_opened_url)} 
                    alt={item.dish_name}
                    className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-110"
                    style={{ objectPosition: hoveredCard === item.dish_name ? 'center' : 'center 30%' }}
                  />
                   <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-white font-semibold bg-black/40 px-3 py-1 rounded text-sm">
                      View Details
                    </span>
                  </div>
                </div>
                
                <CardHeader className="pb-2 p-3">
                  <CardTitle className="text-base font-bold text-foreground leading-tight">{item.dish_name}</CardTitle>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600">₹{item.price}</span>
                    <Badge variant={item.veg_or_nonveg === "Veg" ? "secondary" : "destructive"} className="text-xs">
                      {item.veg_or_nonveg}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-3 pt-0">
                  <div className="space-y-2">
                    {item.dressing && (
                      <div className="text-xs text-muted-foreground">
                        <strong>Dressing:</strong> {item.dressing}
                      </div>
                    )}
                    
                    {item.macros && (
                      <div className="bg-green-50 p-2 rounded-lg">
                        <div className="text-xs text-green-800 font-medium mb-1">Nutrition</div>
                        <div className="grid grid-cols-2 gap-1 text-xs text-green-700">
                          <div>Cal: {item.macros.calories || 0}</div>
                          <div>Pro: {item.macros.protein || 0}g</div>
                          <div>Carb: {item.macros.carbs || 0}g</div>
                          <div>Fat: {item.macros.fat || 0}g</div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1">
                      {getDietaryTags(item.tags).map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs bg-green-100 text-green-800 border-green-300 px-1 py-0">
                          {tag.label}
                        </Badge>
                      ))}
                    </div>

                    <div onClick={(e) => e.stopPropagation()} className="relative z-50">
                      <BuyNowButton
                        productName={item.dish_name}
                        swiggyUrl={item.swiggy_url}
                        zomatoUrl={item.zomato_url}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {selectedProduct.dish_name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <Carousel className="w-full max-w-lg mx-auto">
                  <CarouselContent>
                    <CarouselItem>
                      <div className="aspect-square rounded-xl overflow-hidden">
                        <img 
                          src={selectedProduct.image_url || selectedProduct.image_opened_url} 
                          alt={selectedProduct.dish_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                    {selectedProduct.image_opened_url && selectedProduct.image_opened_url !== selectedProduct.image_url && (
                      <CarouselItem>
                        <div className="aspect-square rounded-xl overflow-hidden">
                          <img 
                            src={selectedProduct.image_opened_url} 
                            alt={`${selectedProduct.dish_name} opened`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    )}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
                
                {selectedProduct.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">{selectedProduct.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  {selectedProduct.dressing && (
                    <div>
                      <h4 className="font-medium mb-1">Dressing</h4>
                      <p className="text-sm text-muted-foreground">{selectedProduct.dressing}</p>
                    </div>
                  )}
                  {selectedProduct.crunch_topping && (
                    <div>
                      <h4 className="font-medium mb-1">Crunch Topping</h4>
                      <p className="text-sm text-muted-foreground">{selectedProduct.crunch_topping}</p>
                    </div>
                  )}
                </div>
                
                {selectedProduct.macros && (
                  <div className="bg-green-50 p-4 rounded-lg border">
                    <h4 className="font-semibold mb-2 text-green-800">Nutrition Information</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm text-green-700">
                      <div>Calories: {selectedProduct.macros.calories || 0}</div>
                      <div>Protein: {selectedProduct.macros.protein || 0}g</div>
                      <div>Carbs: {selectedProduct.macros.carbs || 0}g</div>
                      <div>Fat: {selectedProduct.macros.fat || 0}g</div>
                      <div>Sugar: {selectedProduct.macros.sugar || 0}g</div>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {getDietaryTags(selectedProduct.tags).map((tag, index) => (
                    <Badge key={index} className="bg-green-100 text-green-800 border-green-300">
                      {tag.label}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-2xl font-bold text-green-600">₹{selectedProduct.price}</span>
                  <BuyNowButton
                    productName={selectedProduct.dish_name}
                    swiggyUrl={selectedProduct.swiggy_url}
                    zomatoUrl={selectedProduct.zomato_url}
                  />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Products;