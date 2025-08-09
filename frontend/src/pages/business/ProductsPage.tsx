import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { X } from "lucide-react";
import { BusinessService, type Product } from "../../services/businessService";
import api from "../../lib/api";

const ProductsPage: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [newProductsText, setNewProductsText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const products = await BusinessService.getBusinessProducts(parseInt(businessId!));
      setProducts(products || []);
    } catch (err: unknown) {
      console.error("Failed to load products:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to load products";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  const handleAddProducts = async () => {
    if (!newProductsText.trim()) return;

    try {
      setLoading(true);
      setError(null);

      // Split by enter and create products
      const productLines = newProductsText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      const newProducts = productLines.map((line) => ({
        name: line,
      }));

      const result = await BusinessService.addBusinessProducts(parseInt(businessId!), {
        products: newProducts,
      });

      setProducts([...products, ...result.products]);
      setNewProductsText("");
    } catch (err: unknown) {
      console.error("Failed to add products:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to add products";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async (productId: number, field: keyof Product, value: string) => {
    try {
      await BusinessService.updateBusinessProduct(parseInt(businessId!), productId, {
        [field]: value,
      });

      setProducts(products.map((p) => (p.ID === productId ? { ...p, [field]: value } : p)));
    } catch (err: unknown) {
      console.error("Failed to update product:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to update product";
      setError(errorMessage);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      await BusinessService.deleteBusinessProduct(parseInt(businessId!), productId);
      setProducts(products.filter((p) => p.ID !== productId));
    } catch (err: unknown) {
      console.error("Failed to delete product:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to delete product";
      setError(errorMessage);
    }
  };

  const handleProductsFileOnChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (e.target.files && e.target.files[0]) {
      const file: File = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      try {
        setLoading(true);
        setError(null);

        const response = await api.post("/genai/infer-products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const productNames = response.data.products.join("\n");
        setNewProductsText(productNames);
      } catch (err: unknown) {
        console.error("Failed to process file:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to process file";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
          <Link
            to={`/business/${businessId}/details`}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
          >
            Back to Business
          </Link>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

        {/* Add Products Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Products</h3>
          <p className="text-gray-600 mb-4">Enter product names, one per line:</p>

          <div className="mb-4">
            <label htmlFor="productsFile" className="block text-sm font-medium text-gray-700 mb-2">
              Upload Products File (PDF)
            </label>
            <input
              id="productsFile"
              type="file"
              accept="application/pdf"
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 
                 file:rounded-md file:border-0 file:text-sm file:font-semibold 
                 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={handleProductsFileOnChange}
            />
          </div>

          <textarea
            className="w-full border rounded-lg px-4 py-2 mb-4"
            rows={5}
            placeholder="Product Name 1&#10;Product Name 2&#10;Product Name 3"
            value={newProductsText}
            onChange={(e) => setNewProductsText(e.target.value)}
          />

          <button
            onClick={handleAddProducts}
            disabled={loading || !newProductsText.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Products"}
          </button>
        </div>

        {/* Existing Products */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Existing Products</h3>

          {products.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No products added yet.</p>
          ) : (
            <div className="space-y-4">
              {products.map((product, index) => (
                <div key={product.ID || index} className="border border-gray-200 rounded-lg p-4 relative">
                  <button
                    onClick={() => product.ID && handleDeleteProduct(product.ID)}
                    className="absolute top-2 right-2 p-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-full"
                  >
                    <X size={16} />
                  </button>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                      <input
                        type="text"
                        className="w-full border rounded-lg px-3 py-2"
                        value={product.name}
                        onChange={(e) => product.ID && handleUpdateProduct(product.ID, "name", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
