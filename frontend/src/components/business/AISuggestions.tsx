import React, { useEffect, useState, useCallback } from "react";
import { Lightbulb, Users, ChevronDown, ChevronUp, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import { Link } from "react-router";
import api from "../../lib/api";

interface AISuggestion {
  suggestion: string;
  category: string;
  priority: "High" | "Medium" | "Low";
}

interface AISuggestionsResponse {
  business_name: string;
  suggestions: AISuggestion[];
  generated_at: string;
}

interface AISuggestionsProps {
  businessId: number;
  businessName?: string;
}

const AISuggestions: React.FC<AISuggestionsProps> = ({ businessId, businessName: fallbackBusinessName }) => {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [businessName, setBusinessName] = useState<string>(fallbackBusinessName || "");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastGenerated, setLastGenerated] = useState<string>("");

  const fetchSuggestions = useCallback(
    async (isRefresh: boolean = false) => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/genai/business-suggestions/${businessId}?isRefresh=${isRefresh}`);

        if (!response.data) {
          if (response.status === 404) {
            throw new Error("Bisnis tidak ditemukan");
          } else if (response.status === 500) {
            throw new Error("Terjadi kesalahan server, silakan coba lagi");
          } else {
            throw new Error("Gagal mengambil saran AI");
          }
        }

        const data = response.data;

        if (data.success && data.data) {
          const aiResponse: AISuggestionsResponse = data.data;
          setSuggestions(Array.isArray(aiResponse.suggestions) ? aiResponse.suggestions : []);
          setBusinessName(aiResponse.business_name || "");
          setLastGenerated(aiResponse.generated_at || "");
        } else {
          throw new Error("Format response tidak valid");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan tidak diketahui");
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    },
    [businessId]
  );

  useEffect(() => {
    if (businessId) {
      fetchSuggestions(false);
    }
  }, [businessId, fetchSuggestions]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-50 border-red-200 text-red-800";
      case "Medium":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "Low":
        return "bg-green-50 border-green-200 text-green-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "legal documents":
        return "⚖️";
      case "financial data":
        return "💰";
      case "product information":
        return "📦";
      case "profile completion":
        return "👤";
      case "marketing & branding":
        return "📊";
      case "product development":
        return "🛠️";
      case "operations":
        return "⚙️";
      case "partnership":
        return "🤝";
      case "digital transformation":
        return "💻";
      case "customer experience":
        return "👥";
      default:
        return "💡";
    }
  };

  const getActionLink = (suggestion: string, category: string) => {
    const lowerSuggestion = suggestion.toLowerCase();
    const lowerCategory = category.toLowerCase();

    if (lowerCategory.includes("legal") || lowerSuggestion.includes("legal") || lowerSuggestion.includes("dokumen")) {
      return `/business/${businessId}/legal`;
    }
    if (lowerCategory.includes("financial") || lowerSuggestion.includes("finansial") || lowerSuggestion.includes("keuangan")) {
      return `/business/${businessId}/finance`;
    }
    if (lowerCategory.includes("product") || lowerSuggestion.includes("produk")) {
      return `/business/${businessId}/products`;
    }
    if (lowerSuggestion.includes("proyeksi") || lowerSuggestion.includes("projections")) {
      return `/business/${businessId}/projections`;
    }

    return null;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Tidak diketahui";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mt-6">
      {/* Header */}
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-amber-500" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Saran untuk Melengkapi Profil Bisnis {businessName && `- ${businessName}`}</h2>
            {lastGenerated && <p className="text-xs text-gray-500 mt-1">Dibuat pada: {formatDate(lastGenerated)}</p>}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {loading && <Loader2 className="w-4 h-4 animate-spin text-amber-500" />}
          <button
            onClick={(e) => {
              e.stopPropagation();
              fetchSuggestions(true);
            }}
            disabled={loading}
            className="text-sm px-3 py-1 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors disabled:opacity-50">
            {loading ? "Loading..." : "Refresh"}
          </button>
          {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
        </div>
      </div>

      {/* Collapsible Content */}
      <div className={`transition-all duration-500 overflow-hidden ${isOpen ? "max-h-[2000px] mt-4" : "max-h-0"}`}>
        {/* Error State */}
        {error && (
          <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-red-800">Gagal memuat saran AI</p>
              <p className="text-xs text-red-600 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin text-amber-500 mr-3" />
            <p className="text-gray-600">Menghasilkan saran AI untuk bisnis Anda...</p>
          </div>
        )}

        {/* Suggestions List */}
        {!loading && suggestions.length > 0 && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="font-medium text-blue-800 mb-1">Untuk kelancaran investasi, pastikan profil bisnis Anda lengkap:</p>
              <ul className="list-disc list-inside text-blue-700 space-y-1">
                <li>Hak merek dan dokumen legal</li>
                <li>Surat terkait produk</li>
                <li>Data finansial (sesuai laporan pajak)</li>
              </ul>
            </div>

            {suggestions.map((item, idx) => {
              const actionLink = getActionLink(item.suggestion, item.category);
              const SuggestionWrapper = actionLink ? Link : "div";
              const wrapperProps = actionLink ? { to: actionLink } : { to: "#" };

              return (
                <SuggestionWrapper
                  key={idx}
                  {...wrapperProps}
                  className={`flex items-start p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-lg shadow-sm transition-all duration-300 ${
                    actionLink ? "hover:shadow-md hover:border-amber-200 cursor-pointer group" : ""
                  }`}>
                  <div className="flex-shrink-0 mr-3">
                    <span className="text-lg">{getCategoryIcon(item.category)}</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">{item.category}</span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(item.priority)}`}>{item.priority}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{item.suggestion}</p>
                    {actionLink && (
                      <div className="flex items-center mt-2 text-xs text-blue-600 group-hover:text-blue-800">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        <span>Klik untuk melengkapi</span>
                      </div>
                    )}
                  </div>
                </SuggestionWrapper>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && suggestions.length === 0 && (
          <div className="text-center p-8">
            <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Belum ada saran tersedia</p>
            <p className="text-sm text-gray-500 mt-1">Klik tombol Refresh untuk menghasilkan saran AI</p>
          </div>
        )}

        {/* Footer */}
        {!loading && suggestions.length > 0 && (
          <div className="mt-5 flex items-center text-xs text-gray-500 border-t pt-4">
            <Users className="w-4 h-4 mr-1" />
            Saran ini dihasilkan secara otomatis oleh AI berdasarkan analisis profil bisnis dan kebutuhan investasi.
          </div>
        )}
      </div>
    </div>
  );
};

export default AISuggestions;
