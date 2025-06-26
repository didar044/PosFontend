import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

function WarehouseList() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch warehouse data from API
  useEffect(() => {
    fetch('http://didar.intelsofts.com/Laravel_React/B_POS/public/api/warehouses')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch warehouses');
        return res.json();
      })
      .then(data => {
        setWarehouses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    // For now just a confirmation and removing locally
    if (window.confirm('Are you sure you want to delete this warehouse?')) {
      fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/warehouses/${id}`, {
        method: 'DELETE',
      })
        .then(res => {
          if (!res.ok) throw new Error('Delete failed');
          // Remove from UI list
          setWarehouses(warehouses.filter(w => w.id !== id));
        })
        .catch(err => {
          console.error(err);
          alert('Failed to delete warehouse');
        });
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h4>Warehouse List</h4>
          <h6>Manage your Warehouses</h6>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <table className="table datanew">
                <thead>
                  <tr>
                    <th>
                      <label className="checkboxs">
                        <input type="checkbox" id="select-all" />
                        <span className="checkmarks"></span>
                      </label>
                    </th>
                    <th>Warehouse Name</th>
                    <th>Location</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {warehouses.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center">No warehouses found.</td>
                    </tr>
                  ) : (
                    warehouses.map((warehouse) => (
                      <tr key={warehouse.id}>
                        <td>
                          <label className="checkboxs">
                            <input type="checkbox" />
                            <span className="checkmarks"></span>
                          </label>
                        </td>
                        <td>{warehouse.name}</td>
                        <td>{warehouse.location || '-'}</td>
                        <td>
                          <NavLink
                            className="me-3"
                            to={`/pages/warehouse/warehouselist/edit/${warehouse.id}`}
                          >
                            <i className="bi bi-pencil-square" style={{ fontSize: '20px' }}></i>
                          </NavLink>
                          <button
                            onClick={() => handleDelete(warehouse.id)}
                            className="btn p-0 border-0 bg-transparent"
                          >
                            <i
                              className="bi bi-trash"
                              style={{ fontSize: '20px', color: 'red' }}
                            ></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WarehouseList;
