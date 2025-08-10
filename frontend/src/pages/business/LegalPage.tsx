import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { BusinessService, type Legal, type ProductLegal, type Product, type LegalComparison } from "../../services/businessService";
import LegalRequirements from "../../components/legal/LegalRequirements";

const API_BASE_URL = "http://localhost:8080";

const LegalPage: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const [businessLegals, setBusinessLegals] = useState<Legal[]>([]);
  const [productLegals, setProductLegals] = useState<ProductLegal[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comparison, setComparison] = useState<LegalComparison | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  // Form states
  const [activeTab, setActiveTab] = useState<"business" | "product">("business");

  useEffect(() => {
    if (businessId) {
      fetchData();
      fetchLegalAnalysis(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [businessLegalsResult, productLegalsResult, productsResult] = await Promise.all([
        BusinessService.getBusinessLegal(parseInt(businessId!)),
        BusinessService.getProductsLegal(parseInt(businessId!)),
        BusinessService.getBusinessProducts(parseInt(businessId!)),
      ]);

      setBusinessLegals(businessLegalsResult || []);
      setProductLegals(productLegalsResult || []);
      setProducts(productsResult || []);
    } catch (err: unknown) {
      console.error("Gagal memuat data legal:", err);
      const errorMessage = err instanceof Error ? err.message : "Gagal memuat data legal";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchLegalAnalysis = async (isRefresh: boolean = false) => {
    try {
      setAnalysisLoading(true);
      const analysisResult = await BusinessService.analyzeLegalCompliance(parseInt(businessId!), isRefresh);
      setComparison(analysisResult);
    } catch (err: unknown) {
      console.error("Gagal menganalisis kepatuhan legal:", err);
      // Don't set this as a blocking error, just log it
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleRefreshAnalysis = async () => {
    await fetchLegalAnalysis(true);
  };

  const handleFileUpload = async (
    file: File,
    type: "business" | "product",
    data: {
      legal_type: string;
      issued_by: string;
      valid_until?: string;
      notes?: string;
      product_id?: number;
    }
  ) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("legal_type", data.legal_type);
      formData.append("issued_by", data.issued_by);
      formData.append("valid_until", data.valid_until || "");
      formData.append("notes", data.notes || "");

      if (type === "product" && data.product_id) {
        formData.append("product_id", data.product_id.toString());
      }

      let result;
      if (type === "business") {
        result = await BusinessService.addBusinessLegal(parseInt(businessId!), formData);
        setBusinessLegals([...businessLegals, result]);
      } else if (data.product_id) {
        result = await BusinessService.addProductLegal(parseInt(businessId!), data.product_id, formData);
        setProductLegals([...productLegals, result]);
      }

      // Refresh analysis after adding new legal document
      await fetchLegalAnalysis(true);
    } catch (err: unknown) {
      console.error("Gagal mengunggah dokumen legal:", err);
      const errorMessage = err instanceof Error ? err.message : "Gagal mengunggah dokumen legal";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const BusinessLegalForm = () => {
    const [formData, setFormData] = useState({
      legal_type: "",
      issued_by: "",
      valid_until: "",
      notes: "",
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedFile) {
        setError("Silakan pilih file");
        return;
      }

      await handleFileUpload(selectedFile, "business", formData);

      // Reset form
      setFormData({
        legal_type: "",
        issued_by: "",
        valid_until: "",
        notes: "",
      });
      setSelectedFile(null);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Unggah Dokumen Legal (PDF)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <input type="file" accept=".pdf" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className="w-full" required />
            {selectedFile && <p className="text-sm text-gray-600 mt-2">Dipilih: {selectedFile.name}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Legal</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2"
              value={formData.legal_type}
              onChange={(e) => setFormData({ ...formData, legal_type: e.target.value })}
              placeholder="Contoh: Izin Usaha, NPWP"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diterbitkan Oleh</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2"
              value={formData.issued_by}
              onChange={(e) => setFormData({ ...formData, issued_by: e.target.value })}
              placeholder="Instansi penerbit"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Berlaku Sampai (Opsional)</label>
          <input type="date" className="w-full border rounded-lg px-3 py-2" value={formData.valid_until} onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Catatan (Opsional)</label>
          <textarea
            className="w-full border rounded-lg px-3 py-2"
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Catatan tambahan"
          />
        </div>

        <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50">
          {loading ? "Mengunggah..." : "Unggah Dokumen"}
        </button>
      </form>
    );
  };

  const ProductLegalForm = () => {
    const [formData, setFormData] = useState({
      product_id: "",
      legal_type: "",
      issued_by: "",
      valid_until: "",
      notes: "",
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedFile || !formData.product_id) {
        setError("Silakan pilih file dan produk");
        return;
      }

      await handleFileUpload(selectedFile, "product", {
        ...formData,
        product_id: parseInt(formData.product_id),
      });

      // Reset form
      setFormData({
        product_id: "",
        legal_type: "",
        issued_by: "",
        valid_until: "",
        notes: "",
      });
      setSelectedFile(null);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Produk</label>
          <select className="w-full border rounded-lg px-3 py-2" value={formData.product_id} onChange={(e) => setFormData({ ...formData, product_id: e.target.value })} required>
            <option value="">Pilih produk...</option>
            {products.map((product) => (
              <option key={product.ID} value={product.ID}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Unggah Dokumen Legal (PDF)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <input type="file" accept=".pdf" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className="w-full" required />
            {selectedFile && <p className="text-sm text-gray-600 mt-2">Dipilih: {selectedFile.name}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Legal</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2"
              value={formData.legal_type}
              onChange={(e) => setFormData({ ...formData, legal_type: e.target.value })}
              placeholder="Contoh: Sertifikat Halal, BPOM"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diterbitkan Oleh</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2"
              value={formData.issued_by}
              onChange={(e) => setFormData({ ...formData, issued_by: e.target.value })}
              placeholder="Instansi penerbit"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Berlaku Sampai (Opsional)</label>
          <input type="date" className="w-full border rounded-lg px-3 py-2" value={formData.valid_until} onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Catatan (Opsional)</label>
          <textarea
            className="w-full border rounded-lg px-3 py-2"
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Catatan tambahan"
          />
        </div>

        <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50">
          {loading ? "Mengunggah..." : "Unggah Dokumen"}
        </button>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-brown-bg">
      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-brown-primary">Dokumen Legal</h1>
          <div className="flex space-x-3">
            <button
              onClick={handleRefreshAnalysis}
              disabled={analysisLoading}
              className="bg-brown-primary hover:bg-brown-primary-hover text-white px-4 py-2 rounded-lg disabled:opacity-50 transition-colors">
              {analysisLoading ? "Menganalisis..." : "Segarkan Analisis"}
            </button>
            <Link to={`/business/${businessId}/details`} className="bg-brown-bg-light hover:bg-brown-accent/20 text-brown-primary px-4 py-2 rounded-lg transition-colors">
              Kembali ke Bisnis
            </Link>
          </div>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab("business")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "business" ? "bg-brown-primary text-white" : "bg-brown-bg-light text-brown-primary hover:bg-brown-accent/20"
            }`}>
            Dokumen Legal Bisnis
          </button>
          <button
            onClick={() => setActiveTab("product")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "product" ? "bg-brown-primary text-white" : "bg-brown-bg-light text-brown-primary hover:bg-brown-accent/20"
            }`}>
            Dokumen Legal Produk
          </button>
        </div>

        {/* Show Requirements Comparison */}
        <div className="mb-8">
          {analysisLoading ? (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-gray-600">Menganalisis kepatuhan legal...</span>
                </div>
              </div>
            </div>
          ) : comparison ? (
            <LegalRequirements comparison={comparison} isProductLegalPage={activeTab === "product"} />
          ) : (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Analisis kepatuhan legal belum tersedia</p>
                <button onClick={handleRefreshAnalysis} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                  Jalankan Analisis
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Upload Form */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{activeTab === "business" ? "Tambah Dokumen Legal Bisnis" : "Tambah Dokumen Legal Produk"}</h3>

          {activeTab === "business" ? <BusinessLegalForm /> : <ProductLegalForm />}
        </div>

        {/* Existing Documents */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Daftar Dokumen {activeTab === "business" ? "Bisnis" : "Produk"}</h3>

          {activeTab === "business" ? (
            businessLegals.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Belum ada dokumen legal bisnis yang diunggah.</p>
            ) : (
              <div className="space-y-4">
                {businessLegals.map((legal, index) => (
                  <div key={legal.ID || index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{legal.legal_type}</h4>
                        <p className="text-sm text-gray-600">Diterbitkan oleh: {legal.issued_by}</p>
                        {legal.valid_until && <p className="text-sm text-gray-600">Berlaku sampai: {new Date(legal.valid_until).toLocaleDateString()}</p>}
                        {legal.notes && <p className="text-sm text-gray-600 mt-2">{legal.notes}</p>}
                      </div>
                      <div className="flex items-center space-x-2">
                        {legal.file_url && (
                          <a href={`${API_BASE_URL}${legal.file_url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium">
                            Lihat Dokumen
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : productLegals.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Belum ada dokumen legal produk yang diunggah.</p>
          ) : (
            <div className="space-y-4">
              {productLegals.map((legal, index) => {
                const product = products.find((p) => p.ID === legal.product_id);
                return (
                  <div key={legal.ID || index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{legal.legal_type}</h4>
                        <p className="text-sm text-gray-600">Produk: {product?.name || "Produk Tidak Diketahui"}</p>
                        <p className="text-sm text-gray-600">Diterbitkan oleh: {legal.issued_by}</p>
                        {legal.valid_until && <p className="text-sm text-gray-600">Berlaku sampai: {new Date(legal.valid_until).toLocaleDateString()}</p>}
                        {legal.notes && <p className="text-sm text-gray-600 mt-2">{legal.notes}</p>}
                      </div>
                      <div className="flex items-center space-x-2">
                        {legal.file_url && (
                          <a href={`${API_BASE_URL}${legal.file_url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium">
                            Lihat Dokumen
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
