import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { TrendingUp, Building2, Target, CheckCircle, AlertTriangle, DollarSign, FileText, Users } from "lucide-react";

const DashboardPage: React.FC = () => {
  // Mock data - replace with actual API calls
  const investmentReadinessScore = 67; // percentage
  const monthlyRevenue = 1250000000; // IDR
  const profitMargin = 15.5; // percentage
  const complianceScore = 78; // percentage

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background: `
          linear-gradient(135deg, #602a1d 0%, #dbd7d2 20%, #f1edea 40%, #dbd7d2 60%, #602a1d 100%),
          radial-gradient(circle at 25% 25%, rgba(96, 42, 29, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(96, 42, 29, 0.2) 0%, transparent 50%),
          conic-gradient(from 90deg at 50% 50%, rgba(96, 42, 29, 0.1) 0%, transparent 25%, rgba(96, 42, 29, 0.1) 50%, transparent 75%)
        `,
      }}
    >
      {/* Animated Background Patterns */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Floating orbs */}
        <motion.div
          className="absolute w-48 h-48 rounded-full top-32 left-16 opacity-20 blur-3xl"
          style={{ backgroundColor: "#602a1d" }}
          animate={{
            y: [0, -30, 0],
            x: [0, 25, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute rounded-full top-60 right-24 w-36 h-36 opacity-15 blur-3xl"
          style={{ backgroundColor: "#602a1d" }}
          animate={{
            y: [0, 35, 0],
            x: [0, -15, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute w-40 h-40 rounded-full opacity-25 bottom-40 left-1/3 blur-3xl"
          style={{ backgroundColor: "#602a1d" }}
          animate={{
            y: [0, -25, 0],
            x: [0, 30, 0],
            scale: [1, 1.2, 1],
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
        className="absolute inset-0 opacity-10"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, #602a1d 2px, transparent 2px),
            radial-gradient(circle at 80% 70%, #602a1d 1.5px, transparent 1.5px)
          `,
          backgroundSize: "60px 60px, 40px 40px",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            className="p-4 mb-6 text-center border shadow-lg rounded-xl backdrop-blur-sm"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              borderColor: "rgba(239, 68, 68, 0.3)",
              boxShadow: "0 10px 40px rgba(239, 68, 68, 0.1)",
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-sm font-medium" style={{ color: "#dc2626" }}>
              Halaman dashboard ini <b className="font-extrabold">coming soon</b> dengan sistem transaksi melalui
              xendit, midtrans atau semacamnya
            </p>
          </motion.div>

          {/* Investment Readiness Header */}
          <motion.div
            className="p-8 mb-8 text-white border shadow-2xl rounded-2xl backdrop-blur-sm"
            style={{
              background: "linear-gradient(135deg, #602a1d 0%, rgba(96, 42, 29, 0.9) 100%)",
              borderColor: "rgba(255, 255, 255, 0.2)",
              boxShadow: "0 25px 80px rgba(96, 42, 29, 0.3)",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold">Dasbor Kesiapan Investasi SINAR</h1>
                <p className="text-white/80">Lacak perjalanan Anda dari UMKM ke bisnis siap investasi dengan SINAR</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">{investmentReadinessScore}%</div>
                <div className="text-sm text-white/70">Siap Investasi</div>
              </div>
            </div>
          </motion.div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Pendapatan Bulanan",
                value: `IDR ${(monthlyRevenue / 1000000000).toFixed(1)}M`,
                change: "+12.5% dari bulan lalu",
                icon: DollarSign,
                color: "#602a1d",
                bgColor: "rgba(96, 42, 29, 0.1)",
                delay: 0.1,
              },
              {
                title: "Margin Keuntungan",
                value: `${profitMargin}%`,
                change: "Target: 20% untuk IPO",
                icon: TrendingUp,
                color: "#602a1d",
                bgColor: "rgba(96, 42, 29, 0.1)",
                delay: 0.15,
              },
              {
                title: "Skor Kepatuhan",
                value: `${complianceScore}%`,
                change: "Butuh 95% untuk listing",
                icon: FileText,
                color: "#602a1d",
                bgColor: "rgba(96, 42, 29, 0.1)",
                delay: 0.2,
              },
              {
                title: "Tahap Bisnis",
                value: "Berkembang",
                change: "Fase pertumbuhan",
                icon: Users,
                color: "#f97316",
                bgColor: "rgba(249, 115, 22, 0.1)",
                delay: 0.25,
              },
            ].map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={index}
                  className="p-6 border shadow-lg rounded-xl backdrop-blur-sm"
                  style={{
                    backgroundColor: "rgba(241, 237, 234, 0.8)",
                    borderColor: "rgba(96, 42, 29, 0.2)",
                    boxShadow: "0 10px 40px rgba(96, 42, 29, 0.1)",
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: metric.delay }}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 20px 60px rgba(96, 42, 29, 0.2)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium" style={{ color: "rgba(96, 42, 29, 0.7)" }}>
                        {metric.title}
                      </p>
                      <p className="text-2xl font-bold" style={{ color: "#602a1d" }}>
                        {metric.value}
                      </p>
                      <p className="flex items-center mt-1 text-xs" style={{ color: metric.color }}>
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {metric.change}
                      </p>
                    </div>
                    <div
                      className="flex items-center justify-center w-12 h-12 rounded-lg"
                      style={{ backgroundColor: metric.bgColor }}
                    >
                      <Icon className="w-6 h-6" style={{ color: metric.color }} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Investment Requirements Progress */}
          <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
            <motion.div
              className="p-6 border shadow-lg rounded-xl backdrop-blur-sm"
              style={{
                backgroundColor: "rgba(241, 237, 234, 0.8)",
                borderColor: "rgba(96, 42, 29, 0.2)",
                boxShadow: "0 15px 50px rgba(96, 42, 29, 0.1)",
              }}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h3 className="mb-6 text-lg font-semibold" style={{ color: "#602a1d" }}>
                Daftar Periksa Kesiapan Investasi
              </h3>
              <div className="space-y-4">
                {[
                  { item: "Audit Keuangan (2 tahun)", completed: true, critical: true },
                  { item: "Kepatuhan Hukum", completed: true, critical: true },
                  { item: "Tata Kelola Perusahaan", completed: false, critical: true },
                  { item: "Profitabilitas Konsisten", completed: false, critical: true },
                  { item: "Penilaian Bisnis", completed: false, critical: false },
                  { item: "Dokumentasi Strategi Pertumbuhan", completed: false, critical: false },
                ].map((req, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="flex items-center justify-center w-5 h-5 rounded-full"
                        style={{
                          backgroundColor: req.completed ? "rgba(96, 42, 29, 0.2)" : "rgba(156, 163, 175, 0.2)",
                        }}
                      >
                        {req.completed && <CheckCircle className="w-3 h-3" style={{ color: "#602a1d" }} />}
                      </div>
                      <span className="text-sm" style={{ color: req.completed ? "#602a1d" : "rgba(96, 42, 29, 0.6)" }}>
                        {req.item}
                      </span>
                    </div>
                    {req.critical && (
                      <span className="px-2 py-1 text-xs text-red-800 bg-red-100 rounded">Critical</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="p-6 border shadow-lg rounded-xl backdrop-blur-sm"
              style={{
                backgroundColor: "rgba(241, 237, 234, 0.8)",
                borderColor: "rgba(96, 42, 29, 0.2)",
                boxShadow: "0 15px 50px rgba(96, 42, 29, 0.1)",
              }}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              <h3 className="mb-6 text-lg font-semibold" style={{ color: "#602a1d" }}>
                Aksi Cepat
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { to: "/business", icon: Building2, label: "Kelola Bisnis", bg: "#602a1d" },
                  { to: null, icon: FileText, label: "Buat Laporan", bg: "#602a1d" },
                  { to: null, icon: Target, label: "Tetapkan Target", bg: "#602a1d" },
                  { to: "/investments", icon: DollarSign, label: "Investasi", bg: "#602a1d" },
                ].map((action, index) => {
                  const Icon = action.icon;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.45 + index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {action.to ? (
                        <Link
                          to={action.to}
                          className="block w-full p-4 text-center text-white transition-all duration-200 rounded-lg shadow-lg"
                          style={{
                            backgroundColor: action.bg,
                            boxShadow: "0 8px 32px rgba(96, 42, 29, 0.3)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = "0 12px 40px rgba(96, 42, 29, 0.4)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = "0 8px 32px rgba(96, 42, 29, 0.3)";
                          }}
                        >
                          <Icon className="w-6 h-6 mx-auto mb-2" />
                          <span className="text-sm font-medium">{action.label}</span>
                        </Link>
                      ) : (
                        <button
                          className="block w-full p-4 text-center text-white transition-all duration-200 rounded-lg shadow-lg"
                          style={{
                            backgroundColor: action.bg,
                            boxShadow: "0 8px 32px rgba(96, 42, 29, 0.3)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = "0 12px 40px rgba(96, 42, 29, 0.4)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = "0 8px 32px rgba(96, 42, 29, 0.3)";
                          }}
                        >
                          <Icon className="w-6 h-6 mx-auto mb-2" />
                          <span className="text-sm font-medium">{action.label}</span>
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Growth Recommendations */}
          <motion.div
            className="p-6 border shadow-lg rounded-xl backdrop-blur-sm"
            style={{
              backgroundColor: "rgba(241, 237, 234, 0.8)",
              borderColor: "rgba(96, 42, 29, 0.2)",
              boxShadow: "0 15px 50px rgba(96, 42, 29, 0.1)",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <h3 className="mb-6 text-lg font-semibold" style={{ color: "#602a1d" }}>
              Investment Readiness Recommendations
            </h3>
            <div className="space-y-4">
              <motion.div
                className="flex items-start p-4 space-x-4 border rounded-lg backdrop-blur-sm"
                style={{
                  backgroundColor: "rgba(251, 191, 36, 0.1)",
                  borderColor: "rgba(251, 191, 36, 0.3)",
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium" style={{ color: "#602a1d" }}>
                    Improve Profit Margin
                  </h4>
                  <p className="mt-1 text-sm" style={{ color: "rgba(96, 42, 29, 0.7)" }}>
                    Your current profit margin of {profitMargin}% needs to reach 20% to attract private investors.
                    Consider optimizing operational costs and increasing revenue streams.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start p-4 space-x-4 border rounded-lg backdrop-blur-sm"
                style={{
                  backgroundColor: "rgba(96, 42, 29, 0.1)",
                  borderColor: "rgba(96, 42, 29, 0.3)",
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
              >
                <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: "#602a1d" }} />
                <div>
                  <h4 className="font-medium" style={{ color: "#602a1d" }}>
                    Complete Corporate Governance
                  </h4>
                  <p className="mt-1 text-sm" style={{ color: "rgba(96, 42, 29, 0.7)" }}>
                    Establish board of directors, audit committee, and implement proper internal controls to meet
                    private equity investment requirements.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
