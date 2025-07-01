import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

function ProductList() {
  const [productsData, setProductsData] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/products?page=${page}`);
      const json = await res.json();
      setProductsData(json);
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Failed to load products');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/products/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchProducts(productsData.current_page);
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete product');
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= productsData.last_page) {
      fetchProducts(page);
    }
  };

  return (
    <div>
          <div className="page-header">
            <div className="page-title">
              <h4>Product List</h4>
              <h6>Manage your products</h6>
            </div>
          </div>

  
<div className="card">
<div className="card-body">
      <div className="table-responsive">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Id</th>
                <th>Product Name</th>
                <th>Brand</th>
                <th>Category</th>
                {/* <th>Supplier</th> */}
                <th>SKU</th>
                
                <th>Price</th>
                <th>Qty</th>
                <th>Description</th>
                <th>Image</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {productsData.data.length === 0 ? (
                <tr>
                  <td colSpan="12" style={{ textAlign: 'center' }}>No products found.</td>
                </tr>
              ) : (
                productsData.data.map((product) => (
                  <tr key={product.id}>
                    <td><input type="checkbox" /></td>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.brand?.name || '-'}</td>
                    <td>{product.categorie?.name || '-'}</td>
                    {/* <td>{product.supplier?.name || '-'}</td> */}
                    <td>{product.barcode || '-'}</td>
                    
                    <td>{product.price}</td>
                    <td>{product.quantity}</td>
                    <td>{product.description?.substring(0, 30) || '-'}</td>
                    <td>
                      {product.img ? (
                        <img
                          src={`http://didar.intelsofts.com/Laravel_React/B_POS/public/img/product/${product.img}`}
                          alt={product.name}
                          style={{ width: 50, height: 50, objectFit: 'cover' }}
                        />
                      ) : '-'}
                    </td>
                    <td> 
                        <div className="d-flex align-items-center gap-2">
                        
                          <NavLink to={`/pages/product/productlist/edit/${product.id}`} title="Edit">
                            <i className="bi bi-pencil-square" style={{ fontSize: 20 }}></i>
                          </NavLink>

                          
                          <NavLink to={`/pages/product/productlist/show/${product.id}`} title="View">
                            <i className="bi bi-eye" style={{ fontSize: 20 }}></i>
                          </NavLink>


                          <button
                            onClick={() => handleDelete(product.id)}
                            className="btn border-0 bg-transparent"
                            title="Delete"
                          >
                            <i className="bi bi-trash" style={{ fontSize: 20, color: 'red' }}></i>
                          </button>
                        </div>

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

    
      <div className="pagination-controls text-center mt-3">
        <button
          onClick={() => handlePageChange(productsData.current_page - 1)}
          disabled={productsData.current_page === 1}
        >
          Prev
        </button>
        <span className="mx-2">
          Page {productsData.current_page} of {productsData.last_page}
        </span>
        <button
          onClick={() => handlePageChange(productsData.current_page + 1)}
          disabled={productsData.current_page === productsData.last_page}
        >
          Next
        </button>
      </div>
</div>
</div>


    </div>
  );
}

export default ProductList;
