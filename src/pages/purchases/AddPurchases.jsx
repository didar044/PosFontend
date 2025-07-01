import React, { useState, useEffect } from 'react';
import './puechases.css';
import { useNavigate, NavLink } from 'react-router-dom';

function AddPurchases() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [supplierId, setSupplierId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [reference, setReference] = useState('');
  const [status, setStatus] = useState('pending');
  const [description, setDescription] = useState('');

  const [orderTaxPercent, setOrderTaxPercent] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [shippingAmount, setShippingAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);

  const [items, setItems] = useState([
    { product_id: '', quantity: 1, unit_price: 0, discount: 0, tax_percent: 0, tax_amount: 0, subtotal: 0 },
  ]);

  useEffect(() => {
    fetch('http://didar.intelsofts.com/Laravel_React/B_POS/public/api/suppliers')
      .then(res => res.json())
      .then(data => setSuppliers(data.data || data))
      .catch(console.error);

    fetch('http://didar.intelsofts.com/Laravel_React/B_POS/public/api/products')
      .then(res => res.json())
      .then(data => setProducts(data.data || data))
      .catch(console.error);

    fetch('http://didar.intelsofts.com/Laravel_React/B_POS/public/api/warehouses')
      .then(res => res.json())
      .then(data => setWarehouses(data.data || data))
      .catch(console.error);
  }, []);

  function recalcItem(item) {
    const qty = Number(item.quantity) || 0;
    const unitPrice = Number(item.unit_price) || 0;
    const discount = Number(item.discount) || 0;
    const taxPercent = Number(item.tax_percent) || 0;
    const priceAfterDiscount = unitPrice - discount;
    const taxAmount = (priceAfterDiscount * taxPercent) / 100;
    const subtotal = qty * (priceAfterDiscount + taxAmount);
    return {
      ...item,
      tax_amount: taxAmount.toFixed(2),
      subtotal: subtotal.toFixed(2),
    };
  }

  function handleItemChange(index, field, value) {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    newItems[index] = recalcItem(newItems[index]);
    setItems(newItems);
  }

  function addItem() {
    setItems([
      ...items,
      { product_id: '', quantity: 1, unit_price: 0, discount: 0, tax_percent: 0, tax_amount: 0, subtotal: 0 },
    ]);
  }

  function removeItem(index) {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems.length > 0 ? newItems : [
      { product_id: '', quantity: 1, unit_price: 0, discount: 0, tax_percent: 0, tax_amount: 0, subtotal: 0 },
    ]);
  }

  const totalSubAmount = items.reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0);
  const orderTaxAmount = (totalSubAmount * orderTaxPercent) / 100;
  const grandTotal = totalSubAmount + orderTaxAmount + Number(shippingAmount || 0) - Number(discountAmount || 0);
  const dueAmount = (grandTotal - Number(paidAmount)).toFixed(2);

  function onProductChange(index, productId) {
    const product = products.find(p => p.id === Number(productId));
    const unitPrice = product?.purchase_price || 0;
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      product_id: productId,
      unit_price: unitPrice,
    };
    newItems[index] = recalcItem(newItems[index]);
    setItems(newItems);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      supplier_id: supplierId,
      warehouse_id: warehouseId,
      purchase_date: purchaseDate,
      reference,
      status,
      total_amount: grandTotal.toFixed(2),
      paid_amount: Number(paidAmount),
      description,
      items: items.map(item => ({
        product_id: Number(item.product_id),
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        discount: Number(item.discount),
        tax_percent: Number(item.tax_percent),
        tax_amount: Number(item.tax_amount),
        subtotal: Number(item.subtotal),
      })),
    };

