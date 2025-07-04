import React, { useEffect, useState } from 'react';
import { NavLink,useNavigate  } from 'react-router-dom';
import './saleorder.css';

function Saleorder() {
   const navigate = useNavigate();
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [stocks, setStocks] = useState([]);

  const [customerId, setCustomerId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [saleDate, setSaleDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [status, setStatus] = useState('pending');
  const [paidAmount, setPaidAmount] = useState(0);
  const [description, setDescription] = useState('');

  const [items, setItems] = useState([
    { product_id: '', quantity: 1, unit_price: 0, discount: 0, tax_percent: 0, tax_amount: 0, subtotal: 0, available_quantity: 0 },
  ]);

  useEffect(() => {
    fetch("http://didar.intelsofts.com/Laravel_React/B_POS/public/api/purchasesitems")
      .then(res => res.json())
      .then(data => setPurchaseItems(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error loading purchase items:", err));

    fetch("http://didar.intelsofts.com/Laravel_React/B_POS/public/api/customers")
      .then(res => res.json())
      .then(data => setCustomers(Array.isArray(data) ? data : data.data || []))
      .catch(err => console.error("Error loading customers:", err));

    fetch("http://didar.intelsofts.com/Laravel_React/B_POS/public/api/warehouses")
      .then(res => res.json())
      .then(data => setWarehouses(Array.isArray(data) ? data : data.data || []))
      .catch(err => console.error("Error loading warehouses:", err));

    fetch("http://didar.intelsofts.com/Laravel_React/B_POS/public/api/stocks")
      .then(res => res.json())
      .then(data => setStocks(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error loading stocks:", err));
  }, []);

  // Update item prices, available qty and recalc subtotal on changes
  const handleItemChange = (index, key, value) => {
    const updated = [...items];
    if (key === 'quantity') {
      // Make sure quantity is a number and not greater than available quantity
      let valNum = Number(value);
      if (valNum > updated[index].available_quantity) {
        alert(`Only ${updated[index].available_quantity} units available in stock.`);
        valNum = updated[index].available_quantity;
      } else if (valNum < 1) {
        valNum = 1;
      }
      updated[index][key] = valNum;
    } else {
      updated[index][key] = value;
    }

    const qty = parseFloat(updated[index].quantity || 0);
    const price = parseFloat(updated[index].unit_price || 0);
    const discount = parseFloat(updated[index].discount || 0);
    const taxRate = parseFloat(updated[index].tax_percent || 0);

    const baseTotal = qty * price - discount;
    const taxAmount = baseTotal * (taxRate / 100);
    updated[index].tax_amount = taxAmount.toFixed(2);
    updated[index].subtotal = (baseTotal + taxAmount).toFixed(2);

    setItems(updated);
  };

  const onProductChange = (index, productId) => {
    const updated = [...items];
    updated[index].product_id = productId;

    // Find stock for product in selected warehouse
    const matchedStock = stocks.find(
      s => s.product_id == productId && s.warehouse_id == warehouseId
    );
    updated[index].available_quantity = matchedStock ? matchedStock.quantity : 0;

    // Find latest purchase item price for the product
    const matchedPrice = purchaseItems
      .filter(p => p.product_id == productId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    updated[index].unit_price = matchedPrice.length > 0 ? parseFloat(matchedPrice[0].unit_price || 0) : 0;

    handleItemChange(index, 'unit_price', updated[index].unit_price);
    setItems(updated);
  };

  const addItem = () => {
    setItems([
      ...items,
      { product_id: '', quantity: 1, unit_price: 0, discount: 0, tax_percent: 0, tax_amount: 0, subtotal: 0, available_quantity: 0 },
    ]);
  };

  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const grandTotal = items.reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0);
  const dueAmount = grandTotal - parseFloat(paidAmount || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      customer_id: customerId,
      warehouse_id: warehouseId,
      sale_date: saleDate,
      total_amount: grandTotal,
      paid_amount: paidAmount,
      payment_method: paymentMethod,
      status,
      items: items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount: item.discount,
        tax_percent: item.tax_percent,
        tax_amount: item.tax_amount,
        subtotal: item.subtotal,
      })),
      description,
    };

    try {
      const res = await fetch("http://didar.intelsofts.com/Laravel_React/B_POS/public/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        alert("Sale  successfully");
        navigate('/pages/sale/salelist');
      } else {
        console.error(result);
        alert("Error creating sale");
      }
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Server error");
    }
  };

  // Filter products available in selected warehouse stocks
  const filteredProductIds = stocks
    .filter(s => s.warehouse_id == warehouseId)
    .map(s => s.product_id);

  // Get unique products from purchaseItems filtered by warehouse stock
  const uniqueProducts = [...new Map(
    purchaseItems
      .filter(p => filteredProductIds.includes(p.product_id))
      .map(p => [p.product_id, p])
  ).values()];

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h4>Sale Order Add</h4>
          <h6>Add/Update Sale</h6>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-body">
            {/* Customer & Warehouse & Sale Date & Payment Method */}
            <div className="row">
              <div className="col-lg-3 col-sm-6 col-12">
                <label>Customer</label>
                <select value={customerId} onChange={e => setCustomerId(e.target.value)} required>
                  <option value="">Select Customer</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-lg-3 col-sm-6 col-12">
                <label>Warehouse</label>
                <select value={warehouseId} onChange={e => setWarehouseId(e.target.value)} required>
                  <option value="">Select Warehouse</option>
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-lg-3 col-sm-6 col-12">
                <label>Sale Date</label>
                <input type="date" value={saleDate} onChange={e => setSaleDate(e.target.value)} required />
              </div>
              <div className="col-lg-3 col-sm-6 col-12">
                <label>Payment Method</label>
                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} required>
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="mobile">Mobile</option>
                  <option value="bank">Bank</option>
                </select>
              </div>
            </div>

            {/* Items Table */}
            <div className="table-responsive mt-3">
              <table className="table">
                <thead>
                  <tr className="table-header">
                    <th>Product</th> 
                    <th>Available</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Discount</th>
                    <th>Tax %</th>
                    <th>Tax Amt</th>
                    <th>Subtotal</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <select
                          value={item.product_id}
                          onChange={e => onProductChange(index, e.target.value)}
                          required
                        >
                          <option value="">Select</option>
                          {uniqueProducts.map(p => (
                            <option key={p.product_id} value={p.product_id}>
                              {p.product?.name || `Product #${p.product_id}`}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>{item.available_quantity}</td>
                      <td>
                        <input
                          type="number"
                          value={item.quantity}
                          min="1"
                          max={item.available_quantity}
                          onChange={e => {
                            const val = e.target.value;
                            if (val === '' || (Number(val) <= item.available_quantity && Number(val) >= 1)) {
                              handleItemChange(index, 'quantity', val);
                            } else {
                              alert(`Only ${item.available_quantity} units available in stock.`);
                            }
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.unit_price}
                          onChange={e => handleItemChange(index, 'unit_price', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.discount}
                          onChange={e => handleItemChange(index, 'discount', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.tax_percent}
                          onChange={e => handleItemChange(index, 'tax_percent', e.target.value)}
                        />
                      </td>
                      <td>{item.tax_amount}</td>
                      <td>{item.subtotal}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => removeItem(index)}
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button type="button" style={{ marginTop:'15px'}} className="btn btn-primary btn-sm" onClick={addItem}>
                Add Item
              </button>
            </div>

            {/* Summary */}
            <div className="row mt-4 pd" >
              <div className="col-lg-4">
                <label>Paid Amount</label>
                <input
                  type="number"
                  value={paidAmount}
                  onChange={e => setPaidAmount(e.target.value)}
                />
              </div>
              <div className="col-lg-4">
                <label>Grand Total</label>
                <input type="text" value={grandTotal.toFixed(2)} readOnly />
              </div>
              <div className="col-lg-4">
                <label>Due</label>
                <input type="text" value={dueAmount.toFixed(2)} readOnly />
              </div>
            </div>

            {/* Status */}
            <div className="col-lg-3 col-sm-6 col-12 mt-2">
              <label>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} required>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Description */}
            <div className="mt-3">
              <label>Description</label>
              <textarea
                className="form-control"
                value={description}
                onChange={e => setDescription(e.target.value)}
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="mt-4">
              <button type="submit" className="btn btn-submit me-2">
                Submit
              </button>
              <NavLink to="/pages/sale/salelist" className="btn btn-cancel">
                Cancel
              </NavLink>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Saleorder;
