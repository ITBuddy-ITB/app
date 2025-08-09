import React from "react";
import { Link } from "react-router";
import { TrendingUp, Building2, Trophy, CheckCircle, Banknote, FileCheck, Scale, Users } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const Homepage: React.FC = () => {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #f1edea 0%, #dbd7d2 30%, #f1edea 70%, #dbd7d2 100%)",
      }}>
      {/* Animated Background Patterns */}
      <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        {/* Large radial gradients for depth */}
        <div
          className="absolute inset-0 animate-pulse opacity-15"
          style={{
            background: "radial-gradient(circle at 20% 20%, #602a1d 0%, transparent 40%)",
            animationDuration: "2s",
          }}
        />
        <div
          className="absolute inset-0 animate-pulse opacity-15"
          style={{
            background: "radial-gradient(circle at 80% 80%, #602a1d 0%, transparent 40%)",
            animationDuration: "2.5s",
            animationDelay: "0.5s",
          }}
        />

        {/* Additional texture layers */}
        <div
          className="absolute inset-0 opacity-8"
          style={{
            background: "conic-gradient(from 0deg at 50% 50%, #602a1d 0%, transparent 25%, #602a1d 50%, transparent 75%, #602a1d 100%)",
            mixBlendMode: "multiply",
          }}
        />
      </motion.div>

      {/* Geometric pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            radial-gradient(circle at 25% 25%, #602a1d 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, #602a1d 1px, transparent 1px)
          `,
            backgroundSize: "60px 60px, 30px 30px",
          }}
        />
      </div>

      {/* Floating animated elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-40 h-40 rounded-full opacity-10 blur-2xl"
          style={{ backgroundColor: "#602a1d" }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-32 h-32 rounded-full opacity-10 blur-2xl"
          style={{ backgroundColor: "#602a1d" }}
          animate={{
            y: [0, 25, 0],
            x: [0, -15, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-28 h-28 rounded-full opacity-10 blur-2xl"
          style={{ backgroundColor: "#602a1d" }}
          animate={{
            y: [0, -20, 0],
            x: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-32 right-1/3 w-36 h-36 rounded-full opacity-10 blur-2xl"
          style={{ backgroundColor: "#602a1d" }}
          animate={{
            y: [0, 35, 0],
            x: [0, -25, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.25,
          }}
        />
      </div>

      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          background: `
            linear-gradient(45deg, transparent 40%, rgba(96, 42, 29, 0.05) 50%, transparent 60%),
            linear-gradient(-45deg, transparent 40%, rgba(96, 42, 29, 0.05) 50%, transparent 60%)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto py-16 sm:px-6 lg:px-8">
          <motion.div className="px-4 text-center relative" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* Hero content backdrop */}
            <motion.div className="absolute inset-0 rounded-3xl" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }} />

            <div className="relative z-10">
              <motion.div
                className="inline-flex items-center px-4 py-2 bg-brown-accent-light text-brown-primary rounded-full mb-6 shadow-lg"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}>
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
                <span className="text-sm font-medium">Dari UMKM ke Siap Investasi</span>
              </motion.div>

              <motion.h1 className="text-5xl font-bold text-gray-900 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
                Kembangkan <span className="text-brown-primary">UMKM</span> Anda Menuju
                <br />
                <span className="text-brown-primary">Siap Investasi</span>
              </motion.h1>

              <motion.p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
                Transformasikan usaha kecil Anda menjadi perusahaan yang siap menerima investasi. Platform bertenaga AI SINAR memandu Anda melalui kepatuhan finansial, persyaratan legal, dan metrik
                pertumbuhan yang diperlukan untuk menarik investor swasta dan mitra ekuitas.
              </motion.p>

              <motion.div className="flex flex-col sm:flex-row gap-4 justify-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/business"
                    className="bg-brown-primary hover:bg-brown-primary-hover text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl">
                    <Building2 className="w-5 h-5 mr-2" />
                    Mulai Perjalanan Pertumbuhan
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/investments"
                    className="bg-white/90 backdrop-blur-sm border-2 border-brown-primary text-brown-primary hover:bg-brown-bg-light hover:border-brown-primary px-8 py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl">
                    <Banknote className="w-5 h-5 mr-2" />
                    Temukan Peluang Investasi
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* Growth Path Visualization */}
            <motion.div
              className="bg-gradient-to-br from-brown-bg-light/90 to-brown-bg-light/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-16 border border-brown-bg/30 overflow-hidden relative"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}>
              {/* Background decorative elements */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brown-primary rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-brown-accent rounded-full translate-y-12 -translate-x-12"></div>
              </div>

              <motion.h3
                className="text-2xl font-bold text-brown-primary mb-12 text-center relative"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}>
                Jalur Menuju Investasi Swasta
              </motion.h3>

              <div className="relative max-w-4xl mx-auto">
                {/* Progress Line - Desktop */}
                <div className="hidden md:block absolute top-12 left-0 right-0 h-1">
                  <motion.div
                    className="h-full bg-gradient-to-r from-brown-bg via-brown-accent-light to-brown-primary rounded-full relative overflow-hidden mx-10"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }}>
                    {/* Animated shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                    />
                  </motion.div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between space-y-12 md:space-y-0">
                  {[
                    {
                      step: "1",
                      title: "UMKM",
                      subtitle: "Usaha Kecil",
                      icon: Building2,
                      bgGradient: "bg-gradient-to-br from-brown-bg to-brown-bg",
                      textColor: "text-brown-primary",
                      borderColor: "border-brown-primary/30",
                    },
                    {
                      step: "2",
                      title: "Kepatuhan",
                      subtitle: "Legal & Keuangan",
                      icon: CheckCircle,
                      bgGradient: "bg-gradient-to-br from-brown-accent-light to-brown-accent-light",
                      textColor: "text-brown-primary",
                      borderColor: "border-brown-accent/40",
                    },
                    {
                      step: "3",
                      title: "Pertumbuhan",
                      subtitle: "Skalasi Operasi",
                      icon: TrendingUp,
                      bgGradient: "bg-gradient-to-br from-brown-accent-light to-brown-accent",
                      textColor: "text-brown-primary",
                      borderColor: "border-brown-accent/50",
                    },
                    {
                      step: "4",
                      title: "Siap Investasi",
                      subtitle: "Ekuitas Swasta",
                      icon: Trophy,
                      bgGradient: "bg-gradient-to-br from-brown-primary to-brown-primary",
                      textColor: "text-white",
                      borderColor: "border-brown-primary/60",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex flex-col items-center relative z-10 group"
                      initial={{ opacity: 0, scale: 0.8, y: 30 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}>
                      {/* Step Circle */}
                      <motion.div
                        className={`${item.bgGradient} ${item.textColor} w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-lg border-2 ${item.borderColor} relative overflow-hidden group-hover:shadow-xl transition-all duration-300`}
                        whileHover={{ rotate: 5 }}>
                        {/* Inner glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-full"></div>

                        {item.icon === Trophy ? (
                          <motion.div
                            animate={{
                              rotate: [0, 360, 360, 0, 0, 0, 0, 0],
                            }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              repeatDelay: 4,
                              ease: "easeInOut",
                              delay: 1,
                            }}>
                            <item.icon className="w-9 h-9 relative z-10" />
                          </motion.div>
                        ) : (
                          <item.icon className="w-9 h-9 relative z-10" />
                        )}

                        {/* Step number badge */}
                        <motion.div
                          className="absolute -top-2 -right-2 w-6 h-6 bg-brown-primary text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1.0 + index * 0.1, type: "spring", stiffness: 200 }}>
                          {item.step}
                        </motion.div>
                      </motion.div>

                      {/* Content */}
                      <motion.div
                        className="text-center group-hover:transform group-hover:scale-105 transition-all duration-300"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1 + index * 0.1 }}>
                        <h4 className="text-lg font-bold text-brown-primary mb-1 group-hover:text-brown-accent transition-colors">{item.title}</h4>
                        <p className="text-sm text-brown-text/70 font-medium">{item.subtitle}</p>
                      </motion.div>

                      {/* Mobile connecting line */}
                      {index < 3 && (
                        <div className="md:hidden mt-6 mb-6">
                          <motion.div
                            className="w-1 h-8 bg-gradient-to-b from-brown-accent to-brown-primary rounded-full mx-auto"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ delay: 1.2 + index * 0.1, duration: 0.3 }}
                          />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Feature cards */}
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.3 }}>
            {[
              {
                icon: FileCheck,
                title: "Kepatuhan Keuangan",
                description: "Memenuhi semua persyaratan pelaporan keuangan untuk investasi swasta. Lacak margin keuntungan, arus kas, dan rasio keuangan yang diperlukan untuk menarik mitra ekuitas.",
              },
              {
                icon: Scale,
                title: "Dokumentasi Legal",
                description: "Pastikan semua persyaratan hukum terpenuhi termasuk tata kelola perusahaan, kepatuhan regulasi, dan dokumentasi untuk investasi swasta dan kemitraan ekuitas.",
              },
              {
                icon: Users,
                title: "Metrik Pertumbuhan",
                description: "Monitor indikator kinerja utama termasuk pertumbuhan pendapatan, pangsa pasar, dan efisiensi operasional untuk mendemonstrasikan skalabilitas bisnis.",
              },
            ].map((card, index) => (
              <motion.div
                key={index}
                className="bg-brown-bg-light rounded-xl shadow-lg border border-brown-bg p-8 hover:shadow-xl hover:border-brown-accent transition-all duration-200"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2 + index * 0.1 }}
                whileHover={{ y: -5 }}>
                <div className="h-14 w-14 bg-brown-accent-light rounded-xl flex items-center justify-center mb-6">
                  <card.icon className="text-brown-primary w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{card.title}</h3>
                <p className="text-gray-600 leading-relaxed">{card.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Homepage;
