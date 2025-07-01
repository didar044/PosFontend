import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  // const [suppliers, setSuppliers] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    brand_id: '',
    categorie_id: '',
    // supplier_id: '',
    barcode: '',
    price: '',
    discount: '',
    tax: '',
    quantity: '',
    status: 'active',
    description: '',
    img: null,
  });

  const [existingImg, setExistingImg] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);

  // Load brands
  useEffect(() => {
    fetch('http://didar.intelsofts.com/Laravel_React/B_POS/public/api/brands')
      .then(res => res.json())
      .then(json => setBrands(json.brands || []))
      .catch(err => console.error('Failed to fetch brands:', err));
  }, []);

  // Load categories
  useEffect(() => {
    fetch('http://didar.intelsofts.com/Laravel_React/B_POS/public/api/caregoties')
      .then(res => res.json())
      .then(json => {
        const data = Array.isArray(json) ? json : json.categories || json.data || [];
        setCategories(data);
      })
      .catch(err => console.error('Failed to fetch categories:', err));
  }, []);

  // Load suppliers
  // useEffect(() => {
  //   fetch('http://didar.intelsofts.com/Laravel_React/B_POS/public/api/suppliers')
  //     .then(res => res.json())
  //     .then(json => {
  //       const data = Array.isArray(json) ? json : json.data || [];
  //       setSuppliers(data);
  //     })
  //     .catch(err => console.error('Failed to fetch suppliers:', err));
  // }, []);

  // Load product data if editing
  useEffect(() => {
    if (id) {
      fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/products/${id}`)
        .then(res => res.json())
        .then(product => {
          setFormData({
            name: product.name || '',
            brand_id: product.brand_id || '',
            categorie_id: product.categorie_id || '',
            // supplier_id: product.supplier_id || '',
            barcode: product.barcode || '',
            price: product.price || '',
            discount: product.discount || '',
            tax: product.tax || '',
            quantity: product.quantity || '',
            status: product.status || 'active',
            description: product.description || '',
            img: null,
          });
          setExistingImg(product.img || null);

          // Filter categories for this brand
          const filtered = categories.filter(cat => String(cat.brand_id) === String(product.brand_id));
          setFilteredCategories(filtered);
        })
        .catch(err => console.error('Failed to fetch product details:', err));
    }
  }, [id, categories]);

  // Cleanup preview URL on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (previewImg) {
        URL.revokeObjectURL(previewImg);
      }
    };
  }, [previewImg]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'img') {
      const file = files[0];
      setFormData({ ...formData, img: file });
      if (file) {
        const previewURL = URL.createObjectURL(file);
        setPreviewImg(previewURL);
      } else {
        setPreviewImg(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleBrandChange = (e) => {
    const brandId = e.target.value;
    setFormData({ ...formData, brand_id: brandId, categorie_id: '' });
    const filtered = categories.filter(cat => String(cat.brand_id) === String(brandId));
    setFilteredCategories(filtered);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      brand_id: '',
      categorie_id: '',
      // supplier_id: '',
      barcode: '',
      price: '',
      discount: '',
      tax: '',
      quantity: '',
      status: 'active',
      description: '',
      img: null,
    });
    setFilteredCategories([]);
    setExistingImg(null);
    setPreviewImg(null);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const formDataToSend = new FormData();
  Object.keys(formData).forEach(key => {
    if (formData[key] !== null && formData[key] !== undefined) {
      formDataToSend.append(key, formData[key]);
    }
  });

  if (id) {
    formDataToSend.append('_method', 'PUT');
  }

  const url = id
    ? `http://didar.intelsofts.com/Laravel_React/B_POS/public/api/products/${id}`
    : `http://didar.intelsofts.com/Laravel_React/B_POS/public/api/products`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      body: formDataToSend,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error response:', errorText);
      alert('Failed to submit product');
      return;
    }
     res.json();
    alert(id ? 'Product updated successfully!' : 'Product added successfully!');
    navigate('/pages/product/productlist'); 
  } catch (err) {
    console.error('Submit error:', err);
    alert('Error submitting form');
  }
};


  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h4>{id ? 'Edit Product' : 'Add Product'}</h4>
          <h6>{id ? 'Update existing product' : 'Create new product'}</h6>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-body row">
            <div className="col-lg-3 col-sm-6 col-12">
              <label>Product Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" required />
            </div>

            <div className="col-lg-3 col-sm-6 col-12">
              <label>Brand</label>
              <select name="brand_id" value={formData.brand_id} onChange={handleBrandChange} className="form-select" required>
                <option value="">Select Brand</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </div>

            <div className="col-lg-3 col-sm-6 col-12">
              <label>Category</label>
              <select name="categorie_id" value={formData.categorie_id} onChange={handleChange} className="form-select" required>
                <option value="">Select Category</option>
                {filteredCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* <div className="col-lg-3 col-sm-6 col-12">
              <label>Supplier</label>
              <select name="supplier_id" value={formData.supplier_id} onChange={handleChange} className="form-select" required>
                <option value="">Select Supplier</option>
                {suppliers.map(sup => (
                  <option key={sup.id} value={sup.id}>{sup.name}</option>
                ))}
              </select>
            </div> */}

            <div className="col-lg-3 col-sm-6 col-12">
              <label>SKU / Barcode</label>
              <input type="text" name="barcode" value={formData.barcode} onChange={handleChange} className="form-control" />
            </div>

            <div className="col-lg-3 col-sm-6 col-12">
              <label>Quantity</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="form-control" required />
            </div>

            <div className="col-lg-3 col-sm-6 col-12">
              <label>Price</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="form-control" required />
            </div>

            <div className="col-lg-3 col-sm-6 col-12">
              <label>Discount</label>
              <input type="number" name="discount" value={formData.discount} onChange={handleChange} className="form-control" />
            </div>

            <div className="col-lg-3 col-sm-6 col-12">
              <label>Tax</label>
              <input type="number" name="tax" value={formData.tax} onChange={handleChange} className="form-control" />
            </div>

            <div className="col-lg-3 col-sm-6 col-12">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="form-select">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="col-lg-12">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" />
            </div>

            <div className="col-lg-12">
              <label>Product Image</label>
              <input type="file" name="img" onChange={handleChange} className="form-control" />
              {previewImg ? (
                <img
                  src={previewImg}
                  alt="Preview"
                  style={{ width: 50, height: 50, objectFit: 'cover', marginBottom: 5 }}
                />
              ) : existingImg ? (
                <img
                  src={`http://didar.intelsofts.com/Laravel_React/B_POS/public/img/product/${existingImg}`}
                  alt={formData.name}
                  style={{ width: 50, height: 50, objectFit: 'cover', marginBottom: 5 }}
                />
              ) : (
                '-'
              )}
            </div>

            <div className="col-lg-12 mt-3">
              <button type="submit" className="btn btn-submit me-2">Submit</button>
              <button type="button" className="btn btn-cancel" onClick={handleReset}>Cancel</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;
