import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function AddCategorie() {
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    brand_id: '',
    description: '',
    img: null,
  });
 const navigate = useNavigate();
  useEffect(() => {
    fetch('http://didar.intelsofts.com/Laravel_React/B_POS/public/api/brands')
      .then((res) => res.json())
      .then((data) => {
        setBrands(data.brands || []);
      })
      .catch((err) => {
        console.error('Error loading brands:', err);
        setBrands([]);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'img') {
      setFormData({ ...formData, img: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sendData = new FormData();
    sendData.append('name', formData.name);
    sendData.append('brand_id', formData.brand_id);
    sendData.append('description', formData.description);
    if (formData.img) sendData.append('img', formData.img);

    try {
      const res = await fetch('http://didar.intelsofts.com/Laravel_React/B_POS/public/api/caregoties', {
        method: 'POST',
        body: sendData,
      });

      const result = await res.json();
      if (res.ok) {
        alert('Category created successfully');
        setFormData({ name: '', brand_id: '', description: '', img: null });
        navigate('/pages/product/categorielist');
      } else {
        console.error(result);
        alert('Failed to create category');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Submit error occurred');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h4>Product Add Category</h4>
          <h6>Create new product Category</h6>
        </div>
      </div>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-6 col-sm-6 col-12">
                <div className="form-group">
                  <label>Category Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="col-lg-6 col-sm-6 col-12">
                <div className="form-group">
                  <label>Brand</label>
                  <select
                    name="brand_id"
                    value={formData.brand_id}
                    onChange={handleChange}
                    className="form-control"
                    required
                  >
                    <option value="">-- Select Brand --</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-lg-12">
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-lg-12">
                <div className="form-group">
                  <label>Product Image</label>
                  <div className="image-upload">
                    <input
                      type="file"
                      name="img"
                      accept="image/*"
                      onChange={handleChange}
                    />
                    <div className="image-uploads mt-2">
                      <img src="assets/img/icons/upload.svg" alt="upload" width="30" />
                      <h4>Drag and drop a file to upload</h4>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-12">
                <button type="submit" className="btn btn-submit me-2">
                  Submit
                </button>
                <NavLink href="/pages/product/categorielist" className="btn btn-cancel">
                  Cancel
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddCategorie;
