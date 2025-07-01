import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    description: '',
  });

  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState({ visible: false, message: '', type: '' });

  // Fetch existing customer data
  useEffect(() => {
    fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/customers/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Customer not found');
        return res.json();
      })
      .then((data) => {
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          description: data.description || '',
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setShowToast({ visible: true, message: 'Failed to load customer data.', type: 'error' });
        setLoading(false);
      });
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Show toast notification helper
  const showNotification = (message, type = 'success') => {
    setShowToast({ visible: true, message, type });
    setTimeout(() => {
      setShowToast({ visible: false, message: '', type: '' });
      if (type === 'success') navigate('/pages/customer/customerlist');
    }, 2500);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/customers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to update customer');

      showNotification('Customer updated successfully!', 'success');
    } catch (err) {
      console.error('Update error:', err);
      showNotification('Something went wrong while updating', 'error');
    }
  };

  if (loading) return <p>Loading customer data...</p>;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h4>Customer Management</h4>
          <h6>Edit / Update Customer</h6>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="form-group">
                  <label>Customer Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
              </div>

              <div className="col-lg-3 col-sm-6 col-12">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
              </div>

              <div className="col-lg-3 col-sm-6 col-12">
                <div className="form-group">
                  <label>Phone</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                </div>
              </div>

              <div className="col-lg-9 col-12">
                <div className="form-group">
                  <label>Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} />
                </div>
              </div>

              <div className="col-lg-12">
                <div className="form-group">
                  <label>Description</label>
                  <textarea className="form-control" name="description" value={formData.description} onChange={handleChange}></textarea>
                </div>
              </div>

              <div className="col-lg-12">
                <button type="submit" className="btn btn-submit me-2">Update</button>
                <button type="button" className="btn btn-cancel" onClick={() => navigate(-1)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Toast notification */}
      {showToast.visible && (
        <div className={`custom-toast ${showToast.type}`}>
          {showToast.message}
        </div>
      )}

      {/* Inline CSS for toast */}
      <style>{`
        .custom-toast {
          position: fixed;
          top: 20px;
          right: 20px;
          background-color: #28a745;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: bold;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          z-index: 9999;
          animation: slideIn 0.3s ease, fadeOut 0.5s ease 2s forwards;
        }
        .custom-toast.error {
          background-color: #dc3545;
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes fadeOut {
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default EditCustomer;
