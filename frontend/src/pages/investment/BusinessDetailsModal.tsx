import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import toast, { Toaster } from "react-hot-toast";
import type { Business, Financial } from "../../services/businessService";
import { BusinessService } from "../../services/businessService";
import { UserService } from "../../services/userService";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const API_BASE_URL = "http://localhost:8080";

interface BusinessDetailsModalProps {
  business: Business | null;
  isOpen: boolean;
  onClose: () => void;
}

const BusinessDetailsModal: React.FC<BusinessDetailsModalProps> = ({ business, isOpen, onClose }) => {
  const [financialHistory, setFinancialHistory] = useState<Financial[]>([]);
  const [contactLoading, setContactLoading] = useState(false);

  useEffect(() => {
    if (isOpen && business) {
      const fetchFinancialHistory = async () => {
        try {
          const history = await BusinessService.getBusinessFinancialHistory(business.ID);
          setFinancialHistory(history);
        } catch (error) {
          console.error("Failed to fetch financial history:", error);
          setFinancialHistory([]);
        }
      };

      fetchFinancialHistory();

      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = "unset";
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, business]);

  const handleContactOwner = async () => {
    if (!business) return;

    setContactLoading(true);
    try {
      const owner = await UserService.getUserById(business.user_id);

      if (owner.phone_number) {
        // Copy phone number to clipboard
        await navigator.clipboard.writeText(owner.phone_number);
        toast.success(`Nomor telepon disalin ke clipboard: ${owner.phone_number}`, {
          duration: 4000,
          position: "top-center",
        });
      } else {
        toast.error("Nomor telepon tidak tersedia untuk pemilik bisnis ini", {
          duration: 3000,
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Failed to get owner information:", error);
      toast.error("Gagal mendapatkan informasi kontak pemilik", {
        duration: 3000,
        position: "top-center",
      });
    } finally {
      setContactLoading(false);
    }
  };

  if (!isOpen || !business) return null;

  const formatCurrency = (amount?: number) => {
    if (!amount) return "Not specified";
    if (amount >= 1000000000) {
      return `IDR ${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `IDR ${(amount / 1000000).toFixed(0)}M`;
    }
    return `IDR ${amount.toLocaleString()}`;
  };

  // Revenue thresholds and EBITDA multipliers (matching backend constants)
  const REVENUE_TIER_1 = 1_000_000_000; // 1B IDR
  const REVENUE_TIER_2 = 5_000_000_000; // 5B IDR
  const REVENUE_TIER_3 = 10_000_000_000; // 10B IDR
  const REVENUE_TIER_4 = 50_000_000_000; // 50B IDR

  const EBITDA_MULTIPLIER_MIN = 1.0; // For revenue < 1B IDR
  const EBITDA_MULTIPLIER_LOW = 2.0; // For revenue 1B-5B IDR
  const EBITDA_MULTIPLIER_MID = 3.0; // For revenue 5B-10B IDR
  const EBITDA_MULTIPLIER_HIGH = 4.0; // For revenue 10B-50B IDR
  const EBITDA_MULTIPLIER_MAX = 5.0; // For revenue > 50B IDR

  // Calculate EBITDA multiplier based on revenue (matching backend logic)
  const calculateEBITDAMultiplier = (revenue?: number): number => {
    if (!revenue || revenue < REVENUE_TIER_1) {
      return EBITDA_MULTIPLIER_MIN;
    } else if (revenue < REVENUE_TIER_2) {
      return EBITDA_MULTIPLIER_LOW;
    } else if (revenue < REVENUE_TIER_3) {
      return EBITDA_MULTIPLIER_MID;
    } else if (revenue < REVENUE_TIER_4) {
      return EBITDA_MULTIPLIER_HIGH;
    }
    return EBITDA_MULTIPLIER_MAX;
  };

  // Calculate market cap based on EBITDA and multiplier (business value)
  const calculateBusinessValue = (financial: Financial): number => {
    const revenue = financial.revenue || 0;
    const ebitdaMultiplier = calculateEBITDAMultiplier(revenue);
    return (financial.ebitda || 0) * ebitdaMultiplier;
  };

  // Generate historical business value data based on actual financial history
  const generateBusinessValueHistory = () => {
    if (financialHistory.length === 0) return [];

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = [];

    // Use actual financial history to create value timeline
    const sortedHistory = [...financialHistory].sort((a, b) => new Date(a.CreatedAt).getTime() - new Date(b.CreatedAt).getTime());

    // If we have multiple financial records, create data points for each
    if (sortedHistory.length > 1) {
      sortedHistory.forEach((financial) => {
        const date = new Date(financial.CreatedAt);
        const value = calculateBusinessValue(financial);

        data.push({
          month: months[date.getMonth()],
          value: Math.max(value, 0),
          date: date.toISOString().split("T")[0],
        });
      });
    }

    // If no data generated, show current month with latest financial data
    if (data.length === 0) {
      const currentDate = new Date();
      const latestFinancial = sortedHistory[sortedHistory.length - 1];
      data.push({
        month: months[currentDate.getMonth()],
        value: calculateBusinessValue(latestFinancial),
        date: currentDate.toISOString().split("T")[0],
      });
    }

    return data;
  };

  const businessValueHistory = generateBusinessValueHistory();

  // Calculate current business value from the latest financial data
  let currentBusinessValue = 0;
  if (financialHistory.length > 0) {
    // Use the most recent financial record from history
    const latestFinancial = financialHistory[0]; // History is sorted DESC by CreatedAt from backend
    currentBusinessValue = calculateBusinessValue(latestFinancial);
  } else if (business.financial) {
    // Fallback to business.financial if no history available
    currentBusinessValue = calculateBusinessValue(business.financial);
  }

  if (!isOpen || !business) return null;

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4"
      style={{ zIndex: 99 }}
      onClick={(e) => {
        // Close modal when clicking the backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}>
      <div
        className="rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #f1edea 0%, #dbd7d2 100%)",
          border: "1px solid rgba(96, 42, 29, 0.2)",
          zIndex: 99,
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
      >
        <div
          className="sticky top-0 border-b p-6 flex justify-between items-center backdrop-blur-sm"
          style={{
            background: "rgba(96, 42, 29, 0.95)",
            borderColor: "rgba(96, 42, 29, 0.3)",
            zIndex: 99,
          }}>
          <h2 className="text-2xl font-bold text-white">{business.name}</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl transition-colors duration-200 hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center">
            ×
          </button>
        </div>

        <div className="p-6" style={{ color: "#602a1d" }}>
          {/* Basic Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-brown-primary">Informasi Bisnis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: "rgba(96, 42, 29, 0.05)",
                  borderColor: "rgba(96, 42, 29, 0.2)",
                }}>
                <p className="text-sm text-brown-primary/70">Type</p>
                <p className="font-medium text-brown-primary">{business.type || "Not specified"}</p>
              </div>
              <div
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: "rgba(96, 42, 29, 0.05)",
                  borderColor: "rgba(96, 42, 29, 0.2)",
                }}>
                <p className="text-sm text-brown-primary/70">Founded</p>
                <p className="font-medium text-brown-primary">{business.founded_at ? new Date(business.founded_at).getFullYear() : "Not specified"}</p>
              </div>
            </div>
            {business.description && (
              <div
                className="mt-4 p-4 rounded-lg border"
                style={{
                  backgroundColor: "rgba(96, 42, 29, 0.05)",
                  borderColor: "rgba(96, 42, 29, 0.2)",
                }}>
                <p className="text-sm text-brown-primary/70">Description</p>
                <p className="mt-1 text-brown-primary">{business.description}</p>
              </div>
            )}
          </div>

          {/* Financial Information */}
          {business.financial && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-brown-primary">Data Keuangan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  className="p-4 rounded-lg border"
                  style={{
                    background: "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)",
                    borderColor: "rgba(34, 197, 94, 0.3)",
                  }}>
                  <p className="text-sm text-brown-primary/70">EBITDA</p>
                  <p className="text-lg font-semibold text-green-700">{formatCurrency(business.financial.ebitda)}</p>
                </div>
                <div
                  className="p-4 rounded-lg border"
                  style={{
                    background: "linear-gradient(135deg, rgba(96, 42, 29, 0.1) 0%, rgba(96, 42, 29, 0.05) 100%)",
                    borderColor: "rgba(96, 42, 29, 0.3)",
                  }}>
                  <p className="text-sm text-brown-primary/70">Assets</p>
                  <p className="text-lg font-semibold text-brown-primary">{formatCurrency(business.financial.assets)}</p>
                </div>
                <div
                  className="p-4 rounded-lg border"
                  style={{
                    background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)",
                    borderColor: "rgba(239, 68, 68, 0.3)",
                  }}>
                  <p className="text-sm text-brown-primary/70">Liabilities</p>
                  <p className="text-lg font-semibold text-red-600">{formatCurrency(business.financial.liabilities)}</p>
                </div>
                <div
                  className="p-4 rounded-lg border"
                  style={{
                    background: "linear-gradient(135deg, rgba(96, 42, 29, 0.15) 0%, rgba(96, 42, 29, 0.08) 100%)",
                    borderColor: "rgba(96, 42, 29, 0.4)",
                  }}>
                  <p className="text-sm text-brown-primary/70">Equity</p>
                  <p className="text-lg font-semibold text-brown-primary">{formatCurrency(business.financial.equity)}</p>
                </div>
              </div>
              {business.financial.notes && (
                <div
                  className="mt-4 p-4 rounded-lg border"
                  style={{
                    backgroundColor: "rgba(96, 42, 29, 0.05)",
                    borderColor: "rgba(96, 42, 29, 0.2)",
                  }}>
                  <p className="text-sm text-brown-primary/70">Financial Notes</p>
                  <p className="mt-1 text-brown-primary">{business.financial.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Business Value Visualization with Chart.js */}
          {business.financial?.ebitda && currentBusinessValue > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-brown-primary">Business Value Over Time</h3>
              <div
                className="p-6 rounded-lg border"
                style={{
                  background: "linear-gradient(135deg, rgba(96, 42, 29, 0.1) 0%, rgba(219, 215, 210, 0.3) 100%)",
                  borderColor: "rgba(96, 42, 29, 0.2)",
                }}>
                {/* Current Business Value */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xl font-bold text-brown-primary">Current Business Value</h4>
                    <span className="text-sm text-brown-primary/70">EBITDA Multiplier: {calculateEBITDAMultiplier(business.financial?.revenue || 0)}x</span>
                  </div>
                  <div className="text-3xl font-bold text-brown-primary mb-2">{formatCurrency(currentBusinessValue)}</div>
                  <p className="text-sm text-brown-primary/70">Based on EBITDA of {formatCurrency(business.financial.ebitda)} × Revenue-based multiplier</p>
                </div>
              </div>
            </div>
          )}

          {businessValueHistory.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-brown-primary">Business Value Over Time</h3>
              <div
                className="p-6 rounded-lg border"
                style={{
                  background: "linear-gradient(135deg, rgba(96, 42, 29, 0.08) 0%, rgba(219, 215, 210, 0.2) 100%)",
                  borderColor: "rgba(96, 42, 29, 0.2)",
                }}>
                <div className="w-full overflow-hidden">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={businessValueHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(96, 42, 29, 0.2)" />
                      <XAxis dataKey="month" tick={{ fill: "#602a1d", fontSize: 12 }} tickLine={{ stroke: "#602a1d" }} axisLine={{ stroke: "#602a1d" }} />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} tick={{ fill: "#602a1d", fontSize: 12 }} tickLine={{ stroke: "#602a1d" }} axisLine={{ stroke: "#602a1d" }} />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        labelFormatter={(label) => `Month: ${label}`}
                        contentStyle={{
                          backgroundColor: "rgba(241, 237, 234, 0.95)",
                          border: "1px solid rgba(96, 42, 29, 0.2)",
                          borderRadius: "8px",
                          color: "#602a1d",
                        }}
                      />
                      <Legend wrapperStyle={{ color: "#602a1d" }} />
                      <Line type="monotone" dataKey="value" name="Business Value" stroke="#602a1d" strokeWidth={3} dot={{ r: 4, fill: "#602a1d" }} activeDot={{ r: 6, fill: "#602a1d" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Legal Documents */}
          {business.legals && business.legals.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-brown-primary">Legal Documents</h3>
              <div className="space-y-3">
                {business.legals.map((legal) => (
                  <div
                    key={legal.ID}
                    className="p-4 rounded-lg border"
                    style={{
                      backgroundColor: "rgba(96, 42, 29, 0.05)",
                      borderColor: "rgba(96, 42, 29, 0.2)",
                    }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-brown-primary">{legal.file_name || "Legal Document"}</p>
                        <div className="flex gap-4 mt-2 text-sm text-brown-primary/70">
                          {legal.legal_type && <span>Type: {legal.legal_type}</span>}
                          {legal.issued_by && <span>Issued by: {legal.issued_by}</span>}
                          {legal.valid_until && <span>Valid until: {new Date(legal.valid_until).toLocaleDateString()}</span>}
                        </div>
                        {legal.notes && <p className="mt-2 text-sm text-brown-primary/80">{legal.notes}</p>}
                      </div>
                      {legal.file_url && (
                        <a
                          href={`${API_BASE_URL}${legal.file_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 rounded text-sm transition-colors duration-200 border"
                          style={{
                            backgroundColor: "#602a1d",
                            color: "white",
                            borderColor: "#602a1d",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "rgba(96, 42, 29, 0.8)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#602a1d";
                          }}>
                          View
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products */}
          {business.products && business.products.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-brown-primary">Products</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {business.products.map((product) => (
                  <div
                    key={product.ID}
                    className="p-4 rounded-lg border"
                    style={{
                      backgroundColor: "rgba(96, 42, 29, 0.05)",
                      borderColor: "rgba(96, 42, 29, 0.2)",
                    }}>
                    <p className="font-medium text-brown-primary">{product.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleContactOwner}
            disabled={contactLoading}
            className="px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center w-full border shadow-lg"
            style={{
              backgroundColor: contactLoading ? "rgba(96, 42, 29, 0.5)" : "#602a1d",
              color: "white",
              borderColor: "#602a1d",
            }}
            onMouseEnter={(e) => {
              if (!contactLoading) {
                e.currentTarget.style.backgroundColor = "rgba(96, 42, 29, 0.8)";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(96, 42, 29, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!contactLoading) {
                e.currentTarget.style.backgroundColor = "#602a1d";
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(96, 42, 29, 0.2)";
              }
            }}>
            {contactLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Mendapatkan Kontak...
              </>
            ) : (
              "Hubungi Pemilik Bisnis"
            )}
          </button>
        </div>
      </div>

      {/* Toast notifications */}
      <Toaster />
    </div>
  );

  // Use portal to render modal at the end of the document body
  return createPortal(modalContent, document.body);
};

export default BusinessDetailsModal;
