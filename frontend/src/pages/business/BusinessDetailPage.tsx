import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { motion } from "framer-motion";
import { BusinessService, type Business } from "../../services/businessService";
import { ArrowLeft, Building2, TrendingUp, DollarSign, Scale, Package, Calendar, Target, Award, BarChart3, CheckCircle, AlertCircle, Clock, Plus } from "lucide-react";
import AISuggestions from "../../components/business/AISuggestions";

const BusinessDetailPage: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        setError(null);
        const business = await BusinessService.getBusinessById(parseInt(businessId!));
        setBusiness(business);
      } catch (err: unknown) {
        console.error("Failed to load business:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to load business details";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (businessId) {
      fetchBusiness();
    }
  }, [businessId]);

  // Calculate investment readiness score
  const calculateInvestmentReadiness = (business: Business) => {
    let score = 0;
    if (business.financial) score += 30;
    if (business.legals && business.legals.length > 0) score += 25;
    if (business.products && business.products.length > 0) score += 20;
    if (business.description) score += 15;
    if (business.market_cap && business.market_cap > 10000000000) score += 10;
    return score;
  };

  const getBusinessStage = (score: number) => {
    if (score >= 80)
      return {
        stage: "Siap Investasi",
        color: "text-brown-primary",
        bg: "bg-brown-bg",
        border: "border-brown-accent",
      };
    if (score >= 60) return { stage: "Growth", color: "text-brown-accent", bg: "bg-brown-accent-light", border: "border-brown-accent" };
    if (score >= 40) return { stage: "Scale-up", color: "text-yellow-600", bg: "bg-yellow-100", border: "border-yellow-200" };
    return { stage: "UMKM", color: "text-red-600", bg: "bg-red-100", border: "border-red-200" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brown-bg relative overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div
              className="inline-block rounded-full h-12 w-12 border-b-2 mb-4 border-brown-primary"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-lg text-brown-primary/80">Memuat detail bisnis...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-brown-bg relative overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center py-20" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <motion.div
              className="rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}>
              <AlertCircle className="w-10 h-10 text-red-600" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: "#602a1d" }}>
              Terjadi Kesalahan
            </h2>
            <p className="text-lg mb-6" style={{ color: "rgba(96, 42, 29, 0.7)" }}>
              {error || "Bisnis tidak ditemukan"}
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/business"
                className="inline-flex items-center px-6 py-3 rounded-lg transition-colors backdrop-blur-sm border shadow-lg"
                style={{
                  backgroundColor: "#602a1d",
                  borderColor: "rgba(96, 42, 29, 0.3)",
                  color: "#f1edea",
                }}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Daftar Bisnis
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  const investmentScore = calculateInvestmentReadiness(business);
  const stage = getBusinessStage(investmentScore);

  return (
    <div className="min-h-screen bg-brown-bg relative overflow-hidden pb-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-brown-primary/20 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 bg-brown-accent/30 rounded-full"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute bottom-32 left-1/4 w-20 h-20 bg-brown-primary/25 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Header with Back Button */}
          <motion.div className="mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <motion.div whileHover={{ x: -5 }} transition={{ duration: 0.2 }}>
                <Link to="/business" className="inline-flex items-center transition-colors duration-200 backdrop-blur-sm px-3 py-2 rounded-lg" style={{ color: "rgba(96, 42, 29, 0.8)" }}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span className="font-medium">Kembali ke Portofolio Bisnis</span>
                </Link>
              </motion.div>
              {/* Create New Business Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/business/step-1"
                  className="inline-flex items-center px-4 py-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md text-sm font-medium backdrop-blur-sm border w-full sm:w-auto justify-center"
                  style={{
                    backgroundColor: "#602a1d",
                    borderColor: "rgba(96, 42, 29, 0.3)",
                    color: "#f1edea",
                  }}>
                  <Plus className="w-4 h-4 mr-2" />
                  <span>Buat Bisnis Baru</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Business Hero Section */}
          <motion.div
            className="relative rounded-2xl p-4 sm:p-6 mb-6 overflow-hidden shadow-xl backdrop-blur-sm border"
            style={{
              background: "linear-gradient(135deg, #602a1d 0%, rgba(96, 42, 29, 0.9) 50%, #602a1d 100%)",
              borderColor: "rgba(96, 42, 29, 0.3)",
              boxShadow: "0 20px 60px rgba(96, 42, 29, 0.3)",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}>
            {/* Background Pattern */}
            <div className="absolute inset-0" style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}>
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 25% 25%, rgba(241, 237, 234, 0.3) 2px, transparent 2px)`,
                  backgroundSize: "24px 24px",
                  opacity: 0.4,
                }}
              />
            </div>

            <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 items-center">
              <div className="lg:col-span-2 space-y-4">
                <motion.div
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}>
                  <h1 className="text-xl sm:text-2xl font-bold drop-shadow-lg" style={{ color: "#f1edea" }}>
                    {business.name}
                  </h1>
                  <motion.span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border shadow-lg backdrop-blur-sm`}
                    style={{
                      backgroundColor: "rgba(241, 237, 234, 0.9)",
                      borderColor: "rgba(96, 42, 29, 0.3)",
                      color: "#602a1d",
                    }}
                    whileHover={{ scale: 1.05 }}>
                    {stage.stage}
                  </motion.span>
                </motion.div>

                {business.description && (
                  <motion.p
                    className="text-sm mb-4 leading-relaxed max-w-2xl drop-shadow-md"
                    style={{ color: "rgba(241, 237, 234, 0.9)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}>
                    {business.description}
                  </motion.p>
                )}

                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 text-xs"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}>
                  {business.type && (
                    <motion.div
                      className="backdrop-blur-sm rounded-lg p-2 border shadow-lg"
                      style={{
                        backgroundColor: "rgba(241, 237, 234, 0.2)",
                        borderColor: "rgba(241, 237, 234, 0.3)",
                      }}
                      whileHover={{ scale: 1.02 }}>
                      <div className="flex items-center mb-1">
                        <Target className="w-3 h-3 mr-1" style={{ color: "#f1edea" }} />
                        <span className="font-medium" style={{ color: "#f1edea" }}>
                          Tipe
                        </span>
                      </div>
                      <span className="font-medium text-xs" style={{ color: "rgba(241, 237, 234, 0.9)" }}>
                        {business.type}
                      </span>
                    </motion.div>
                  )}
                  {business.industry && (
                    <motion.div
                      className="backdrop-blur-sm rounded-lg p-2 border shadow-lg"
                      style={{
                        backgroundColor: "rgba(241, 237, 234, 0.2)",
                        borderColor: "rgba(241, 237, 234, 0.3)",
                      }}
                      whileHover={{ scale: 1.02 }}>
                      <div className="flex items-center mb-1">
                        <Building2 className="w-3 h-3 mr-1" style={{ color: "#f1edea" }} />
                        <span className="font-medium" style={{ color: "#f1edea" }}>
                          Industri
                        </span>
                      </div>
                      <span className="font-medium text-xs" style={{ color: "rgba(241, 237, 234, 0.9)" }}>
                        {business.industry}
                      </span>
                    </motion.div>
                  )}
                  {business.market_cap && (
                    <motion.div
                      className="backdrop-blur-sm rounded-lg p-2 border shadow-lg"
                      style={{
                        backgroundColor: "rgba(241, 237, 234, 0.2)",
                        borderColor: "rgba(241, 237, 234, 0.3)",
                      }}
                      whileHover={{ scale: 1.02 }}>
                      <div className="flex items-center mb-1">
                        <DollarSign className="w-3 h-3 mr-1" style={{ color: "#f1edea" }} />
                        <span className="font-medium" style={{ color: "#f1edea" }}>
                          Kapitalisasi Pasar
                        </span>
                      </div>
                      <span className="font-medium text-xs" style={{ color: "rgba(241, 237, 234, 0.9)" }}>
                        IDR {(business.market_cap / 1000000000).toFixed(1)}M
                      </span>
                    </motion.div>
                  )}
                  {business.founded_at && (
                    <motion.div
                      className="backdrop-blur-sm rounded-lg p-2 border shadow-lg"
                      style={{
                        backgroundColor: "rgba(241, 237, 234, 0.2)",
                        borderColor: "rgba(241, 237, 234, 0.3)",
                      }}
                      whileHover={{ scale: 1.02 }}>
                      <div className="flex items-center mb-1">
                        <Calendar className="w-3 h-3 mr-1" style={{ color: "#f1edea" }} />
                        <span className="font-medium" style={{ color: "#f1edea" }}>
                          Didirikan
                        </span>
                      </div>
                      <span className="font-medium text-xs" style={{ color: "rgba(241, 237, 234, 0.9)" }}>
                        {new Date(business.founded_at).getFullYear()}
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {/* Investment Readiness Score */}
              <div className="lg:col-span-1">
                <motion.div
                  className="backdrop-blur-sm rounded-xl p-6 text-center border shadow-xl"
                  style={{
                    backgroundColor: "rgba(241, 237, 234, 0.25)",
                    borderColor: "rgba(241, 237, 234, 0.3)",
                  }}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 }}>
                  <div className="text-2xl sm:text-3xl font-bold mb-2 text-white drop-shadow-lg">{investmentScore}%</div>
                  <div className="text-white font-semibold text-sm mb-3 drop-shadow-md">Siap Investasi</div>
                  <div className="w-full bg-white/30 rounded-full h-2 mb-3 shadow-inner">
                    <div className="bg-white h-2 rounded-full transition-all duration-1000 shadow-sm" style={{ width: `${investmentScore}%` }}></div>
                  </div>
                  <p className="text-white/90 text-xs font-medium drop-shadow-sm">{investmentScore >= 80 ? "Siap untuk investasi!" : investmentScore >= 60 ? "Hampir siap!" : "Terus kembangkan!"}</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Management Sections Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Products Management */}
          <Link
            to={`/business/${businessId}/products`}
            className="group relative bg-brown-bg-light rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-brown-bg hover:border-brown-accent overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brown-bg-light/0 to-brown-bg-light/0 group-hover:from-brown-bg-light/50 group-hover:to-brown-bg/30 transition-all duration-300"></div>
            <div className="relative text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brown-bg rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-brown-primary" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-brown-primary transition-colors">Produk</h3>
              <p className="text-gray-600 mb-3 leading-relaxed text-xs sm:text-sm">Kelola produk dan layanan bisnis Anda</p>
              <div className="flex items-center justify-center text-xs text-gray-500">
                <span className="flex items-center">
                  {business.products && business.products.length > 0 ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1 text-brown-accent" />
                      {business.products.length} produk
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 mr-1 text-gray-400" />
                      Belum ada produk
                    </>
                  )}
                </span>
              </div>
            </div>
          </Link>

          {/* Legal Documents */}
          <Link
            to={`/business/${businessId}/legal`}
            className="group relative bg-brown-bg-light rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-brown-bg hover:border-brown-accent overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brown-bg-light/0 to-brown-bg-light/0 group-hover:from-brown-bg-light/50 group-hover:to-brown-bg/30 transition-all duration-300"></div>
            <div className="relative text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brown-bg rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-brown-primary" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-brown-primary transition-colors">Dokumen Legal</h3>
              <p className="text-gray-600 mb-3 leading-relaxed text-xs sm:text-sm">Unggah dan kelola sertifikat legal</p>
              <div className="flex items-center justify-center text-xs text-gray-500">
                <span className="flex items-center">
                  {business.legals && business.legals.length > 0 ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1 text-brown-accent" />
                      {business.legals.length} dokumen
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 mr-1 text-gray-400" />
                      Belum ada dokumen
                    </>
                  )}
                </span>
              </div>
            </div>
          </Link>

          {/* Financial Data */}
          <Link
            to={`/business/${businessId}/finance`}
            className="group relative bg-brown-bg-light rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-brown-bg hover:border-brown-accent overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brown-bg-light/0 to-brown-bg-light/0 group-hover:from-brown-bg-light/50 group-hover:to-brown-bg/30 transition-all duration-300"></div>
            <div className="relative text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brown-bg rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-brown-primary" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-brown-primary transition-colors">Data Keuangan</h3>
              <p className="text-gray-600 mb-3 leading-relaxed text-xs sm:text-sm">Tambahkan informasi dan laporan keuangan</p>
              <div className="flex items-center justify-center text-xs text-gray-500">
                <span className="flex items-center">
                  {business.financial ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1 text-brown-accent" />
                      Lengkap
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 mr-1 text-gray-400" />
                      Tertunda
                    </>
                  )}
                </span>
              </div>
            </div>
          </Link>

          {/* Investment Projections */}
          <Link
            to={`/business/${businessId}/projections`}
            className="group relative bg-brown-bg-light rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-brown-bg hover:border-brown-accent overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brown-bg-light/0 to-brown-bg-light/0 group-hover:from-brown-bg-light/50 group-hover:to-brown-bg/30 transition-all duration-300"></div>
            <div className="relative text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brown-bg rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-brown-primary" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-brown-primary transition-colors">Proyeksi</h3>
              <p className="text-gray-600 mb-3 leading-relaxed text-xs sm:text-sm">Proyeksi keuangan dan perkiraan pertumbuhan</p>
              <div className="flex items-center justify-center text-xs text-gray-500">
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-gray-400" />
                  Lihat proyeksi
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* AI Suggestions */}
        <div className="max-w-6xl mx-auto pb-8">
          <AISuggestions businessId={business.ID} businessName={business.name} />
        </div>

        {/* Investment Readiness Breakdown */}
        <motion.div
          className="max-w-6xl mx-auto relative bg-gradient-to-br from-brown-bg-light via-brown-bg-light to-brown-bg/20 rounded-xl shadow-lg border border-brown-bg/30 p-4 sm:p-6 backdrop-blur-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}>
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -top-4 -right-4 w-24 h-24 bg-brown-primary/10 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute -bottom-6 -left-6 w-32 h-32 bg-brown-accent/10 rounded-full"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </div>

          <motion.h2
            className="relative text-lg sm:text-xl font-bold text-brown-primary mb-4 sm:mb-6 flex items-center drop-shadow-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}>
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 4 }}>
              <Award className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-brown-accent" />
            </motion.div>
            Rincian Kesiapan Investasi
          </motion.h2>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <motion.div className="text-center group" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.8 }} whileHover={{ scale: 1.05 }}>
              <motion.div
                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg transition-all duration-300 ${
                  business.financial ? "bg-gradient-to-br from-brown-accent to-brown-primary" : "bg-gradient-to-br from-gray-100 to-gray-200"
                }`}
                whileHover={{ scale: 1.1, rotate: 5 }}>
                <DollarSign className={`w-5 h-5 sm:w-6 sm:h-6 ${business.financial ? "text-white" : "text-gray-400"}`} />
              </motion.div>
              <h3 className="font-semibold text-brown-primary mb-1 text-xs sm:text-sm">Data Keuangan</h3>
              <p className="text-xs text-brown-text/70 mb-2">30% dari total skor</p>
              <div
                className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium shadow-sm transition-all duration-300 ${
                  business.financial ? "bg-brown-accent/20 text-brown-primary border border-brown-accent/30" : "bg-gray-100 text-gray-600 border border-gray-200"
                }`}>
                {business.financial ? "Lengkap" : "Belum lengkap"}
              </div>
            </motion.div>

            <motion.div className="text-center group" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.85 }} whileHover={{ scale: 1.05 }}>
              <motion.div
                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg transition-all duration-300 ${
                  business.legals && business.legals.length > 0 ? "bg-gradient-to-br from-brown-accent to-brown-primary" : "bg-gradient-to-br from-gray-100 to-gray-200"
                }`}
                whileHover={{ scale: 1.1, rotate: -5 }}>
                <Scale className={`w-5 h-5 sm:w-6 sm:h-6 ${business.legals && business.legals.length > 0 ? "text-white" : "text-gray-400"}`} />
              </motion.div>
              <h3 className="font-semibold text-brown-primary mb-1 text-xs sm:text-sm">Dokumen Legal</h3>
              <p className="text-xs text-brown-text/70 mb-2">25% dari total skor</p>
              <div
                className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium shadow-sm transition-all duration-300 ${
                  business.legals && business.legals.length > 0 ? "bg-brown-accent/20 text-brown-primary border border-brown-accent/30" : "bg-gray-100 text-gray-600 border border-gray-200"
                }`}>
                {business.legals && business.legals.length > 0 ? `${business.legals.length} dokumen` : "Belum lengkap"}
              </div>
            </motion.div>

            <motion.div className="text-center group" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.9 }} whileHover={{ scale: 1.05 }}>
              <motion.div
                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg transition-all duration-300 ${
                  business.products && business.products.length > 0 ? "bg-gradient-to-br from-brown-accent to-brown-primary" : "bg-gradient-to-br from-gray-100 to-gray-200"
                }`}
                whileHover={{ scale: 1.1, rotate: 5 }}>
                <Package className={`w-5 h-5 sm:w-6 sm:h-6 ${business.products && business.products.length > 0 ? "text-white" : "text-gray-400"}`} />
              </motion.div>
              <h3 className="font-semibold text-brown-primary mb-1 text-xs sm:text-sm">Produk</h3>
              <p className="text-xs text-brown-text/70 mb-2">20% dari total skor</p>
              <div
                className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium shadow-sm transition-all duration-300 ${
                  business.products && business.products.length > 0 ? "bg-brown-accent/20 text-brown-primary border border-brown-accent/30" : "bg-gray-100 text-gray-600 border border-gray-200"
                }`}>
                {business.products && business.products.length > 0 ? `${business.products.length} produk` : "Belum lengkap"}
              </div>
            </motion.div>

            <motion.div className="text-center group" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.95 }} whileHover={{ scale: 1.05 }}>
              <motion.div
                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg transition-all duration-300 ${
                  business.market_cap && business.market_cap > 10000000000 ? "bg-gradient-to-br from-brown-accent to-brown-primary" : "bg-gradient-to-br from-gray-100 to-gray-200"
                }`}
                whileHover={{ scale: 1.1, rotate: -5 }}>
                <TrendingUp className={`w-5 h-5 sm:w-6 sm:h-6 ${business.market_cap && business.market_cap > 10000000000 ? "text-white" : "text-gray-400"}`} />
              </motion.div>
              <h3 className="font-semibold text-brown-primary mb-1 text-xs sm:text-sm">Kapitalisasi Pasar</h3>
              <p className="text-xs text-brown-text/70 mb-2">15% + 10% bonus</p>
              <div
                className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium shadow-sm transition-all duration-300 ${
                  business.market_cap && business.market_cap > 10000000000 ? "bg-brown-accent/20 text-brown-primary border border-brown-accent/30" : "bg-gray-100 text-gray-600 border border-gray-200"
                }`}>
                {business.market_cap && business.market_cap > 10000000000 ? "Memenuhi syarat" : "Di bawah ambang batas"}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BusinessDetailPage;
