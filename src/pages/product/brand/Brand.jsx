import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

function Brand() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/brands`);
      const data = await res.json();
      setBrands(data.brands || []);
    } catch (err) {
      console.error('Fetch error:', err.message);
    }
  };

  const deleteBrand = async (id) => {
    try {
      const res = await fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/brands/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Delete failed');
      setBrands((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error('Delete error:', err.message);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      deleteBrand(id);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h4>Brand List</h4>
          <h6>Manage your Brand</h6>
        </div>
        <div className="page-btn">
          <NavLink to="/pages/product/brand/add" className="btn btn-added">
            <i className='bx bx-plus me-2'></i> Add Brand
          </NavLink>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {brands.length > 0 ? (
                  brands.map((brand) => (
                    <tr key={brand.id}>
                      <td>{brand.id}</td>
                      <td>
                        <img
                          src={`http://didar.intelsofts.com/Laravel_React/B_POS/public/img/brand/${brand.img}`}
                          alt={brand.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                      </td>
                      <td>{brand.name}</td>
                      <td>{brand.description}</td>
                      <td>
                        <NavLink to={`/pages/product/brand/edit/${brand.id}`} className="me-3">
                          <i className="bi bi-pencil-square" style={{ fontSize: '20px' }}></i>
                        </NavLink>
                        <button onClick={() => handleDelete(brand.id)} className="btn btn-link p-0">
                          <i className="bi bi-trash" style={{ fontSize: '20px', color: 'red' }}></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No brands found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Brand;
