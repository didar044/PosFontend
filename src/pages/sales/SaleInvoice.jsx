


import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

function SaleInvoice() {
  const [salesData, setSalesData] = useState({ data: [] });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('http://didar.intelsofts.com/Laravel_React/B_POS/public/api/sales')
      .then(res => res.json())
      .then(data => {
        setSalesData({ data });
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch sales:', err);
        setLoading(false);
      });
  }, []);





  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h4>SALES LIST</h4>
          <h6>Manage your sales money receipt</h6>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="table datanew">
                <thead>
                  <tr>
                    <th><input type="checkbox" /></th>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Warehouse</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Due</th>
                    <th>Payment Status</th>
                    <th>Receipt</th>
                  </tr>
                </thead>
                <tbody>
  {salesData.data.length === 0 ? (
    <tr>
      <td colSpan="11" className="text-center">No sales found.</td>
    </tr>
  ) : (
    salesData.data.map(sale => {
      if (sale.status !== 'completed') return null;

      const due = (parseFloat(sale.total_amount) - parseFloat(sale.paid_amount)).toFixed(2);
      const paymentStatus = parseFloat(sale.paid_amount) >= parseFloat(sale.total_amount)
        ? 'Paid'
        : 'Unpaid';

      return (
        <tr key={sale.id}>
          <td><input type="checkbox" /></td>
          <td>{sale.id}</td>
          <td>{sale.customer?.name || 'N/A'}</td>
          <td>{sale.warehouse?.name || 'N/A'}</td>
          <td>{sale.sale_date}</td>
          <td>{sale.status}</td>
          <td>{sale.total_amount}</td>
          <td>{sale.paid_amount}</td>
          <td>{due}</td>
          <td>
            <span className={`badges ${paymentStatus === 'Paid' ? 'bg-lightgreen' : 'bg-lightred'}`}>
              {paymentStatus}
            </span>
          </td>
          <td>
            <div className="d-flex align-items-center gap-2">
              <NavLink to={`/pages/sale/receipt/show/${sale.id}`} title="Receipt">
                <i className="bi bi-receipt" style={{ fontSize: 20 }}></i>
              </NavLink>
            </div>
          </td>
        </tr>
      );
    })
  )}
</tbody>

              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SaleInvoice
