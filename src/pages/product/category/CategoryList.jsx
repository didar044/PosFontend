import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://didar.intelsofts.com/Laravel_React/B_POS/public/api/caregoties')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        setLoading(false);
      });
  }, []);

  // 🧹 Delete function
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      const res = await fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/caregoties/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Remove from UI
        setCategories(categories.filter((cat) => cat.id !== id));
        alert('Category deleted successfully.');
      } else {
        const result = await res.json();
        alert(result.message || 'Failed to delete category.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Delete failed.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h4>Product Category list</h4>
          <h6>View/Search product Category</h6>
        </div>
        <div className="page-btn">
          <NavLink to="/pages/product/categorielist/add" className="btn btn-added">
            <i className='bx bx-plus me-2'></i>
            Add Category
          </NavLink>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            {loading ? (
              <div>Loading categories...</div>
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
                    <th>Category name</th>
                    <th>Brand ID</th>
                    <th>Description</th>
                    <th>Photo</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center">No categories found.</td>
                    </tr>
                  ) : (
                    categories.map((cat) => (
                      <tr key={cat.id}>
                        <td>
                          <label className="checkboxs">
                            <input type="checkbox" />
                            <span className="checkmarks"></span>
                          </label>
                        </td>
                        <td>{cat.name}</td>
                        <td>{cat.brand?.name || 'No Brand'}</td>
                        <td>{cat.description}</td>
                        <td>
                          <img
                            src={
                              cat.img
                                ? `http://didar.intelsofts.com/Laravel_React/B_POS/public/img/categorie/${cat.img}`
                                : 'assets/img/product/noimage.png'
                            }
                            alt="category"
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                        </td>
                        <td>
                          <NavLink className="me-3" to={`/pages/product/categorielist/edit/${cat.id}`}>
                            <i className="bi bi-pencil-square" style={{ fontSize: '20px' }}></i>
                          </NavLink>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="btn btn-link p-0"
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

export default CategoryList;
