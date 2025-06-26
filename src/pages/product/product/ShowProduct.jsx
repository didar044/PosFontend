import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch product");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading product details...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h4>Product Details</h4>
          <h6>Full details of a product</h6>
        </div>
      </div>

      <div className="row">
        {/* Left Section */}
        <div className="col-lg-8 col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="bar-code-view d-flex justify-content-between align-items-center mb-3">
                 {product.barcode ? (
                        <img
                        src={`https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(product.barcode)}&code=Code128&translate-esc=true`}
                        alt="barcode"
                        style={{ height: 60 , width:210}}
                        />
                    ) : (
                        <span>No Barcode</span>
                    )}
                  
                
              </div>

              <div className="productdetails">
                <ul className="product-bar list-unstyled">
                  <li className="mb-2">
                    <h4>Product</h4>
                    <h6>{product.name || "-"}</h6>
                  </li>
                  <li className="mb-2">
                    <h4>Category</h4>
                    <h6>{product.categorie?.name || "-"}</h6>
                  </li>
                  <li className="mb-2">
                    <h4>Sub Category</h4>
                    <h6>{product.subcategory || "None"}</h6>
                  </li>
                  <li className="mb-2">
                    <h4>Brand</h4>
                    <h6>{product.brand?.name || "-"}</h6>
                  </li>
                  <li className="mb-2">
                    <h4>Unit</h4>
                    <h6>{product.unit || "Piece"}</h6>
                  </li>
                  <li className="mb-2">
                    <h4>SKU</h4>
                    <h6>{product.barcode || "-"}</h6>
                  </li>
                  <li className="mb-2">
                    <h4>Minimum Qty</h4>
                    <h6>{product.min_qty || "-"}</h6>
                  </li>
                  <li className="mb-2">
                    <h4>Quantity</h4>
                    <h6>{product.quantity || 0}</h6>
                  </li>
                  <li className="mb-2">
                    <h4>Tax</h4>
                    <h6>{product.tax ? product.tax + " %" : "0.00 %"}</h6>
                  </li>
                  <li className="mb-2">
                    <h4>Discount Type</h4>
                    <h6>{product.discount_type || "Percentage"}</h6>
                  </li>
                  <li className="mb-2">
                    <h4>Price</h4>
                    <h6>{product.price || 0}</h6>
                  </li>
                  <li className="mb-2">
                    <h4>Status</h4>
                    <h6>{product.status || "-"}</h6>
                  </li>
                  <li className="mb-2">
                    <h4>Description</h4>
                    <h6>{product.description || "-"}</h6>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="col-lg-4 col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="slider-product-details text-center">
                <img
                  src={`http://didar.intelsofts.com/Laravel_React/B_POS/public/img/product/${product.img}`}
                  alt={product.name}
                  className="img-fluid mb-3"
                  style={{ maxHeight: 300, objectFit: "contain" }}
                />
                <h4>{product.img}</h4>
                {/* You can add more images carousel here if available */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
