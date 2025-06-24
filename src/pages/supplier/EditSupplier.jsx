import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditSupplier() {
  const { id } = useParams(); // supplier ID from URL
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    // Load supplier data
    fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/suppliers/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
        });
      })
      .catch(err => {
        console.error('Error fetching supplier:', err);
        alert('Failed to load supplier data');
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/suppliers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert('Supplier updated successfully!');
        navigate('/pages/supplier/supplierlist'); // Change this route if needed
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to update supplier.');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Error updating supplier.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h4>Supplier Management</h4>
          <h6>Edit/Update Supplier</h6>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="form-group">
                  <label>Supplier Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} />
                </div>
              </div>
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} />
                </div>
              </div>
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="form-group">
                  <label>Phone</label>
                  <input type="text" name="phone" value={form.phone} onChange={handleChange} />
                </div>
              </div>
              <div className="col-lg-9 col-12">
                <div className="form-group">
                  <label>Address</label>
                  <input type="text" name="address" value={form.address} onChange={handleChange} />
                </div>
              </div>
              <div className="col-lg-12">
                <button type="submit" className="btn btn-submit me-2">Update</button>
                <button type="button" onClick={() => navigate(-1)} className="btn btn-cancel">Cancel</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditSupplier;
