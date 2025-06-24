import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditBrand() {
  const { id } = useParams(); // get brand ID from route params
  const navigate = useNavigate();

  const [brandName, setBrandName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  useEffect(() => {
    fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/brands/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch brand data');
        return res.json();
      })
      .then(data => {
        const brand = data.brand || {};
        setBrandName(brand.name || '');
        setDescription(brand.description || '');
        if (brand.img) {
          setExistingImage(`http://didar.intelsofts.com/Laravel_React/B_POS/public/img/brand/${brand.img}`);
        } else {
          setExistingImage(null);
        }
      })
      .catch(error => {
        console.error(error);
        alert('Failed to load brand data');
      });
  }, [id]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', brandName);
    formData.append('description', description);
    if (image) formData.append('img', image);
    formData.append('_method', 'PUT'); // for Laravel PUT method spoofing

    try {
      const res = await fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/brands/${id}`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Update failed with status ${res.status}`);
      }

      alert('Brand updated successfully!');
      navigate('/pages/product/brand'); // Redirect after update
    } catch (error) {
      console.error(error);
      alert('Failed to update brand.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h4>Brand Edit</h4>
          <h6>Update your Brand</h6>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Brand Name */}
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

              {/* Description */}
              <div className="col-lg-12">
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="col-lg-12">
                <div className="form-group">
                  <label>Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <div className="image-uploads" style={{ marginTop: 10 }}>
                    {image ? (
                      <div>
                        <strong>Selected file:</strong> {image.name}
                        <br />
                        <img
                          src={URL.createObjectURL(image)}
                          alt="preview"
                          style={{ maxWidth: '100px', maxHeight: '100px', marginTop: 5 }}
                        />
                      </div>
                    ) : existingImage ? (
                      <div>
                        <strong>Current Image:</strong>
                        <br />
                        <img
                          src={existingImage}
                          alt="current"
                          style={{ maxWidth: '100px', maxHeight: '100px', marginTop: 5 }}
                        />
                      </div>
                    ) : (
                      <p>No image uploaded</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="col-lg-12">
                <button type="submit" className="btn btn-submit me-2">
                  Update Brand
                </button>
                <a href="/pages/product/brand" className="btn btn-cancel">
                  Cancel
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditBrand;
