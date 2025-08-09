import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router";
import { BusinessService, type Business } from "../../services/businessService";

interface ProjectionData {
  year: number;
  revenue: number;
  expenses: number;
  netIncome: number;
  cashFlow: number;
}

const ProjectionsPage: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projections, setProjections] = useState<ProjectionData[]>([
    { year: new Date().getFullYear() + 1, revenue: 0, expenses: 0, netIncome: 0, cashFlow: 0 },
    { year: new Date().getFullYear() + 2, revenue: 0, expenses: 0, netIncome: 0, cashFlow: 0 },
    { year: new Date().getFullYear() + 3, revenue: 0, expenses: 0, netIncome: 0, cashFlow: 0 },
    { year: new Date().getFullYear() + 4, revenue: 0, expenses: 0, netIncome: 0, cashFlow: 0 },
    { year: new Date().getFullYear() + 5, revenue: 0, expenses: 0, netIncome: 0, cashFlow: 0 },
  ]);

  const fetchAll = useCallback(
    async (isRefresh = false) => {
      try {
        setLoading(true);
        setError(null);

        const bizPromise = BusinessService.getBusinessById(parseInt(businessId!));
        const projPromise = BusinessService.getBusinessProjections(parseInt(businessId!), isRefresh);

        const [biz, projResp] = await Promise.all([bizPromise, projPromise]);

        setBusiness(biz);

        if (projResp && projResp.projections && projResp.projections.length > 0) {
          setProjections(
            projResp.projections.map((p) => ({
              year: p.year,
              revenue: p.revenue,
              expenses: p.expenses,
              netIncome: p.netIncome,
              cashFlow: p.cashFlow,
            }))
          );
        }
      } catch (err: unknown) {
        console.error("Gagal memuat proyeksi atau bisnis:", err);
        setError(err instanceof Error ? err.message : "Gagal memuat proyeksi");
      } finally {
        setLoading(false);
      }
    },
    [businessId]
  );

  useEffect(() => {
    if (businessId) fetchAll();
  }, [businessId, fetchAll]);

  const handleProjectionChange = (index: number, field: keyof ProjectionData, value: string) => {
    const updatedProjections = [...projections];
    const numValue = parseFloat(value) || 0;

    updatedProjections[index] = {
      ...updatedProjections[index],
      [field]: numValue,
    };

    // Auto-calculate net income and cash flow
    if (field === "revenue" || field === "expenses") {
      const revenue = field === "revenue" ? numValue : updatedProjections[index].revenue;
      const expenses = field === "expenses" ? numValue : updatedProjections[index].expenses;

      updatedProjections[index].netIncome = revenue - expenses;
      updatedProjections[index].cashFlow = revenue - expenses; // Simplified cash flow calculation
    }

    setProjections(updatedProjections);
  };

  const calculateGrowthRate = (current: number, previous: number): string => {
    if (previous === 0) return "T/A";
    const growth = ((current - previous) / previous) * 100;
    return `${growth >= 0 ? "+" : ""}${growth.toFixed(1)}%`;
  };

  const getTotalProjectedRevenue = (): number => {
    return projections.reduce((total, proj) => total + proj.revenue, 0);
  };

  const getAverageGrowthRate = (): string => {
    const revenues = projections.map((p) => p.revenue).filter((r) => r > 0);
    if (revenues.length < 2) return "T/A";

    let totalGrowth = 0;
    let validGrowths = 0;

    for (let i = 1; i < revenues.length; i++) {
      if (revenues[i - 1] > 0) {
        totalGrowth += ((revenues[i] - revenues[i - 1]) / revenues[i - 1]) * 100;
        validGrowths++;
      }
    }

    if (validGrowths === 0) return "T/A";
    return `${(totalGrowth / validGrowths).toFixed(1)}%`;
  };

  const getTotalGrowthRate = (): string => {
    if (projections.length === 0 || projections[0].revenue === 0 || projections[projections.length - 1].revenue === 0) {
      return "0%";
    }
    const growthRate = (projections[projections.length - 1].revenue / projections[0].revenue - 1) * 100;
    return `${growthRate.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brown-bg to-white">
        <div className="max-w-6xl mx-auto py-12 px-4">
          <div className="text-center">Memuat proyeksi...</div>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brown-bg to-white">
        <div className="max-w-6xl mx-auto py-12 px-4">
          <div className="text-center text-red-600">{error || "Bisnis tidak ditemukan"}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brown-bg to-white">
      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Proyeksi Investasi</h1>
            <p className="text-gray-600">Proyeksi keuangan 5 tahun untuk {business.name}</p>
          </div>
          <div className="flex space-x-4">
            <button onClick={() => fetchAll(true)} className="bg-brown-bg hover:bg-brown-accent-light text-brown-primary px-2 py-2 rounded-lg">
              Segarkan
            </button>
            <Link to={`/business/${businessId}/details`} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">
              Kembali ke Bisnis
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Pendapatan Diproyeksikan</h3>
              <p className="text-2xl font-bold text-green-600">Rp{getTotalProjectedRevenue().toLocaleString()}</p>
              <p className="text-sm text-gray-500">Total 5 tahun</p>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-brown-bg rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-brown-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Rata-rata Tingkat Pertumbuhan</h3>
              <p className="text-2xl font-bold text-brown-primary">{getAverageGrowthRate()}</p>
              <p className="text-sm text-gray-500">Tahun ke tahun</p>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-brown-accent-light rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-brown-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tahun Break-Even</h3>
              <p className="text-2xl font-bold text-brown-accent">{projections.find((p) => p.netIncome > 0)?.year || "T/A"}</p>
              <p className="text-sm text-gray-500">Tahun pertama profit</p>
            </div>
          </div>
        </div>

        {/* Projections Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Proyeksi Keuangan 5 Tahun</h2>
            <p className="text-sm text-gray-600 mt-1">Masukkan data keuangan proyeksi Anda untuk 5 tahun ke depan</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pendapatan (Rp)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pengeluaran (Rp)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pendapatan Bersih (Rp)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arus Kas (Rp)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tingkat Pertumbuhan</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projections.map((projection, index) => (
                  <tr key={projection.year} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{projection.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        step="0.01"
                        value={projection.revenue || ""}
                        onChange={(e) => handleProjectionChange(index, "revenue", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-primary focus:border-transparent"
                        placeholder="0"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        step="0.01"
                        value={projection.expenses || ""}
                        onChange={(e) => handleProjectionChange(index, "expenses", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-primary focus:border-transparent"
                        placeholder="0"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`px-3 py-2 rounded-md text-sm font-medium ${projection.netIncome >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        Rp{projection.netIncome.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`px-3 py-2 rounded-md text-sm font-medium ${projection.cashFlow >= 0 ? "bg-brown-bg text-brown-primary" : "bg-red-100 text-red-800"}`}>
                        Rp{projection.cashFlow.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index > 0 ? calculateGrowthRate(projection.revenue, projections[index - 1].revenue) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Investment Metrics */}
        <div className="bg-white shadow rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Metrik Investasi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">Rp{projections.reduce((sum, p) => sum + p.netIncome, 0).toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Pendapatan Bersih (5 Tahun)</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">Rp{projections.reduce((sum, p) => sum + p.cashFlow, 0).toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Arus Kas (5 Tahun)</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{projections.filter((p) => p.netIncome > 0).length}/5</div>
              <div className="text-sm text-gray-600">Tahun Profit</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{getTotalGrowthRate()}</div>
              <div className="text-sm text-gray-600">Total Pertumbuhan (5 Tahun)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectionsPage;
