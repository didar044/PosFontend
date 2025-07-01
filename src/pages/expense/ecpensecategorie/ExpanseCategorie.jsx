import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

function ExpanseCategorie() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('http://didar.intelsofts.com/Laravel_React/B_POS/public/api/expensecategories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Failed to fetch categories:', err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/expensecategories/${id}`, {
        method: 'DELETE',
      });

      setCategories(categories.filter(category => category.id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h4>Expense Category List</h4>
          <h6>Manage your Expense Categories</h6>
        </div>
        <div className="page-btn">
          <NavLink to="/pages/expansecategorie/expansecategorielist/add" className="btn btn-added">
            <i className='bx bx-plus me-2'></i> Add Category
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
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <tr key={cat.id}>
                      <td>{cat.id}</td>
                      <td>{cat.name}</td>
                      <td>{cat.description || 'No Description'}</td>
                      <td>
                        <NavLink to={`/pages/expansecategorie/expansecategorielist/edit/${cat.id}`} className="me-3">
                          <i className="bi bi-pencil-square" style={{ fontSize: '20px' }}></i>
                        </NavLink>
                        <button onClick={() => handleDelete(cat.id)} className="btn btn-link p-0">
                          <i className="bi bi-trash" style={{ fontSize: '20px', color: 'red' }}></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr style={{textAlign:'center'}}>
                    <td colSpan="4"><h3> No categories found.</h3></td>
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

export default ExpanseCategorie;
