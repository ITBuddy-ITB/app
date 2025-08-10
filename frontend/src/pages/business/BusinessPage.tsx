import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { BusinessService, type Business } from "../../services/businessService";
import { Building2, TrendingUp, Target, Trophy, Plus, AlertCircle } from "lucide-react";

const BusinessPage: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [completeBusiness, setCompleteBusiness] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        setError(null);

        const allBusinesses = await BusinessService.getUserBusinesses();
        if (allBusinesses) {
          setBusinesses(allBusinesses);

          const completeBusinesses = allBusinesses.filter((business) => {
            const hasFinancials = business.financials && business.financials.length > 0;
            const hasLegals = business.legals && business.legals.length > 0;
            const hasProducts = business.products && business.products.length > 0;

            return hasFinancials && hasLegals && hasProducts;
          });

          setCompleteBusiness(completeBusinesses);
        }
      } catch (err: unknown) {
        console.error("Failed to load businesses:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to load businesses";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-brown-bg">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute w-32 h-32 rounded-full top-20 left-10 bg-brown-primary/20"
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
          className="absolute w-24 h-24 rounded-full top-40 right-20 bg-brown-accent/30"
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
          className="absolute w-20 h-20 rounded-full bottom-32 left-1/4 bg-brown-primary/25"
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
        <div className="max-w-6xl px-4 py-6 mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 mb-6 border rounded-full shadow-lg backdrop-blur-sm bg-brown-primary/10 border-brown-primary/30 text-brown-primary"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            >
              <motion.div
                animate={{
                  rotate: [0, 360, 360, 0, 0, 0, 0, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatDelay: 4,
                  ease: "easeInOut",
                }}
              >
                <Trophy className="w-4 h-4 mr-2" />
              </motion.div>
              <span className="text-sm font-medium">SINAR Business Platform</span>
            </motion.div>

            <motion.h1
              className="mb-4 text-4xl font-bold text-brown-primary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Portofolio{" "}
              <span className="relative inline-block">
                Bisnis
                <div className="absolute left-0 w-full h-2 bottom-1 opacity-30 -z-10 bg-brown-primary" />
              </span>{" "}
              Anda
            </motion.h1>

            <motion.p
              className="max-w-2xl mx-auto mb-8 text-lg leading-relaxed text-brown-primary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              Kelola profil bisnis lengkap Anda dengan platform komprehensif SINAR.
            </motion.p>

            {/* Stats Overview */}
            <motion.div
              className="grid max-w-xl grid-cols-1 gap-6 mx-auto md:grid-cols-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <motion.div
                className="p-6 border shadow-lg rounded-xl backdrop-blur-sm bg-brown-bg-light/80 border-brown-primary/20"
                whileHover={{
                  y: -5,
                  boxShadow: "0 12px 40px rgba(96, 42, 29, 0.15)",
                }}
              >
                <div className="mb-2 text-3xl font-bold text-brown-primary">{businesses.length}</div>
                <div className="text-sm text-brown-primary/70">Bisnis Aktif</div>
              </motion.div>

              <motion.div
                className="p-6 border shadow-lg rounded-xl backdrop-blur-sm bg-brown-bg-light/80 border-brown-primary/20"
                whileHover={{
                  y: -5,
                  boxShadow: "0 12px 40px rgba(96, 42, 29, 0.15)",
                }}
              >
                <div className="mb-2 text-3xl font-bold text-brown-primary">{completeBusiness.length}</div>
                <div className="text-sm text-brown-primary/70">Siap untuk Listing</div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Business List */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            {loading ? (
              <motion.div className="py-12 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="inline-block w-10 h-10 mb-4 border-b-2 rounded-full animate-spin border-brown-primary" />
                <p className="text-brown-primary">Memuat bisnis Anda...</p>
              </motion.div>
            ) : error ? (
              <motion.div
                className="px-6 py-4 border rounded-xl backdrop-blur-sm"
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  borderColor: "rgba(239, 68, 68, 0.3)",
                  color: "#dc2626",
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              </motion.div>
            ) : businesses.length === 0 ? (
              <motion.div
                className="py-16 text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <motion.div
                  className="relative mb-8"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.7 }}
                >
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-brown-primary/20 opacity-30">
                    <div className="w-24 h-24 rounded-full"></div>
                  </div>
                  <div className="relative mb-6 text-brown-primary/40">
                    <Building2 className="w-20 h-20 mx-auto" />
                  </div>
                </motion.div>

                <motion.h3
                  className="mb-4 text-3xl font-bold text-brown-primary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Belum Ada Bisnis Siap
                </motion.h3>

                <motion.p
                  className="max-w-lg mx-auto mb-8 text-lg leading-relaxed text-brown-primary/70"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  Anda belum memiliki profil bisnis yang lengkap. Buat bisnis baru dan lengkapi semua langkah yang
                  diperlukan untuk melihatnya terdaftar di sini.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/business/step-1"
                    className="inline-flex items-center px-8 py-4 font-semibold text-white transition-all duration-300 shadow-xl rounded-xl bg-brown-primary hover:bg-brown-primary-hover"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    <span>Buat Bisnis Baru</span>
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <motion.div
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <h3 className="flex items-center text-2xl font-bold text-brown-primary">
                    <div className="flex items-center justify-center w-8 h-8 mr-3 rounded-lg shadow-lg bg-brown-primary">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    Portofolio Bisnis Anda
                  </h3>

                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-brown-primary/70">{businesses.length} bisnis</div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        to="/business/step-1"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-all duration-300 rounded-lg shadow-lg bg-brown-primary hover:bg-brown-primary-hover"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        <span>Bisnis Baru</span>
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Helper text */}
                <motion.p
                  className="mb-4 text-sm text-brown-primary/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  Klik pada kartu bisnis mana pun untuk melihat detail dan mengelola informasi bisnis Anda
                </motion.p>

                <div className="grid gap-4">
                  {businesses.map((business, index) => {
                    return (
                      <motion.div
                        key={business.ID}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.8 + index * 0.05 }}
                        whileHover={{ y: -2 }}
                      >
                        <Link
                          to={`/business/${business.ID}/details`}
                          className="relative block p-6 overflow-hidden transition-all duration-300 border shadow-lg cursor-pointer group rounded-xl backdrop-blur-sm bg-brown-bg-light/80 border-brown-primary/20 hover:border-brown-primary/40 hover:bg-brown-bg-light/90"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center mb-3 space-x-3">
                                <h4 className="text-xl font-semibold truncate transition-colors duration-200 text-brown-primary">
                                  {business.name}
                                </h4>
                                <span className="flex-shrink-0 px-3 py-1 text-sm font-medium border rounded-full bg-brown-primary/10 border-brown-primary/30 text-brown-primary">
                                  Active
                                </span>
                              </div>

                              <div className="flex items-center mb-3 space-x-6">
                                {business.type && (
                                  <span className="flex items-center text-sm text-brown-primary/70">
                                    <Target className="w-4 h-4 mr-2 text-brown-primary" />
                                    {business.type}
                                  </span>
                                )}
                                {business.industry && (
                                  <span className="flex items-center text-sm text-brown-primary/70">
                                    <Building2 className="w-4 h-4 mr-2 text-brown-primary" />
                                    {business.industry}
                                  </span>
                                )}
                              </div>

                              {business.description && (
                                <p className="text-sm line-clamp-2 text-brown-primary/60">{business.description}</p>
                              )}
                            </div>

                            <div className="flex items-center ml-6 space-x-4">
                              {/* Status Indicators */}
                              <div className="flex space-x-2">
                                <div className="w-3 h-3 rounded-full shadow-sm bg-brown-primary" title="Complete" />
                                <div className="w-3 h-3 rounded-full shadow-sm bg-brown-primary" title="Verified" />
                                <div className="w-3 h-3 rounded-full shadow-sm bg-brown-primary" title="Ready" />
                              </div>

                              {/* Click indicator */}
                              <div className="transition-all duration-200 opacity-50 group-hover:opacity-100 group-hover:translate-x-1">
                                <svg
                                  className="w-6 h-6 text-brown-primary"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </div>

                          {/* Hover effect overlay */}
                          <div className="absolute inset-0 transition-all duration-300 opacity-0 rounded-xl group-hover:opacity-100 bg-brown-primary/5" />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPage;
