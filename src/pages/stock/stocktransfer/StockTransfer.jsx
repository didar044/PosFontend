import React, { useEffect, useState } from 'react';
import './StockTransfer.css';


function StockTransfer() {
  const [warehouses, setWarehouses] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [formData, setFormData] = useState({
    product_id: '',
    from_warehouse_id: '',
    to_warehouse_id: '',
    quantity: '',
    transfer_date: '',
    description: '',
    status: 'inprogress',  
  });

  useEffect(() => {
    fetch('http://didar.intelsofts.com/Laravel_React/B_POS/public/api/stocks')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const uniqueWarehouses = Array.from(
            new Map(data.map(item => [item.warehouse.id, item.warehouse])).values()
          );
          setWarehouses(uniqueWarehouses);
          setStocks(data);
        } else {
          setWarehouses([]);
          setStocks([]);
        }
      })
      .catch(() => {
        setWarehouses([]);
        setStocks([]);
      });
  }, []);

  useEffect(() => {
    if (!formData.from_warehouse_id) {
      setFilteredProducts([]);
      setFormData(prev => ({ ...prev, product_id: '', quantity: '' }));
      return;
    }
    const filtered = stocks
      .filter(stock => stock.warehouse.id === parseInt(formData.from_warehouse_id))
      .map(stock => stock.product);

    const uniqueProductsMap = new Map();
    filtered.forEach(p => {
      if (p && !uniqueProductsMap.has(p.id)) uniqueProductsMap.set(p.id, p);
    });
    const uniqueProducts = Array.from(uniqueProductsMap.values());

    setFilteredProducts(uniqueProducts);

    if (!uniqueProducts.find(p => p.id === parseInt(formData.product_id))) {
      setFormData(prev => ({ ...prev, product_id: '', quantity: '' }));
    }
  }, [formData.from_warehouse_id, stocks]);

  const getAvailableStock = () => {
    if (!formData.from_warehouse_id || !formData.product_id) return 0;
    const stockItem = stocks.find(
      s => s.warehouse.id === parseInt(formData.from_warehouse_id) &&
           s.product.id === parseInt(formData.product_id)
    );
    return stockItem ? stockItem.quantity : 0;
  };

  const availableStock = getAvailableStock();

  const handleChange = e => {
    const { name, value } = e.target;

    if (name === 'quantity') {
      let valNum = Number(value);
      if (valNum > availableStock) {
        alert(`Maximum available stock is ${availableStock}`);
        setFormData(prev => ({ ...prev, quantity: availableStock.toString() }));
        return;
      }
      if (valNum < 1) {
        setFormData(prev => ({ ...prev, quantity: '' }));
        return;
      }
      setFormData(prev => ({ ...prev, quantity: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.product_id ||
      !formData.from_warehouse_id ||
      !formData.to_warehouse_id ||
      !formData.quantity ||
      !formData.transfer_date ||
      !formData.status
    ) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const res = await fetch('http://didar.intelsofts.com/Laravel_React/B_POS/public/api/stocktransfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('Transfer submitted successfully!');
        setFormData({
          product_id: '',
          from_warehouse_id: '',
          to_warehouse_id: '',
          quantity: '',
          transfer_date: '',
          description: '',
          status: 'inprogress',
        });
        setFilteredProducts([]);
      } else {
        const error = await res.json();
        alert('Failed to submit: ' + JSON.stringify(error));
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert('Error submitting form');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h4>Stock Transfer</h4>
          <h6>Add/Update Transfer</h6>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="row">

            {/* From Warehouse */}
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="form-group">
                <label>From Warehouse</label>
                <select
                  className="form-control"
                  name="from_warehouse_id"
                  value={formData.from_warehouse_id}
                  onChange={handleChange}
                >
                  <option value="">Choose</option>
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product filtered by From Warehouse */}
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="form-group">
                <label>Product (available in From Warehouse)</label>
                <select
                  className="form-control"
                  name="product_id"
                  value={formData.product_id}
                  onChange={handleChange}
                  disabled={!formData.from_warehouse_id || filteredProducts.length === 0}
                >
                  <option value="">Choose</option>
                  {filteredProducts.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* To Warehouse */}
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="form-group">
                <label>To Warehouse</label>
                <select
                  className="form-control"
                  name="to_warehouse_id"
                  value={formData.to_warehouse_id}
                  onChange={handleChange}
                >
                  <option value="">Choose</option>
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quantity */}
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="form-group">
                <label>Quantity (Available: {availableStock})</label>
                <input
                  type="number"
                  min="1"
                  max={availableStock}
                  name="quantity"
                  className="form-control"
                  value={formData.quantity}
                  onChange={handleChange}
                  disabled={!formData.product_id}
                  placeholder={availableStock === 0 ? "No stock available" : ""}
                />
              </div>
            </div>

            {/* Transfer Date */}
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="form-group">
                <label>Transfer Date</label>
                <input
                  type="date"
                  name="transfer_date"
                  className="form-control"
                  value={formData.transfer_date}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Status */}
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="form-group">
                <label>Status</label>
                <select
                  className="form-control"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="inprogress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="col-lg-12">
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Submit / Cancel */}
            <div className="col-lg-12">
              <button className="btn btn-submit me-2" onClick={handleSubmit}>Submit</button>
              <button
                className="btn btn-cancel"
                onClick={() =>
                  setFormData({
                    product_id: '',
                    from_warehouse_id: '',
                    to_warehouse_id: '',
                    quantity: '',
                    transfer_date: '',
                    description: '',
                    status: 'inprogress',
                  })
                }
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default StockTransfer;