try {
  const res = await fetch('http://didar.intelsofts.com/Laravel_React/B_POS/public/api/purchases', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.error("API Error:", errorData);
    alert("Error: " + JSON.stringify(errorData));
  } else {
    const data = await res.json();
    console.log("Success:", data);
    alert("Purchase submitted!");
    navigate('/pages/purchases/productlist');
  }
} catch (error) {
  console.error("Network error:", error);
  alert("Network error: " + error.message);
}

  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h4>Purchase Add</h4>
          <h6>Add/Update Purchase</h6>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-body">

            {/* Supplier, Warehouse, Date, Reference */}
            <div className="row">
              <div className="col-lg-3 col-sm-6 col-12">
                <label>Supplier Name</label>
                <select value={supplierId} onChange={e => setSupplierId(e.target.value)} required>
                  <option value="">Select Supplier</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name || s.company_name || s.supplier_name}
                    </option>
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
                <label>Purchase Date</label>
                <input type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} required />
              </div>

              <div className="col-lg-3 col-sm-6 col-12">
                <label>Reference No.</label>
                <input type="text" value={reference} onChange={e => setReference(e.target.value)} />
              </div>
            </div>

            {/* Product Items Table */}
            <div className="table-responsive mt-3">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Discount</th>
                    <th>Tax %</th>
                    <th>Tax Amt</th>
                    <th className="text-end">Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <select value={item.product_id} onChange={e => onProductChange(index, e.target.value)} required>
                          <option value="">Select Product</option>
                          {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </td>
                      <td><input type="number" value={item.quantity} min="1" onChange={e => handleItemChange(index, 'quantity', e.target.value)} required /></td>
                      <td><input type="number" value={item.unit_price} step="0.01" onChange={e => handleItemChange(index, 'unit_price', e.target.value)} required /></td>
                      <td><input type="number" value={item.discount} step="0.01" onChange={e => handleItemChange(index, 'discount', e.target.value)} /></td>
                      <td><input type="number" value={item.tax_percent} step="0.01" onChange={e => handleItemChange(index, 'tax_percent', e.target.value)} /></td>
                      <td>{item.tax_amount}</td>
                      <td className="text-end">{item.subtotal}</td>
                      <td><button type="button" className="btn btn-danger btn-sm" onClick={() => removeItem(index)}>X</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button type="button" className="btn btn-primary btn-sm" onClick={addItem}>Add Item</button>
            </div>

            {/* Order Summary */}
            <div className="row mt-4">
              <div className="col-lg-3 col-sm-6 col-12">
                <label>Order Tax %</label>
                <input type="number" value={orderTaxPercent} step="0.01" onChange={e => setOrderTaxPercent(e.target.value)} />
              </div>
              <div className="col-lg-3 col-sm-6 col-12">
                <label>Discount</label>
                <input type="number" value={discountAmount} step="0.01" onChange={e => setDiscountAmount(e.target.value)} />
              </div>
              <div className="col-lg-3 col-sm-6 col-12">
                <label>Shipping</label>
                <input type="number" value={shippingAmount} step="0.01" onChange={e => setShippingAmount(e.target.value)} />
              </div>
              <div className="col-lg-3 col-sm-6 col-12">
                <label>Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Paid and Totals */}
            <div className=" mt-4 pd">
              <div className="col-lg-4">
                <label>Paid Amount</label>
                <input type="number" value={paidAmount} step="0.01" onChange={e => setPaidAmount(e.target.value)} />
              </div>
              <div className="col-lg-4">
                <label>Grand Total</label>
                <input type="text" value={grandTotal.toFixed(2)} readOnly />
              </div>
              <div className="col-lg-4">
                <label>Due</label>
                <input type="text" value={dueAmount} readOnly />
              </div>
            </div>

            {/* Description */}
            <div className="form-group mt-3">
              <label >Description</label>
              <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)}></textarea>
            </div>

            {/* Submit */}
            <div className="mt-3">
              <button type="submit" className="btn btn-submit me-2">Submit</button>
              <NavLink to="/pages/purchases/productlist" className="btn btn-cancel">Cancel</NavLink>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddPurchases;
