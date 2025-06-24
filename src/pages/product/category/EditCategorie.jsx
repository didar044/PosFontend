import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';

function EditCategorie() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    brand_id: '',
    description: '',
    img: null, // file object when uploading new image
  });
  const [previewImg, setPreviewImg] = useState(null); // URL for preview
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch brands
    fetch('http://didar.intelsofts.com/Laravel_React/B_POS/public/api/brands')
      .then((res) => res.json())
      .then((data) => setBrands(data.brands || []))
      .catch(() => setBrands([]));
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/caregoties/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch category');
        return res.json();
      })
      .then((data) => {
        setFormData({
          name: data.name || '',
          brand_id: data.brand_id || '',
          description: data.description || '',
          img: null,
        });

        // Set existing image preview URL — adjust this URL as per your backend storage path
        if (data.img) {
          setPreviewImg(`http://didar.intelsofts.com/Laravel_React/B_POS/public/img/categorie/${data.img}`);
        } else {
          setPreviewImg(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'img') {
      const file = files[0];
      setFormData((prev) => ({ ...prev, img: file }));

      // Show preview for new uploaded image
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImg(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewImg(null);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const sendData = new FormData();
    sendData.append('name', formData.name);
    sendData.append('brand_id', formData.brand_id);
    sendData.append('description', formData.description);
    if (formData.img) sendData.append('img', formData.img);
    sendData.append('_method', 'PUT'); // for Laravel update via POST

    try {
      const res = await fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/caregoties/${id}`, {
        method: 'POST',
        body: sendData,
      });

      const result = await res.json();
      if (res.ok) {
        alert('Category updated successfully!');
        navigate('/pages/product/categorielist');
      } else {
        setError(result.message || 'Update failed');
      }
    } catch (err) {
      setError('Submit error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading category data...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h4>Edit Product Category</h4>
          <h6>Update existing product category</h6>
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
                    disabled={submitting}
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
                    disabled={submitting}
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
                    disabled={submitting}
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
                      disabled={submitting}
                    />
                    <div className="image-uploads mt-2">
                      {previewImg ? (
                        <img
                          src={previewImg}
                          alt="Preview"
                          style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6 }}
                        />
                      ) : (
                        <>
                          <img src="assets/img/icons/upload.svg" alt="upload" width={30} />
                          <h4>Drag and drop a file to upload</h4>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-12">
                <button type="submit" className="btn btn-submit me-2" disabled={submitting}>
                  {submitting ? 'Updating...' : 'Update'}
                </button>
                <NavLink to="/pages/product/categorielist" className="btn btn-cancel" tabIndex="-1" aria-disabled={submitting}>
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

export default EditCategorie;
