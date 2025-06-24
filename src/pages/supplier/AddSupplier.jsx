import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function AddSupplier() {
    const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://didar.intelsofts.com/Laravel_React/B_POS/public/api/suppliers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const result = await res.json();
      if (res.ok) {
        alert('Supplier added successfully!');
        // Reset form
        setForm({ name: '', email: '', phone: '', address: '' });
        navigate('/pages/supplier/supplierlist');
      } else {
        alert(result.message || 'Error adding supplier.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to add supplier.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h4>Supplier Management</h4>
          <h6>Add/Update Supplier</h6>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="form-group">
                  <label>Supplier Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-lg-9 col-12">
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-lg-12">
                <button type="submit" className="btn btn-submit me-2">
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setForm({ name: '', email: '', phone: '', address: '' })
                  }
                  className="btn btn-cancel"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddSupplier;
