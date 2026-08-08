import React, { useState, useEffect } from "react";
import api from "../services/api";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

const EditCustomer = () => {
  const { id } = useParams<{ id: string }>();
  const [customerName, setCustomerName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [customerType, setCustomerType] = useState("RETAIL");
  const [address, setAddress] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [status, setStatus] = useState("LEAD");
  const [followUpDate, setFollowUpDate] = useState("");
  const [notes, setNotes] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await api.get(`/customers/${id}`);
        const c = response.data.data;
        setCustomerName(c.customerName || "");
        setBusinessName(c.businessName || "");
        setMobile(c.mobile || "");
        setEmail(c.email || "");
        setCustomerType(c.customerType || "RETAIL");
        setAddress(c.address || "");
        setGstNumber(c.gstNumber || "");
        setStatus(c.status || "LEAD");
        if (c.followUpDate) {
          setFollowUpDate(new Date(c.followUpDate).toISOString().split('T')[0]);
        }
        setNotes(c.notes || "");
      } catch (error) {
        console.error("Failed to load customer", error);
        alert("Failed to load customer details");
        navigate("/customers");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await api.put(`/customers/${id}`, {
        customerName,
        businessName,
        mobile,
        email,
        customerType,
        address,
        gstNumber,
        status,
        followUpDate: followUpDate || null,
        notes
      });
      navigate(`/customers/${id}`);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update customer");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '24px' }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
        <Link to={`/customers/${id}`} className="btn" style={{ background: "rgba(255,255,255,0.05)" }}>
          <ArrowLeft size={18} />
        </Link>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Edit Customer</h1>
      </div>

      <div className="glass-panel" style={{ padding: "32px", maxWidth: "600px" }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Customer Name *</label>
            <input 
              type="text" 
              className="form-input" 
              value={customerName} 
              onChange={(e) => setCustomerName(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Business Name</label>
            <input 
              type="text" 
              className="form-input" 
              value={businessName} 
              onChange={(e) => setBusinessName(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mobile Number *</label>
            <input 
              type="text" 
              className="form-input" 
              value={mobile} 
              onChange={(e) => setMobile(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Address</label>
            <input 
              type="text" 
              className="form-input" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">GST Number</label>
              <input 
                type="text" 
                className="form-input" 
                value={gstNumber} 
                onChange={(e) => setGstNumber(e.target.value)} 
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Follow-up Date</label>
              <input 
                type="date" 
                className="form-input" 
                value={followUpDate} 
                onChange={(e) => setFollowUpDate(e.target.value)} 
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Customer Type</label>
              <select 
                className="form-select" 
                value={customerType} 
                onChange={(e) => setCustomerType(e.target.value)}
              >
                <option value="RETAIL">Retail</option>
                <option value="WHOLESALE">Wholesale</option>
                <option value="DISTRIBUTOR">Distributor</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Status</label>
              <select 
                className="form-select" 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="LEAD">Lead</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea 
              className="form-input" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              rows={3}
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "16px" }} disabled={submitting}>
            {submitting ? "Saving..." : "Update Customer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCustomer;
