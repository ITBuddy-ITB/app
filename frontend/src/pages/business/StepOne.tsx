import React from "react";
import { motion } from "framer-motion";
import { useBusiness } from "../../hooks/useBusiness";
import { useNavigate } from "react-router";
import { Trophy, Sparkles } from "lucide-react";

const Step1Page: React.FC = () => {
  const navigate = useNavigate();
  const { business, setBusiness, submitBusiness, loading, error } = useBusiness();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submitBusiness();
    if (result) {
      // Redirect to business detail page
      navigate(`/business/${result.ID}/details`);
    }
  };

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
            duration: 4,
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
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-32 left-1/4 w-20 h-20 bg-brown-primary/25 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto py-10 px-4">
        <motion.div className="text-center mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <motion.div className="flex items-center justify-center mb-4" animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 2 }}>
            <Trophy className="w-8 h-8 text-brown-accent" />
          </motion.div>
          <h2 className="text-3xl font-bold text-brown-primary mb-2 drop-shadow-sm">Create New Business</h2>
          <p className="text-brown-text/70">Start your journey to investment readiness</p>
        </motion.div>

        <motion.form onSubmit={handleSubmit} className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          {/* Business Profile */}
          <motion.div
            className="relative bg-brown-bg-light/80 backdrop-blur-sm shadow-xl rounded-xl p-6 space-y-4 border border-brown-bg/30 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <motion.div
                className="absolute top-4 right-4 w-16 h-16 bg-brown-primary/20 rounded-full"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            <motion.h3
              className="relative text-lg font-semibold text-brown-primary flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}>
                <Sparkles className="w-5 h-5 mr-2 text-brown-accent" />
              </motion.div>
              Business Profile
            </motion.h3>

            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }}>
                <label className="block text-sm font-medium text-brown-primary mb-2">Business Name *</label>
                <input
                  type="text"
                  className="w-full border-2 border-brown-bg/50 rounded-lg px-4 py-2 bg-white/80 backdrop-blur-sm focus:border-brown-accent focus:outline-none focus:ring-2 focus:ring-brown-accent/20 transition-all duration-200 text-brown-text"
                  value={business.name}
                  onChange={(e) => setBusiness({ ...business, name: e.target.value })}
                  required
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.5 }}>
                <label className="block text-sm font-medium text-brown-primary mb-2">Business Type</label>
                <input
                  type="text"
                  className="w-full border-2 border-brown-bg/50 rounded-lg px-4 py-2 bg-white/80 backdrop-blur-sm focus:border-brown-accent focus:outline-none focus:ring-2 focus:ring-brown-accent/20 transition-all duration-200 text-brown-text"
                  value={business.type}
                  onChange={(e) => setBusiness({ ...business, type: e.target.value })}
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.6 }}>
                <label className="block text-sm font-medium text-brown-primary mb-2">Founded At</label>
                <input
                  type="date"
                  className="w-full border-2 border-brown-bg/50 rounded-lg px-4 py-2 bg-white/80 backdrop-blur-sm focus:border-brown-accent focus:outline-none focus:ring-2 focus:ring-brown-accent/20 transition-all duration-200 text-brown-text"
                  value={business.foundedAt}
                  onChange={(e) => setBusiness({ ...business, foundedAt: e.target.value })}
                />
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.7 }}>
              <label className="block text-sm font-medium text-brown-primary mb-2">Description</label>
              <textarea
                className="w-full border-2 border-brown-bg/50 rounded-lg px-4 py-2 bg-white/80 backdrop-blur-sm focus:border-brown-accent focus:outline-none focus:ring-2 focus:ring-brown-accent/20 transition-all duration-200 text-brown-text resize-none"
                rows={3}
                value={business.description}
                onChange={(e) => setBusiness({ ...business, description: e.target.value })}
                placeholder="Describe your business vision and goals..."
              />
            </motion.div>
          </motion.div>

          {/* Submit */}
          <motion.div className="flex justify-between items-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.8 }}>
            {error && (
              <motion.span className="text-red-600 bg-red-50 px-3 py-1 rounded-lg text-sm font-medium" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                {error}
              </motion.span>
            )}
            <motion.button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-brown-primary to-brown-accent hover:from-brown-primary/90 hover:to-brown-accent/90 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}>
              {loading ? (
                <div className="flex items-center">
                  <motion.div
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
                  />
                  Creating...
                </div>
              ) : (
                "Create Business"
              )}
            </motion.button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
};

export default Step1Page;
