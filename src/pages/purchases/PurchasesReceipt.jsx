import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import '../sales/Reciept.css';

function PurchasesReceipt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.error('No ID provided in URL');
      navigate('/pages/purchase/purchaselist');
      return;
    }

    console.log("Fetching purchase receipt for ID:", id);

    fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/purchases/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Purchase not found");
        return res.json();
      })
      .then(response => {
        // Use the single purchase directly if no pagination
        const record = response.data ?? response;
        setPurchase(record);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load purchase:', err);
        setLoading(false);
      });
  }, [id, navigate]);

  if (loading) return <p className="text-center">Loading receipt...</p>;
  if (!purchase) return <p className="text-danger text-center">Receipt not found.</p>;

  const due = (parseFloat(purchase.total_amount) - parseFloat(purchase.paid_amount)).toFixed(2);

  return (
    <div>
      <div className="col-lg-12 mt-3">
        <NavLink to="/pages/purchases/purchasesinvoice" className="btn btn-submit">Back</NavLink>
      </div>

      <div className="receipt-wrapper container p-4" style={{ maxWidth: 800, margin: '0 auto' }}>
        <h2 className="text-center mb-3">Purchase Invoice</h2>

        {/* Company Info */}
        <div className="mb-4 text-center">
          <h4>Fatehabad POS</h4>
          <p>123 Education Lane
            Cityville, ST 45678
            </p>
          <p>Email: info@fatehabad.com | Phone: 01234567890</p>
        </div>

        {/* Header Info */}
<div className="row mb-3">
  <div className="col-md-6">
    <h5>Supplier Info</h5>
    <p><strong>Name:</strong> {purchase.supplier?.name}</p>
    <p><strong>Phone:</strong> {purchase.supplier?.phone}</p>
    <p><strong>Address:</strong> {purchase.supplier?.address}</p>
    <p><strong>Email:</strong> {purchase.supplier?.email}</p>
  </div>
  <div className="col-md-6">
    <p><strong>Receipt No:</strong> {purchase?.id ? `PU${purchase.id.toString().padStart(4, '0')}` : 'PU0000'}</p>
    <p><strong>Date:</strong> {purchase.purchase_date}</p>
    <p><strong>Warehouse:</strong> {purchase.warehouse?.name}</p>
    <p><strong>Warehouse Address:</strong> {purchase.warehouse?.location}</p>
  </div>
</div>


        {/* Purchase Items Table */}
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Tax</th>
              <th>Tax Amount</th>
              <th>Discount</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {purchase.items.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.product?.name || item.product_id}</td>
                <td>{item.quantity}</td>
                <td>{parseFloat(item.unit_price).toFixed(2)}</td>
                <td>{parseFloat(item.tax_percent).toFixed(2)}</td>
                <td>{parseFloat(item.tax_amount).toFixed(2)}</td>
                <td>{parseFloat(item.discount).toFixed(2)}</td>
                <td>{parseFloat(item.subtotal).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="text-end mt-3">
          <p><strong>Total:</strong> ${parseFloat(purchase.total_amount).toFixed(2)}</p>
          <p><strong>Paid:</strong> ${parseFloat(purchase.paid_amount).toFixed(2)}</p>
          <p><strong>Due:</strong> ${due}</p>
        </div>

        <div className="text-center mt-4">
          <p>Thank you for your business!</p>
          <button className="btn btn-primary" onClick={() => window.print()}>Print Receipt</button>
        </div>
      </div>
    </div>
  );
}

export default PurchasesReceipt;
