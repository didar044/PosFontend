import React, { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';

function EditSale() {
  const { id } = useParams();  // Sale ID from route param
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

  const [loading, setLoading] = useState(true);

  // Load supporting data (customers, warehouses, purchase items, stocks)
  useEffect(() => {
    Promise.all([
      fetch("http://didar.intelsofts.com/Laravel_React/B_POS/public/api/purchasesitems").then(res => res.json()),
      fetch("http://didar.intelsofts.com/Laravel_React/B_POS/public/api/customers").then(res => res.json()),
      fetch("http://didar.intelsofts.com/Laravel_React/B_POS/public/api/warehouses").then(res => res.json()),
      fetch("http://didar.intelsofts.com/Laravel_React/B_POS/public/api/stocks").then(res => res.json()),
    ]).then(([purchaseItemsData, customersData, warehousesData, stocksData]) => {
      setPurchaseItems(Array.isArray(purchaseItemsData) ? purchaseItemsData : (purchaseItemsData.data || []));
      setCustomers(Array.isArray(customersData) ? customersData : (customersData.data || []));
      setWarehouses(Array.isArray(warehousesData) ? warehousesData : (warehousesData.data || []));
      setStocks(Array.isArray(stocksData) ? stocksData : []);
    }).catch(err => {
      console.error("Error loading reference data:", err);
    });
  }, []);

  // Load sale data by ID and prefill form
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/sales/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Sale not found");
        return res.json();
      })
      .then(data => {
        setCustomerId(data.customer_id || '');
        setWarehouseId(data.warehouse_id || '');
        setSaleDate(data.sale_date ? data.sale_date.split('T')[0] : ''); // Format date YYYY-MM-DD
        setPaymentMethod(data.payment_method || 'cash');
        setStatus(data.status || 'pending');
        setPaidAmount(data.paid_amount || 0);
        setDescription(data.description || '');

        // Map sale items with available quantity from stocks
        const mappedItems = data.items.map(item => {
          const stock = stocks.find(s => s.product_id === item.product_id && s.warehouse_id === data.warehouse_id);
          return {
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            discount: item.discount,
            tax_percent: item.tax_percent,
            tax_amount: item.tax_amount,
            subtotal: item.subtotal,
            available_quantity: stock ? stock.quantity : 0,
          };
        });

        setItems(mappedItems.length ? mappedItems : [{
          product_id: '',
          quantity: 1,
          unit_price: 0,
          discount: 0,
          tax_percent: 0,
          tax_amount: 0,
          subtotal: 0,
          available_quantity: 0,
        }]);

        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert("Failed to load sale data.");
        setLoading(false);
      });
  }, [id, stocks]);

  // Reset items if warehouse changed (to avoid mismatch stock info)
  useEffect(() => {
    if (loading) return; // prevent reset during initial load
    setItems([
      { product_id: '', quantity: 1, unit_price: 0, discount: 0, tax_percent: 0, tax_amount: 0, subtotal: 0, available_quantity: 0 },
    ]);
  }, [warehouseId]);

  // Update item fields & recalc
  const handleItemChange = (index, key, value) => {
    const updated = [...items];

    if (['quantity', 'unit_price', 'discount', 'tax_percent'].includes(key)) {
      let numVal = Number(value);
      if (key === 'quantity') {
        numVal = Math.min(Math.max(numVal, 1), updated[index].available_quantity || Infinity);
      }
      updated[index][key] = isNaN(numVal) ? 0 : numVal;
    } else {
      updated[index][key] = value;
    }

    const qty = updated[index].quantity || 0;
    const price = updated[index].unit_price || 0;
    const discount = updated[index].discount || 0;
    const taxPercent = updated[index].tax_percent || 0;

    const baseTotal = qty * price - discount;
    const taxAmount = baseTotal * (taxPercent / 100);
    updated[index].tax_amount = taxAmount.toFixed(2);
    updated[index].subtotal = (baseTotal + taxAmount).toFixed(2);

    setItems(updated);
  };

  // On product select: update price & available stock
  const onProductChange = (index, productId) => {
    const updated = [...items];
    updated[index].product_id = productId;

    // Get stock in current warehouse
    const matchedStock = stocks.find(
      s => s.product_id == productId && s.warehouse_id == warehouseId
    );
    updated[index].available_quantity = matchedStock ? matchedStock.quantity : 0;

    // Latest purchase price
    const matchedPrice = purchaseItems
      .filter(p => p.product_id == productId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    updated[index].unit_price = matchedPrice.length > 0 ? parseFloat(matchedPrice[0].unit_price || 0) : 0;

    // Recalculate
    const qty = updated[index].quantity || 1;
    const price = updated[index].unit_price || 0;
    const discount = updated[index].discount || 0;
    const taxPercent = updated[index].tax_percent || 0;

    const baseTotal = qty * price - discount;
    const taxAmount = baseTotal * (taxPercent / 100);
    updated[index].tax_amount = taxAmount.toFixed(2);
    updated[index].subtotal = (baseTotal + taxAmount).toFixed(2);

    setItems(updated);
  };

  const addItem = () => {
    setItems([
      ...items,
      { product_id: '', quantity: 1, unit_price: 0, discount: 0, tax_percent: 0, tax_amount: 0, subtotal: 0, available_quantity: 0 },
    ]);
  };

  const removeItem = (index) => {
    if (items.length === 1) {
      alert("At least one item is required.");
      return;
    }
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const grandTotal = items.reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0);
  const dueAmount = grandTotal - parseFloat(paidAmount || 0);

  // Submit updated sale data
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerId || !warehouseId || !saleDate) {
      alert("Please fill customer, warehouse, and sale date.");
      return;
    }

    for (const item of items) {
      if (!item.product_id) {
        alert("Please select a product for all items.");
        return;
      }
      if (item.quantity > item.available_quantity) {
        alert(`Quantity for product ${item.product_id} exceeds available stock.`);
        return;
      }
    }

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
      const res = await fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/sales/${id}`, {
        method: "PUT", // or PATCH depending on your backend
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        alert("Sale updated successfully");
        navigate('/pages/sale/salelist');
      } else {
        console.error(result);
        alert(result.message || "Error updating sale");
      }
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Server error");
    }
  };

  // Filter products by warehouse stock
  const filteredProductIds = stocks
    .filter(s => s.warehouse_id == warehouseId)
    .map(s => s.product_id);

  const uniqueProducts = [...new Map(
    purchaseItems
      .filter(p => filteredProductIds.includes(p.product_id))
      .map(p => [p.product_id, p])
  ).values()];

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h4>Edit Sale Order</h4>
          <h6>Edit your sale order details</h6>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-body">

            {/* Customer, Warehouse, Sale Date, Payment Method */}
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
                  <tr>
                    <th>Product</th>
                    <th>Available</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Discount</th>
                    <th>Tax %</th>
                    <th>Tax Amt</th>
                    <th>Subtotal</th>
                    <th></th>
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
                          disabled={!warehouseId}
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
                          disabled={!item.product_id}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.unit_price}
                          onChange={e => handleItemChange(index, 'unit_price', e.target.value)}
                          disabled={!item.product_id}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.discount}
                          onChange={e => handleItemChange(index, 'discount', e.target.value)}
                          disabled={!item.product_id}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.tax_percent}
                          onChange={e => handleItemChange(index, 'tax_percent', e.target.value)}
                          disabled={!item.product_id}
                        />
                      </td>
                      <td>{parseFloat(item.tax_amount).toFixed(2)}</td>
                      <td>{parseFloat(item.subtotal).toFixed(2)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => removeItem(index)}
                          disabled={items.length === 1}
                          title={items.length === 1 ? "At least one item required" : "Remove Item"}
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={addItem}
                disabled={!warehouseId}
                style={{ marginTop:'15px'}}
              >
                Add Item
              </button>
            </div>

            {/* Summary */}
            <div className="row mt-4">
              <div className="col-lg-4">
                <label>Paid Amount</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
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
                Update
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

export default EditSale;
