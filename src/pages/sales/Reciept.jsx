import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import './Reciept.css';
function Reciept() {
  const { id } = useParams(); // Get :id from URL
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.error('No ID provided in URL');
      navigate('/pages/sale/salelist'); // fallback if ID missing
      return;
    }

    console.log("Fetching sale receipt for ID:", id);

    fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/sales/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Sale not found");
        return res.json();
      })
      .then(data => {
        setSale(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load sale:', err);
        setLoading(false);
      });
  }, [id, navigate]);

  if (loading) return <p className="text-center">Loading receipt...</p>;
  if (!sale) return <p className="text-danger text-center">Receipt not found.</p>;

  const due = (parseFloat(sale.total_amount) - parseFloat(sale.paid_amount)).toFixed(2);

  return (
    <div>
       <div className="col-lg-12 mt-3">
                   
                    <NavLink to="/pages/sale/saleinvoice" className="btn btn-submit">Back</NavLink>
                  </div>
    <div className="receipt-wrapper container p-4" style={{ maxWidth: 800, margin: '0 auto' }}>
      <h2 className="text-center mb-3">Money Receipt</h2>

      {/* Company Info */}
      <div className="mb-4 text-center">
        <h4>Fatehabad POS</h4>
        <p>123 Education Lane
          Cityville, ST 45678
          </p>
        <p>Email: info@fatehabad.com | Phone: 01234567890</p>
      </div>

      {/* Header Info */}
      <div className="d-flex justify-content-between mb-3">
        <div>
          <h5>Customer Info</h5>
          <p><strong>Name:</strong> {sale.customer?.name}</p>
          <p><strong>Phone:</strong> {sale.customer?.phone}</p>
          <p><strong>Address:</strong> {sale.customer?.address}</p>
        </div>
        <div>
          <p><strong>Receipt No:</strong> {sale?.id ? `SL${sale.id.toString().padStart(4, '0')}` : 'SL0000'}</p>
          <p><strong>Date:</strong> {sale.sale_date}</p>
          <p><strong>Payment Method:</strong> {sale.payment_method}</p>
        </div>
      </div>

      {/* Sale Items Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Product ID</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {sale.items.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.product_id}</td>
              <td>{item.quantity}</td>
              <td>{parseFloat(item.unit_price).toFixed(2)}</td>
              <td>{parseFloat(item.subtotal).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="text-end">
        <p><strong>Total:</strong> ${parseFloat(sale.total_amount).toFixed(2)}</p>
        <p><strong>Paid:</strong> ${parseFloat(sale.paid_amount).toFixed(2)}</p>
        <p><strong>Due:</strong> ${due}</p>
        
      </div>

      <div className="text-center mt-4">
        <p>Thank you for your purchase!</p>
        <button className="btn btn-primary" onClick={() => window.print()}>Print Receipt</button>
      </div>
    </div>
    </div>
  );
}

export default Reciept;
