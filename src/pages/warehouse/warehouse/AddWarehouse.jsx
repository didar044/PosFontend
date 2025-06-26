import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddWarehouse() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    location: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert('Warehouse name is required');
      return;
    }

    setSubmitting(true);

    fetch('http://didar.intelsofts.com/Laravel_React/B_POS/public/api/warehouses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })
      .then(res => {
        setSubmitting(false);
        if (!res.ok) throw new Error('Failed to add warehouse');
        alert('Warehouse added successfully!');
        navigate(-1); // go back after adding
      })
      .catch(err => {
        setSubmitting(false);
        console.error(err);
        alert('Error adding warehouse');
      });
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h4>Warehouse Management</h4>
          <h6>Add Warehouse</h6>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-6 col-sm-12 col-12">
                <div className="form-group">
                  <label>Warehouse Name <span style={{color:'red'}}>*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    placeholder="Enter warehouse name"
                  />
                </div>
              </div>

              <div className="col-lg-6 col-sm-12 col-12">
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    disabled={submitting}
                    placeholder="Enter location (optional)"
                  />
                </div>
              </div>

              <div className="col-lg-12">
                <button
                  type="submit"
                  className="btn btn-submit me-2"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ name: '', location: '' })}
                  className="btn btn-cancel"
                  disabled={submitting}
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

export default AddWarehouse;
