import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Edit, Trash2, Eye, Package } from "lucide-react";
import CSVImportProducts from "./CSVImportProducts";

interface Product {
  id: string;
  dish_name: string | null;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  subcategory: string | null;
  veg_or_nonveg: string | null;
  dressing: string | null;
  crunch_topping: string | null;
  tags: string | null;
  macros: any;
  is_enabled: boolean | null;
  image_url: string | null;
  image_opened_url: string | null;
  recipe_link: string | null;
  swiggy_url: string | null;
  zomato_url: string | null;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const emptyProduct: Omit<Product, 'id'> = {
    dish_name: '',
    name: '',
    description: '',
    price: 0,
    category: '',
    subcategory: '',
    veg_or_nonveg: 'Veg',
    dressing: '',
    crunch_topping: '',
    tags: '',
    macros: { protein: 0, carbs: 0, fat: 0, calories: 0, sugar: 0 },
    is_enabled: true,
    image_url: '',
    image_opened_url: '',
    recipe_link: '',
    swiggy_url: '',
    zomato_url: ''
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('dish_name');

      if (error) throw error;
      setProducts(data || []);
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

  const toggleProductStatus = async (productId: string, currentStatus: boolean | null) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_enabled: !currentStatus })
        .eq('id', productId);

      if (error) throw error;

      setProducts(prev => 
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

  const saveProduct = async (product: Omit<Product, 'id'> & { id?: string }) => {
    try {
      if (product.id) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(product)
          .eq('id', product.id);

        if (error) throw error;
        toast({ title: "Product updated successfully!" });
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([product]);

        if (error) throw error;
        toast({ title: "Product created successfully!" });
      }

      fetchProducts();
      setEditingProduct(null);
      setIsCreating(false);
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error saving product",
        variant: "destructive"
      });
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      setProducts(prev => prev.filter(p => p.id !== productId));
      toast({ title: "Product deleted successfully!" });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error deleting product",
        variant: "destructive"
      });
    }
  };

  const filteredProducts = products.filter(product => 
    product.dish_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.tags?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ProductForm = ({ product, onSave, onCancel }: {
    product: (Omit<Product, 'id'> & { id?: string });
    onSave: (product: Omit<Product, 'id'> & { id?: string }) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState(product);

    return (
      <div className="space-y-4 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dish_name">Dish Name</Label>
            <Input
              id="dish_name"
              value={formData.dish_name || ''}
              onChange={(e) => setFormData({...formData, dish_name: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="name">Internal Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="price">Price (₹)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category || ''}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="subcategory">Subcategory</Label>
            <Input
              id="subcategory"
              value={formData.subcategory || ''}
              onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="veg_or_nonveg">Type</Label>
            <Select value={formData.veg_or_nonveg || 'Veg'} onValueChange={(value) => setFormData({...formData, veg_or_nonveg: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Veg">Veg</SelectItem>
                <SelectItem value="Non-Veg">Non-Veg</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags || ''}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              placeholder="v, gf, hp (comma separated)"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dressing">Dressing</Label>
            <Input
              id="dressing"
              value={formData.dressing || ''}
              onChange={(e) => setFormData({...formData, dressing: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="crunch_topping">Crunch Topping</Label>
            <Input
              id="crunch_topping"
              value={formData.crunch_topping || ''}
              onChange={(e) => setFormData({...formData, crunch_topping: e.target.value})}
            />
          </div>
        </div>

        <div>
          <Label>Macros</Label>
          <div className="grid grid-cols-5 gap-2 mt-1">
            {['protein', 'carbs', 'fat', 'calories', 'sugar'].map((macro) => (
              <div key={macro}>
                <Label htmlFor={macro} className="text-xs capitalize">{macro}</Label>
                <Input
                  id={macro}
                  type="number"
                  value={formData.macros?.[macro] || 0}
                  onChange={(e) => setFormData({
                    ...formData, 
                    macros: {...(formData.macros || {}), [macro]: Number(e.target.value)}
                  })}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="image_url">Image URL (Closed)</Label>
            <Input
              id="image_url"
              value={formData.image_url || ''}
              onChange={(e) => setFormData({...formData, image_url: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="image_opened_url">Image URL (Opened)</Label>
            <Input
              id="image_opened_url"
              value={formData.image_opened_url || ''}
              onChange={(e) => setFormData({...formData, image_opened_url: e.target.value})}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_enabled"
            checked={formData.is_enabled || false}
            onCheckedChange={(checked) => setFormData({...formData, is_enabled: checked})}
          />
          <Label htmlFor="is_enabled">Product Enabled</Label>
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={() => onSave(formData)}>Save Product</Button>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <CSVImportProducts />
      
      <Card className="bg-background/60 backdrop-blur border shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Package className="h-6 w-6 text-primary" />
                Product Management
              </CardTitle>
              <CardDescription className="text-base">
                Manage your healthy meal catalog with ease
              </CardDescription>
            </div>
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 shadow-sm transition-all duration-200">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Create New Product</DialogTitle>
                </DialogHeader>
                <ProductForm
                  product={emptyProduct}
                  onSave={saveProduct}
                  onCancel={() => setIsCreating(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name, category, tags, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 admin-input h-11"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {product.dish_name || product.name}
                    </TableCell>
                    <TableCell>
                      {product.category}
                      {product.subcategory && (
                        <div className="text-xs text-muted-foreground">
                          {product.subcategory}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>₹{product.price}</TableCell>
                    <TableCell>
                      <Badge variant={product.veg_or_nonveg === 'Veg' ? 'secondary' : 'destructive'}>
                        {product.veg_or_nonveg}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={product.is_enabled || false}
                        onCheckedChange={() => toggleProductStatus(product.id, product.is_enabled)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedProduct(product)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Product Details</DialogTitle>
                            </DialogHeader>
                            {selectedProduct && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Dish Name</Label>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedProduct.dish_name || 'N/A'}
                                    </p>
                                  </div>
                                  <div>
                                    <Label>Price</Label>
                                    <p className="text-sm text-muted-foreground">
                                      ₹{selectedProduct.price}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <Label>Description</Label>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedProduct.description || 'N/A'}
                                  </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Dressing</Label>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedProduct.dressing || 'N/A'}
                                    </p>
                                  </div>
                                  <div>
                                    <Label>Crunch Topping</Label>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedProduct.crunch_topping || 'N/A'}
                                    </p>
                                  </div>
                                </div>
                                {selectedProduct.macros && (
                                  <div>
                                    <Label>Macros</Label>
                                    <div className="grid grid-cols-5 gap-2 mt-1">
                                      {Object.entries(selectedProduct.macros).map(([key, value]) => (
                                        <div key={key} className="text-center">
                                          <div className="text-xs text-muted-foreground capitalize">{key}</div>
                                          <div className="text-sm font-medium">{String(value || '')}</div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingProduct(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Edit Product</DialogTitle>
                            </DialogHeader>
                            {editingProduct && (
                              <ProductForm
                                product={editingProduct}
                                onSave={saveProduct}
                                onCancel={() => setEditingProduct(null)}
                              />
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProducts;