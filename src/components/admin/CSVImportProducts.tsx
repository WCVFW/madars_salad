import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Upload, Download, FileText, CheckCircle, AlertCircle } from "lucide-react";
import Papa from "papaparse";

interface CSVRow {
  dish_name: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  tags: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  net_weight: string;
  veg_or_nonveg: string;
  dressing: string;
  crunch_topping: string;
  image_url: string;
  image_opened_url: string;
  recipe_link: string;
  is_enabled: boolean;
}

const CSVImportProducts = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<CSVRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const requiredColumns = [
    'dish_name', 'description', 'category', 'subcategory', 'price',
    'tags', 'calories', 'protein', 'carbs', 'fat', 'sugar',
    'net_weight', 'veg_or_nonveg', 'dressing', 'crunch_topping',
    'image_url', 'image_opened_url', 'recipe_link', 'is_enabled'
  ];

  const downloadTemplate = () => {
    const csvContent = [
      requiredColumns.join(','),
      // Sample row
      'Greek Salad,Fresh Greek salad with feta cheese,Salads,Mediterranean,299,v\\,gf\\,hp,250,15,20,8,5,300g,Veg,Olive Oil Dressing,Croutons,https://example.com/greek-closed.jpg,https://example.com/greek-open.jpg,https://example.com/recipe,true'
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      parseCSV(selectedFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a CSV file",
        variant: "destructive"
      });
    }
  };

  const parseCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as CSVRow[];
        const errors: string[] = [];

        // Validate headers
        const headers = Object.keys(data[0] || {});
        const missingColumns = requiredColumns.filter(col => !headers.includes(col));
        
        if (missingColumns.length > 0) {
          errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
        }

        // Validate data
        data.forEach((row, index) => {
          if (!row.dish_name) errors.push(`Row ${index + 1}: Dish name is required`);
          if (!row.price || isNaN(Number(row.price))) errors.push(`Row ${index + 1}: Valid price is required`);
          if (!row.category) errors.push(`Row ${index + 1}: Category is required`);
          if (!['Veg', 'Non-Veg'].includes(row.veg_or_nonveg)) {
            errors.push(`Row ${index + 1}: veg_or_nonveg must be 'Veg' or 'Non-Veg'`);
          }
        });

        setValidationErrors(errors);
        setPreview(data.slice(0, 5)); // Show first 5 rows as preview
      },
      error: (error) => {
        toast({
          title: "Error parsing CSV",
          description: error.message,
          variant: "destructive"
        });
      }
    });
  };

  const handleImport = async () => {
    if (!file || validationErrors.length > 0 || !user) return;

    setImporting(true);
    setProgress(0);

    try {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const data = results.data as CSVRow[];
          let successCount = 0;
          let duplicateCount = 0;

          for (let i = 0; i < data.length; i++) {
            const row = data[i];
            setProgress((i / data.length) * 100);

            // Check for duplicates in products
            const { data: existingProduct } = await supabase
              .from('products')
              .select('id')
              .eq('dish_name', row.dish_name)
              .eq('category', row.category)
              .maybeSingle();

            if (existingProduct) {
              duplicateCount++;
              continue;
            }

            // Prepare product data
            const productData = {
              dish_name: row.dish_name,
              name: row.dish_name, // Use dish_name as internal name
              description: row.description,
              category: row.category,
              subcategory: row.subcategory,
              price: Number(row.price),
              tags: row.tags,
              macros: {
                calories: Number(row.calories) || 0,
                protein: Number(row.protein) || 0,
                carbs: Number(row.carbs) || 0,
                fat: Number(row.fat) || 0,
                sugar: Number(row.sugar) || 0
              },
              veg_or_nonveg: row.veg_or_nonveg,
              dressing: row.dressing,
              crunch_topping: row.crunch_topping,
              image_url: row.image_url,
              image_opened_url: row.image_opened_url,
              recipe_link: row.recipe_link,
              is_enabled: String(row.is_enabled).toLowerCase() === 'true'
            };

            // Insert product directly
            const { error } = await supabase
              .from('products')
              .insert([productData]);

            if (!error) {
              successCount++;
            }
          }

          setProgress(100);
          
          toast({
            title: "Products imported successfully!",
            description: `Successfully imported ${successCount} products. ${duplicateCount} duplicates skipped.`,
          });

          // Reset form
          setFile(null);
          setPreview([]);
          setValidationErrors([]);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      });
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import failed",
        description: "An error occurred during import",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
      setProgress(0);
    }
  };

  if (!user) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Please log in to submit products for review.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Import Products
        </CardTitle>
        <CardDescription>
          Import products from CSV file directly to the products catalog. Download the template to see the required format.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={downloadTemplate}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Template
          </Button>
        </div>

        <div className="space-y-4">
          <Label htmlFor="csv-file">Select CSV File</Label>
          <Input
            id="csv-file"
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="cursor-pointer"
          />
        </div>

        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div>
                <p className="font-medium">Validation Errors:</p>
                <ul className="list-disc list-inside mt-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-sm">{error}</li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {preview.length > 0 && validationErrors.length === 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">CSV Preview (First 5 rows)</span>
            </div>
            <div className="border rounded-md overflow-hidden">
              <div className="overflow-x-auto max-h-60">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-2">Dish Name</th>
                      <th className="text-left p-2">Category</th>
                      <th className="text-left p-2">Price</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2">Enabled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2">{row.dish_name}</td>
                        <td className="p-2">{row.category}</td>
                        <td className="p-2">₹{row.price}</td>
                        <td className="p-2">
                          <Badge variant={row.veg_or_nonveg === 'Veg' ? 'secondary' : 'destructive'}>
                            {row.veg_or_nonveg}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <Badge variant={row.is_enabled ? 'default' : 'secondary'}>
                            {row.is_enabled ? 'Yes' : 'No'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {importing && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="text-sm">Importing products...</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        <Button
          onClick={handleImport}
          disabled={!file || validationErrors.length > 0 || importing || !user}
          className="w-full"
        >
          {importing ? 'Importing...' : 'Import Products'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CSVImportProducts;