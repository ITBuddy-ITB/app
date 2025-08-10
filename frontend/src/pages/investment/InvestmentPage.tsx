import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Building2, Star, ArrowUpRight, Users, Target, FileText, Trophy } from "lucide-react";
import { useInvestment } from "../../hooks/useInvestment";
import type { Business } from "../../services/businessService";
import BusinessDetailsModal from "./BusinessDetailsModal";
import BusinessCard from "./BusinessCard";
import ChatModal from "../../components/ChatModal";
import { ChatService } from "../../services/aiChatService";

const InvestmentPage: React.FC = () => {
  const { businesses, loading, error, pagination, fetchBusinesses, searchBusinesses, changePage, changeLimit } = useInvestment();

  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [showChatModal, setShowChatModal] = useState(false);

  // Get unique industries for filter
  const industries = Array.from(new Set(businesses.map((business) => business.industry).filter(Boolean)));

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchBusinesses(searchTerm, {
      industry: selectedIndustry || undefined,
      limit: pagination.limit,
    });
  };

  const handleViewDetails = (business: Business) => {
    setSelectedBusiness(business);
    setShowModal(true);
  };

  const handlePageChange = (newPage: number) => {
    changePage(newPage, {
      search: searchTerm || undefined,
      industry: selectedIndustry || undefined,
      limit: pagination.limit,
    });
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `
          linear-gradient(135deg, #602a1d 0%, #dbd7d2 20%, #f1edea 40%, #dbd7d2 60%, #602a1d 100%),
          radial-gradient(circle at 30% 20%, rgba(96, 42, 29, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 70% 80%, rgba(96, 42, 29, 0.2) 0%, transparent 50%),
          conic-gradient(from 180deg at 50% 50%, rgba(96, 42, 29, 0.1) 0%, transparent 25%, rgba(96, 42, 29, 0.1) 50%, transparent 75%)
        `,
      }}>
      {/* Animated Background Patterns */}
      <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        {/* Floating orbs */}
        <motion.div
          className="absolute top-24 left-20 w-44 h-44 rounded-full opacity-18 blur-3xl"
          style={{ backgroundColor: "#602a1d" }}
          animate={{
            y: [0, -35, 0],
            x: [0, 20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-52 right-16 w-32 h-32 rounded-full opacity-22 blur-3xl"
          style={{ backgroundColor: "#602a1d" }}
          animate={{
            y: [0, 30, 0],
            x: [0, -25, 0],
            scale: [1, 0.85, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-32 left-1/4 w-38 h-38 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: "#602a1d" }}
          animate={{
            y: [0, -28, 0],
            x: [0, 32, 0],
            scale: [1, 1.25, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </motion.div>

      {/* Geometric patterns */}
      <div
        className="absolute inset-0 opacity-12"
        style={{
          background: `
            radial-gradient(circle at 25% 35%, #602a1d 2px, transparent 2px),
            radial-gradient(circle at 75% 65%, #602a1d 1.5px, transparent 1.5px)
          `,
          backgroundSize: "70px 70px, 45px 45px",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full mb-6 backdrop-blur-sm border shadow-lg"
              style={{
                backgroundColor: "rgba(96, 42, 29, 0.1)",
                borderColor: "rgba(96, 42, 29, 0.3)",
                color: "#602a1d",
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}>
              <motion.div
                animate={{
                  rotate: [0, 360, 360, 0, 0, 0, 0, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatDelay: 4,
                  ease: "easeInOut",
                }}>
                <Trophy className="w-4 h-4 mr-2" />
              </motion.div>
              <span className="text-sm font-medium">SINAR Investment Platform</span>
            </motion.div>

            <div className="flex justify-between items-center mb-6">
              <motion.h1 className="text-4xl font-bold" style={{ color: "#602a1d" }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
                Peluang{" "}
                <span className="relative inline-block">
                  Investasi
                  <div className="absolute bottom-1 left-0 w-full h-2 opacity-30 -z-10" style={{ backgroundColor: "#602a1d" }} />
                </span>{" "}
                Swasta
              </motion.h1>

              <motion.button
                onClick={() => setShowChatModal(true)}
                className="py-2 px-4 hover:scale-105 duration-200 cursor-pointer rounded-lg backdrop-blur-sm border shadow-lg"
                style={{
                  backgroundColor: "rgba(96, 42, 29, 0.1)",
                  borderColor: "rgba(96, 42, 29, 0.3)",
                  color: "#602a1d",
                }}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                whileHover={{
                  backgroundColor: "rgba(96, 42, 29, 0.15)",
                  borderColor: "rgba(96, 42, 29, 0.4)",
                  boxShadow: "0 8px 32px rgba(96, 42, 29, 0.2)",
                }}>
                Tanya AI
              </motion.button>
            </div>

            <motion.p
              className="text-xl max-w-3xl mx-auto leading-relaxed"
              style={{ color: "rgba(96, 42, 29, 0.8)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}>
              Temukan bisnis Indonesia yang menjanjikan melalui platform investasi komprehensif SINAR. Dukung pertumbuhan sambil meraih keuntungan yang menarik.
            </motion.p>
          </motion.div>

          {/* Investment Stats */}
          <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}>
            <motion.div
              className="rounded-xl shadow-lg border p-6 backdrop-blur-sm"
              style={{
                backgroundColor: "rgba(241, 237, 234, 0.8)",
                borderColor: "rgba(96, 42, 29, 0.2)",
                boxShadow: "0 8px 32px rgba(96, 42, 29, 0.1)",
              }}
              whileHover={{
                y: -5,
                boxShadow: "0 12px 40px rgba(96, 42, 29, 0.2)",
              }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: "rgba(96, 42, 29, 0.7)" }}>
                    Total Peluang
                  </p>
                  <p className="text-2xl font-bold" style={{ color: "#602a1d" }}>
                    {pagination.total}
                  </p>
                  <p className="text-xs flex items-center mt-1" style={{ color: "#602a1d" }}>
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    Siap untuk investasi
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(96, 42, 29, 0.1)" }}>
                  <Building2 className="h-6 w-6" style={{ color: "#602a1d" }} />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="rounded-xl shadow-lg border p-6 backdrop-blur-sm"
              style={{
                backgroundColor: "rgba(241, 237, 234, 0.8)",
                borderColor: "rgba(96, 42, 29, 0.2)",
                boxShadow: "0 8px 32px rgba(96, 42, 29, 0.1)",
              }}
              whileHover={{
                y: -5,
                boxShadow: "0 12px 40px rgba(96, 42, 29, 0.2)",
              }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: "rgba(96, 42, 29, 0.7)" }}>
                    With Financial Data
                  </p>
                  <p className="text-2xl font-bold" style={{ color: "#602a1d" }}>
                    {businesses.filter((b) => b.financial).length}
                  </p>
                  <p className="text-xs flex items-center mt-1" style={{ color: "#602a1d" }}>
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Ready for analysis
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(96, 42, 29, 0.1)" }}>
                  <DollarSign className="h-6 w-6" style={{ color: "#602a1d" }} />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="rounded-xl shadow-lg border p-6 backdrop-blur-sm"
              style={{
                backgroundColor: "rgba(241, 237, 234, 0.8)",
                borderColor: "rgba(96, 42, 29, 0.2)",
                boxShadow: "0 8px 32px rgba(96, 42, 29, 0.1)",
              }}
              whileHover={{
                y: -5,
                boxShadow: "0 12px 40px rgba(96, 42, 29, 0.2)",
              }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: "rgba(96, 42, 29, 0.7)" }}>
                    With Legal Docs
                  </p>
                  <p className="text-2xl font-bold" style={{ color: "#602a1d" }}>
                    {businesses.filter((b) => b.legals && b.legals.length > 0).length}
                  </p>
                  <p className="text-xs flex items-center mt-1" style={{ color: "#602a1d" }}>
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                        ease: "easeInOut",
                      }}>
                      <Star className="w-3 h-3 mr-1" />
                    </motion.div>
                    Legally compliant
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(96, 42, 29, 0.1)" }}>
                  <FileText className="h-6 w-6" style={{ color: "#602a1d" }} />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="rounded-xl shadow-lg border p-6 backdrop-blur-sm"
              style={{
                backgroundColor: "rgba(241, 237, 234, 0.8)",
                borderColor: "rgba(96, 42, 29, 0.2)",
                boxShadow: "0 8px 32px rgba(96, 42, 29, 0.1)",
              }}
              whileHover={{
                y: -5,
                boxShadow: "0 12px 40px rgba(96, 42, 29, 0.2)",
              }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: "rgba(96, 42, 29, 0.7)" }}>
                    Industries
                  </p>
                  <p className="text-2xl font-bold" style={{ color: "#602a1d" }}>
                    {industries.length}
                  </p>
                  <p className="text-xs flex items-center mt-1" style={{ color: "#602a1d" }}>
                    <Users className="w-3 h-3 mr-1" />
                    Diverse sectors
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(96, 42, 29, 0.1)" }}>
                  <Target className="h-6 w-6" style={{ color: "#602a1d" }} />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            className="rounded-lg shadow-sm p-6 mb-8 backdrop-blur-sm border"
            style={{
              backgroundColor: "rgba(241, 237, 234, 0.8)",
              borderColor: "rgba(96, 42, 29, 0.2)",
              boxShadow: "0 8px 32px rgba(96, 42, 29, 0.1)",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="search" className="block text-sm font-medium mb-1" style={{ color: "#602a1d" }}>
                    Search Businesses
                  </label>
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or description..."
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 backdrop-blur-sm"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      borderColor: "rgba(96, 42, 29, 0.3)",
                      color: "#602a1d",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#602a1d";
                      e.target.style.boxShadow = "0 0 0 2px rgba(96, 42, 29, 0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(96, 42, 29, 0.3)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium mb-1" style={{ color: "#602a1d" }}>
                    Industry
                  </label>
                  <select
                    id="industry"
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 backdrop-blur-sm"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      borderColor: "rgba(96, 42, 29, 0.3)",
                      color: "#602a1d",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#602a1d";
                      e.target.style.boxShadow = "0 0 0 2px rgba(96, 42, 29, 0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(96, 42, 29, 0.3)";
                      e.target.style.boxShadow = "none";
                    }}>
                    <option value="">All Industries</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <motion.button
                    type="submit"
                    className="w-full py-2 px-4 rounded-md transition-colors backdrop-blur-sm border shadow-lg"
                    style={{
                      backgroundColor: "#602a1d",
                      borderColor: "rgba(96, 42, 29, 0.3)",
                      color: "#f1edea",
                    }}
                    whileHover={{
                      backgroundColor: "rgba(96, 42, 29, 0.9)",
                      scale: 1.02,
                      boxShadow: "0 8px 32px rgba(96, 42, 29, 0.3)",
                    }}
                    whileTap={{ scale: 0.98 }}>
                    Search
                  </motion.button>
                </div>
              </div>
            </form>
          </motion.div>

          {/* Results Summary */}
          <motion.div className="flex justify-between items-center mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.7 }}>
            <p style={{ color: "rgba(96, 42, 29, 0.8)" }}>
              Showing {businesses.length} of {pagination.total} businesses
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="limit" className="text-sm" style={{ color: "rgba(96, 42, 29, 0.7)" }}>
                Show:
              </label>
              <select
                id="limit"
                value={pagination.limit}
                onChange={(e) =>
                  changeLimit(Number(e.target.value), {
                    search: searchTerm || undefined,
                    industry: selectedIndustry || undefined,
                  })
                }
                className="px-2 py-1 border rounded backdrop-blur-sm"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderColor: "rgba(96, 42, 29, 0.3)",
                  color: "#602a1d",
                }}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <motion.div className="flex justify-center items-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: "#602a1d" }} />
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              className="border rounded-lg p-4 mb-6 backdrop-blur-sm"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                borderColor: "rgba(239, 68, 68, 0.3)",
                color: "#dc2626",
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}>
              <p>{error}</p>
            </motion.div>
          )}

          {/* Business Grid */}
          {!loading && !error && (
            <>
              <motion.div className="space-y-8 mb-8" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.8 }}>
                <h2 className="text-2xl font-bold" style={{ color: "#602a1d" }}>
                  Investment Opportunities
                </h2>
                {businesses.map((business, index) => (
                  <motion.div key={business.ID} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.9 + index * 0.05 }}>
                    <BusinessCard business={business} onViewDetails={handleViewDetails} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Empty State */}
              {businesses.length === 0 && (
                <motion.div className="text-center py-12" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                  <p className="text-lg mb-4" style={{ color: "rgba(96, 42, 29, 0.7)" }}>
                    No businesses found
                  </p>
                  <p style={{ color: "rgba(96, 42, 29, 0.5)" }}>Try adjusting your search criteria</p>
                </motion.div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <motion.div className="flex justify-center items-center space-x-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 1.0 }}>
                  <motion.button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="px-3 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
                    style={{
                      backgroundColor: "rgba(241, 237, 234, 0.8)",
                      borderColor: "rgba(96, 42, 29, 0.3)",
                      color: "#602a1d",
                    }}
                    whileHover={{ scale: 1.05 }}>
                    Previous
                  </motion.button>

                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter((page) => page === 1 || page === pagination.totalPages || Math.abs(page - pagination.page) <= 2)
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 py-2 text-sm" style={{ color: "rgba(96, 42, 29, 0.5)" }}>
                            ...
                          </span>
                        )}
                        <motion.button
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm border rounded-md backdrop-blur-sm ${page === pagination.page ? "border-opacity-50" : ""}`}
                          style={{
                            backgroundColor: page === pagination.page ? "#602a1d" : "rgba(241, 237, 234, 0.8)",
                            borderColor: page === pagination.page ? "#602a1d" : "rgba(96, 42, 29, 0.3)",
                            color: page === pagination.page ? "#f1edea" : "#602a1d",
                          }}
                          whileHover={{ scale: 1.05 }}>
                          {page}
                        </motion.button>
                      </React.Fragment>
                    ))}

                  <motion.button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className="px-3 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
                    style={{
                      backgroundColor: "rgba(241, 237, 234, 0.8)",
                      borderColor: "rgba(96, 42, 29, 0.3)",
                      color: "#602a1d",
                    }}
                    whileHover={{ scale: 1.05 }}>
                    Next
                  </motion.button>
                </motion.div>
              )}
            </>
          )}

          {/* Business Details Modal */}
          <BusinessDetailsModal business={selectedBusiness} isOpen={showModal} onClose={() => setShowModal(false)} />

          {/* AI Chat Modal */}
          <ChatModal
            isOpen={showChatModal}
            onClose={() => setShowChatModal(false)}
            initialPreferences={ChatService.createPreferences({
              industry: selectedIndustry || undefined,
              searchTerm: searchTerm || undefined,
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default InvestmentPage;
