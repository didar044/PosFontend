import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './puechases.css';

function EditPurchases() {
  const { id } = useParams();
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

  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/purchases/${id}`)
      .then(res => res.json())
      .then(data => {
        const purchase = data.data || data;
        setSupplierId(purchase.supplier_id);
        setWarehouseId(purchase.warehouse_id);
        setPurchaseDate(purchase.purchase_date);
        setReference(purchase.reference || '');
        setStatus(purchase.status);
        setDescription(purchase.description || '');
        setPaidAmount(purchase.paid_amount || 0);
        setItems(
          purchase.items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            discount: item.discount,
            tax_percent: item.tax_percent,
            tax_amount: item.tax_amount,
            subtotal: item.subtotal,
          }))
        );
      })
      .catch(console.error);

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
  }, [id]);

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

  const totalSubAmount = items.reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0);
  const orderTaxAmount = (totalSubAmount * orderTaxPercent) / 100;
  const grandTotal = totalSubAmount + orderTaxAmount + Number(shippingAmount || 0) - Number(discountAmount || 0);
  const dueAmount = (grandTotal - Number(paidAmount)).toFixed(2);

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
      const res = await fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/purchases/${id}`, {
        method: 'PUT',
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
        alert("Purchase updated successfully!");
        navigate('/pages/purchases/productlist');
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error: " + error.message);
    }
  }

  return (
    <div >
      
        <div className="page-title">
          <h4>Edit Purchase</h4>
          <h6>Modify existing purchase entry</h6>
        </div>
      

      <form onSubmit={handleSubmit} className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-lg-4">
              <label>Supplier</label>
              <select value={supplierId} onChange={e => setSupplierId(e.target.value)} className="form-control" required>
                <option value="">Select Supplier</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="col-lg-4">
              <label>Warehouse</label>
              <select value={warehouseId} onChange={e => setWarehouseId(e.target.value)} className="form-control" required>
                <option value="">Select Warehouse</option>
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>

            <div className="col-lg-4">
              <label>Purchase Date</label>
              <input type="date" className="form-control" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} required />
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-lg-6">
              <label>Reference</label>
              <input type="text" className="form-control" value={reference} onChange={e => setReference(e.target.value)} />
            </div>

            <div className="col-lg-6">
              <label>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="form-control">
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="table-responsive mt-3">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Product</th>
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
                      <select value={item.product_id} onChange={e => onProductChange(index, e.target.value)} className="form-control" required>
                        <option value="">Select Product</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </td>
                    <td><input type="number" className="form-control" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} /></td>
                    <td><input type="number" className="form-control" value={item.unit_price} onChange={e => handleItemChange(index, 'unit_price', e.target.value)} /></td>
                    <td><input type="number" className="form-control" value={item.discount} onChange={e => handleItemChange(index, 'discount', e.target.value)} /></td>
                    <td><input type="number" className="form-control" value={item.tax_percent} onChange={e => handleItemChange(index, 'tax_percent', e.target.value)} /></td>
                    <td>{item.tax_amount}</td>
                    <td>{item.subtotal}</td>
                    <td><button type="button" className="btn btn-danger btn-sm" onClick={() => removeItem(index)}>X</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" className="btn btn-primary btn-sm" onClick={addItem}>Add Item</button>
          </div>

          <div className="row mt-3">
            <div className="col-lg-4">
              <label>Order Tax (%)</label>
              <input type="number" className="form-control" value={orderTaxPercent} onChange={e => setOrderTaxPercent(e.target.value)} />
            </div>
            <div className="col-lg-4">
              <label>Discount</label>
              <input type="number" className="form-control" value={discountAmount} onChange={e => setDiscountAmount(e.target.value)} />
            </div>
            <div className="col-lg-4">
              <label>Shipping</label>
              <input type="number" className="form-control" value={shippingAmount} onChange={e => setShippingAmount(e.target.value)} />
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-lg-4">
              <label>Paid Amount</label>
              <input type="number" className="form-control" value={paidAmount} onChange={e => setPaidAmount(e.target.value)} />
            </div>
            <div className="col-lg-4">
              <label>Grand Total</label>
              <input type="text" className="form-control" value={grandTotal.toFixed(2)} readOnly />
            </div>
            <div className="col-lg-4">
              <label>Due</label>
              <input type="text" className="form-control" value={dueAmount} readOnly />
            </div>
          </div>

          <div className="form-group mt-3">
            <label>Description</label>
            <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)}></textarea>
          </div>

          <div className="mt-3">
            <button type="submit" className="btn btn-success me-2">Update</button>
            <a href="/purchaselist" className="btn btn-secondary">Cancel</a>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditPurchases;
