import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Users, Package, AlertTriangle, FileText, CheckCircle, Clock } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/dashboard/stats");
        setStats(response.data.data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="loading-state">Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 className="page-title">Dashboard Overview</h1>
      
      <div className="metric-grid">
        <div className="metric-card glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="metric-title">Total Customers</div>
              <div className="metric-value">{stats?.totalCustomers || 0}</div>
            </div>
            <div style={{ padding: '12px', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '12px', color: 'var(--primary-color)' }}>
              <Users size={24} />
            </div>
          </div>
        </div>
        
        <div className="metric-card glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="metric-title">Total Products</div>
              <div className="metric-value">{stats?.totalProducts || 0}</div>
            </div>
            <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--secondary-color)' }}>
              <Package size={24} />
            </div>
          </div>
        </div>

        <div className="metric-card glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="metric-title">Total Stock Units</div>
              <div className="metric-value">{stats?.totalStock || 0}</div>
            </div>
            <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: '#3b82f6' }}>
              <Package size={24} />
            </div>
          </div>
        </div>

        <div className="metric-card glass-panel" style={{ borderLeft: stats?.lowStockProducts > 0 ? '4px solid var(--danger-color)' : '' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="metric-title">Low Stock Alerts</div>
              <div className="metric-value" style={{ color: stats?.lowStockProducts > 0 ? 'var(--danger-color)' : '' }}>
                {stats?.lowStockProducts || 0}
              </div>
            </div>
            <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: 'var(--danger-color)' }}>
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>

        <div className="metric-card glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="metric-title">Confirmed Challans</div>
              <div className="metric-value">{stats?.confirmedChallans || 0}</div>
            </div>
            <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--secondary-color)' }}>
              <CheckCircle size={24} />
            </div>
          </div>
        </div>

        <div className="metric-card glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="metric-title">Draft Challans</div>
              <div className="metric-value">{stats?.draftChallans || 0}</div>
            </div>
            <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', color: 'var(--warning-color)' }}>
              <Clock size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <FileText size={20} color="var(--primary-color)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Recent Sales Challans</h2>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Challan No</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentChallans?.length > 0 ? (
                stats.recentChallans.map((challan: any) => (
                  <tr key={challan.id}>
                    <td style={{ fontWeight: 500 }}>{challan.challanNumber}</td>
                    <td>{challan.customer?.customerName}</td>
                    <td>
                      <span className={`status-badge status-${challan.status.toLowerCase()}`}>
                        {challan.status}
                      </span>
                    </td>
                    <td>{new Date(challan.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)" }}>
                    No recent challans found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
