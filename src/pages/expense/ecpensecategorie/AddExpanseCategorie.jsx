import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function AddExpanseCategorie() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: name,
      description: description,
    };

    try {
      const res = await fetch('http://didar.intelsofts.com/Laravel_React/B_POS/public/api/expensecategories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        navigate('/pages/expansecategorie/expansecategorielist'); // redirect after success
      } else {
        console.error('Failed to add category');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h4>Add Expense Category</h4>
          <h6>Create new expense category</h6>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="col-lg-12">
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="col-lg-12">
                <button type="submit" className="btn btn-submit me-2">
                  Submit
                </button>
                <NavLink to="/pages/expansecategorie/expansecategorielist" className="btn btn-cancel">
                  Cancel
                </NavLink>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddExpanseCategorie;
