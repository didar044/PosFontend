import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

function AddBrand() {
  const [brandName, setBrandName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const navigate = useNavigate(); // ✅ Here at top level

  const f = async () => {
    const formData = new FormData();
    formData.append('name', brandName);
    formData.append('description', description);
    if (image) {
      formData.append('img', image);
      console.log('Uploading image:', image);
    }

    try {
      const res = await fetch('http://didar.intelsofts.com/Laravel_React/B_POS/public/api/brands', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      alert('✅ Brand created successfully!');
      console.log(data);
      navigate('/pages/product/brand'); // Redirect after success
    } catch (error) {
      console.error('❌ Failed to submit brand:', error);
      alert('Failed to create brand. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    f();
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h4>Brand ADD</h4>
          <h6>Create new Brand</h6>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="form-group">
                  <label>Brand Name</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
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
                <div className="form-group">
                  <label>Product Image</label>
                  <div className="image-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                    <div className="image-uploads">
                      <i
                        className="bx bx-cloud-upload"
                        style={{ fontSize: '40px', color: '#555' }}
                      ></i>
                      <h4>Drag and drop a file to upload</h4>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-12">
                <button type="submit" className="btn btn-submit me-2">
                  Submit
                </button>
                <NavLink to={`/pages/product/brand`} className="btn btn-cancel">
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

export default AddBrand;
