import React, { useState } from 'react';

function AddCustomer() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://didar.intelsofts.com/Laravel_React/B_POS/public/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert('Customer added successfully!');
        setFormData({
          name: '',
          phone: '',
          email: '',
          address: '',
          description: '',
        });
      } else {
        alert('Failed to add customer.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h4>Customer Management</h4>
          <h6>Add/Update Customer</h6>
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

              {/* Avatar upload UI placeholder - not in API schema */}
              

              <div className="col-lg-12">
                <button type="submit" className="btn btn-submit me-2">Submit</button>
                <button type="reset" className="btn btn-cancel">Cancel</button>
              </div>

            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddCustomer;
