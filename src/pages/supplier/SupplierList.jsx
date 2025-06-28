import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Load suppliers from API
  useEffect(() => {
    fetch('http://didar.intelsofts.com/Laravel_React/B_POS/public/api/suppliers')
      .then((res) => res.json())
      .then((data) => {
        setSuppliers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch Error:', err);
        setLoading(false);
      });
  }, []);

  // 🔻 Delete supplier
  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this supplier?');
    if (!confirm) return;

    try {
      const res = await fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/suppliers/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSuppliers(prev => prev.filter(s => s.id !== id));
        alert('Supplier deleted successfully.');
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete supplier.');
      }
    } catch (error) {
      console.error('Delete Error:', error);
      alert('An error occurred while deleting supplier.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h4>Supplier List</h4>
          <h6>Manage your Supplier</h6>
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
                    <th>Id</th>
                    <th>Supplier Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center">No suppliers found.</td>
                    </tr>
                  ) : (
                    suppliers.map((supplier) => (
                      <tr key={supplier.id}>
                        <td>
                          <label className="checkboxs">
                            <input type="checkbox" />
                            <span className="checkmarks"></span>
                          </label>
                        </td>
                        <td>{supplier.id}</td>
                        <td>{supplier.name}</td>
                        <td>{supplier.phone || '-'}</td>
                        <td>{supplier.email}</td>
                        <td>{supplier.address}</td>
                        <td>
                          <NavLink
                            className="me-3"
                            to={`/pages/supplier/supplierlist/edit/${supplier.id}`}
                          >
                            <i className="bi bi-pencil-square" style={{ fontSize: '20px' }}></i>
                          </NavLink>
                          <button
                            onClick={() => handleDelete(supplier.id)}
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

export default SupplierList;
