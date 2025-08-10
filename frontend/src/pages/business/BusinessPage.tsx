import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { BusinessService, type Business } from "../../services/businessService";
import { Building2, TrendingUp, Target, Trophy, Plus, AlertCircle } from "lucide-react";

const BusinessPage: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        setError(null);

        const allBusinesses = await BusinessService.getUserBusinesses();
        if (allBusinesses) setBusinesses(allBusinesses);
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
    <div className="min-h-screen bg-brown-bg relative overflow-hidden">
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
        <div className="max-w-6xl mx-auto py-6 px-4">
          {/* Header */}
          <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full mb-6 backdrop-blur-sm border shadow-lg bg-brown-primary/10 border-brown-primary/30 text-brown-primary"
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
              <span className="text-sm font-medium">SINAR Business Platform</span>
            </motion.div>

            <motion.h1 className="text-4xl font-bold mb-4 text-brown-primary" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
              Your{" "}
              <span className="relative inline-block">
                Business
                <div className="absolute bottom-1 left-0 w-full h-2 opacity-30 -z-10 bg-brown-primary" />
              </span>{" "}
              Portfolio
            </motion.h1>

            <motion.p
              className="text-lg max-w-2xl mx-auto mb-8 leading-relaxed text-brown-primary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}>
              Manage your complete business profiles with SINAR's comprehensive platform.
            </motion.p>

            {/* Stats Overview */}
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
              <motion.div
                className="rounded-xl p-6 backdrop-blur-sm border shadow-lg bg-brown-bg-light/80 border-brown-primary/20"
                whileHover={{
                  y: -5,
                  boxShadow: "0 12px 40px rgba(96, 42, 29, 0.15)",
                }}>
                <div className="text-3xl font-bold mb-2 text-brown-primary">{businesses.length}</div>
                <div className="text-sm text-brown-primary/70">Active Businesses</div>
              </motion.div>

              <motion.div
                className="rounded-xl p-6 backdrop-blur-sm border shadow-lg bg-brown-bg-light/80 border-brown-primary/20"
                whileHover={{
                  y: -5,
                  boxShadow: "0 12px 40px rgba(96, 42, 29, 0.15)",
                }}>
                <div className="text-3xl font-bold mb-2 text-brown-primary">{businesses.length}</div>
                <div className="text-sm text-brown-primary/70">Ready for Listing</div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Business List */}
          <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.5 }}>
            {loading ? (
              <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 mb-4 border-brown-primary" />
                <p className="text-brown-primary">Loading your businesses...</p>
              </motion.div>
            ) : error ? (
              <motion.div
                className="border px-6 py-4 rounded-xl backdrop-blur-sm"
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  borderColor: "rgba(239, 68, 68, 0.3)",
                  color: "#dc2626",
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              </motion.div>
            ) : businesses.length === 0 ? (
              <motion.div className="text-center py-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.6 }}>
                <motion.div className="relative mb-8" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.7 }}>
                  <div className="absolute inset-0 flex items-center justify-center bg-brown-primary/20 rounded-full opacity-30">
                    <div className="w-24 h-24 rounded-full"></div>
                  </div>
                  <div className="relative mb-6 text-brown-primary/40">
                    <Building2 className="w-20 h-20 mx-auto" />
                  </div>
                </motion.div>

                <motion.h3 className="text-3xl font-bold mb-4 text-brown-primary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                  No Businesses Ready Yet
                </motion.h3>

                <motion.p className="text-lg mb-8 max-w-lg mx-auto leading-relaxed text-brown-primary/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                  You don't have any complete business profiles yet. Create a new business and complete all the required steps to see it listed here.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/business/step-1"
                    className="inline-flex items-center px-8 py-4 text-white rounded-xl font-semibold transition-all duration-300 shadow-xl bg-brown-primary hover:bg-brown-primary-hover">
                    <Plus className="w-5 h-5 mr-2" />
                    <span>Create New Business</span>
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <motion.div className="flex items-center justify-between" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.6 }}>
                  <h3 className="text-2xl font-bold flex items-center text-brown-primary">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center mr-3 shadow-lg bg-brown-primary">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    Your Business Portfolio
                  </h3>

                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-brown-primary/70">
                      {businesses.length} {businesses.length === 1 ? "business" : "businesses"}
                    </div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        to="/business/step-1"
                        className="inline-flex items-center px-4 py-2 text-white rounded-lg font-medium transition-all duration-300 shadow-lg text-sm bg-brown-primary hover:bg-brown-primary-hover">
                        <Plus className="w-4 h-4 mr-2" />
                        <span>New Business</span>
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Helper text */}
                <motion.p className="text-sm mb-4 text-brown-primary/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                  Click on any business card to view details and manage your business information
                </motion.p>

                <div className="grid gap-4">
                  {businesses.map((business, index) => {
                    return (
                      <motion.div key={business.ID} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.8 + index * 0.05 }} whileHover={{ y: -2 }}>
                        <Link
                          to={`/business/${business.ID}/details`}
                          className="relative group block rounded-xl p-6 border transition-all duration-300 overflow-hidden cursor-pointer backdrop-blur-sm shadow-lg bg-brown-bg-light/80 border-brown-primary/20 hover:border-brown-primary/40 hover:bg-brown-bg-light/90">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-3 mb-3">
                                <h4 className="text-xl font-semibold transition-colors duration-200 truncate text-brown-primary">{business.name}</h4>
                                <span className="px-3 py-1 rounded-full text-sm font-medium border flex-shrink-0 bg-brown-primary/10 border-brown-primary/30 text-brown-primary">Active</span>
                              </div>

                              <div className="flex items-center space-x-6 mb-3">
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

                              {business.description && <p className="text-sm line-clamp-2 text-brown-primary/60">{business.description}</p>}
                            </div>

                            <div className="flex items-center space-x-4 ml-6">
                              {/* Status Indicators */}
                              <div className="flex space-x-2">
                                <div className="w-3 h-3 rounded-full shadow-sm bg-brown-primary" title="Complete" />
                                <div className="w-3 h-3 rounded-full shadow-sm bg-brown-primary" title="Verified" />
                                <div className="w-3 h-3 rounded-full shadow-sm bg-brown-primary" title="Ready" />
                              </div>

                              {/* Click indicator */}
                              <div className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
                                <svg className="w-6 h-6 text-brown-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </div>

                          {/* Hover effect overlay */}
                          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 bg-brown-primary/5" />
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
