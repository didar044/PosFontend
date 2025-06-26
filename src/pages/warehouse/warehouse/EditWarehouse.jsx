import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditWarehouse() {
  const { id } = useParams(); // get warehouse id from url
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    location: '',
  });

  const [loading, setLoading] = useState(true);

  // Fetch warehouse data on mount
  useEffect(() => {
    fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/warehouses/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch warehouse');
        return res.json();
      })
      .then(data => {
        setForm({
          name: data.name || '',
          location: data.location || '',
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        alert('Failed to load warehouse data');
      });
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submit to update warehouse
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/warehouses/${id}`, {
      method: 'PUT', // or PATCH depending on your API
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update warehouse');
        alert('Warehouse updated successfully!');
        navigate(-1); // go back
      })
      .catch(err => {
        console.error(err);
        alert('Error updating warehouse');
      });
  };

  if (loading) {
    return <div>Loading warehouse data...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h4>Warehouse Management</h4>
          <h6>Edit/Update Warehouse</h6>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-6 col-sm-12 col-12">
                <div className="form-group">
                  <label>Warehouse Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
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
                  />
                </div>
              </div>

              <div className="col-lg-12">
                <button type="submit" className="btn btn-submit me-2">Update</button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
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

export default EditWarehouse;
