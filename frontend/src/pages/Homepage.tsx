import React from "react";
import { Link } from "react-router";
import { TrendingUp, Building2, Trophy, CheckCircle, Banknote, FileCheck, Scale, Users } from "lucide-react";
import Navbar from "../components/Navbar";

const Homepage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto py-16 sm:px-6 lg:px-8">
        <div className="px-4 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full mb-6">
            <Trophy className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Dari UMKM ke Siap Investasi</span>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Kembangkan <span className="text-emerald-600">UMKM</span> Anda Menuju
            <br />
            <span className="text-blue-600">Siap Investasi</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Transformasikan usaha kecil Anda menjadi perusahaan yang siap menerima investasi. Platform bertenaga AI SINAR memandu Anda melalui kepatuhan finansial, persyaratan legal, dan metrik
            pertumbuhan yang diperlukan untuk menarik investor swasta dan mitra ekuitas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/business" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center">
              <Building2 className="w-5 h-5 mr-2" />
              Mulai Perjalanan Pertumbuhan
            </Link>
            <Link
              to="/investments"
              className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center">
              <Banknote className="w-5 h-5 mr-2" />
              Temukan Peluang Investasi
            </Link>
          </div>

          {/* Growth Path Visualization */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Jalur Menuju Investasi Swasta</h3>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-8">
              {[
                { step: "1", title: "UMKM", subtitle: "Usaha Kecil", icon: Building2, color: "bg-red-100 text-red-600" },
                { step: "2", title: "Kepatuhan", subtitle: "Legal & Keuangan", icon: CheckCircle, color: "bg-yellow-100 text-yellow-600" },
                { step: "3", title: "Pertumbuhan", subtitle: "Skalasi Operasi", icon: TrendingUp, color: "bg-blue-100 text-blue-600" },
                { step: "4", title: "Siap Investasi", subtitle: "Ekuitas Swasta", icon: Trophy, color: "bg-emerald-100 text-emerald-600" },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center relative">
                  <div className={`${item.color} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.subtitle}</p>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-8 left-full w-8">
                      <div className="w-full h-0.5 bg-gray-300"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg border border-emerald-100 p-8 hover:shadow-xl transition-shadow duration-200">
            <div className="h-14 w-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
              <FileCheck className="text-emerald-600 w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Kepatuhan Keuangan</h3>
            <p className="text-gray-600 leading-relaxed">
              Memenuhi semua persyaratan pelaporan keuangan untuk investasi swasta. Lacak margin keuntungan, arus kas, dan rasio keuangan yang diperlukan untuk menarik mitra ekuitas.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-8 hover:shadow-xl transition-shadow duration-200">
            <div className="h-14 w-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Scale className="text-blue-600 w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Dokumentasi Legal</h3>
            <p className="text-gray-600 leading-relaxed">
              Pastikan semua persyaratan hukum terpenuhi termasuk tata kelola perusahaan, kepatuhan regulasi, dan dokumentasi untuk investasi swasta dan kemitraan ekuitas.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-8 hover:shadow-xl transition-shadow duration-200">
            <div className="h-14 w-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <Users className="text-purple-600 w-7 h-7" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Metrik Pertumbuhan</h3>
            <p className="text-gray-600 leading-relaxed">
              Monitor indikator kinerja utama termasuk pertumbuhan pendapatan, pangsa pasar, dan efisiensi operasional untuk mendemonstrasikan skalabilitas bisnis.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Homepage;
