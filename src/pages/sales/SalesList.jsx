import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

function SalesList() {
  const [salesData, setSalesData] = useState({ data: [] });
  const [loading, setLoading] = useState(true);
  const [openStatusId, setOpenStatusId] = useState(null);

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

const handleStatusChange = async (id, newStatus) => {
  try {
    await fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/sales/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    // refetch sales after update
    const res = await fetch('http://didar.intelsofts.com/Laravel_React/B_POS/public/api/sales');
    const data = await res.json();
    setSalesData({ data });
  } catch (err) {
    console.error('Status update failed:', err);
  }
};

const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this sale?")) return;

  try {
    const res = await fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/sales/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error('Delete failed');

    // Remove deleted sale from state without refetching all
    setSalesData(prev => ({
      data: prev.data.filter(sale => sale.id !== id),
    }));
  } catch (err) {
    console.error('Delete failed:', err);
    alert('Failed to delete the sale.');
  }
};


  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h4>SALES LIST</h4>
          <h6>Manage your sales</h6>
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.data.length === 0 ? (
                    <tr>
                      <td colSpan="11" className="text-center">No sales found.</td>
                    </tr>
                  ) : (
                    salesData.data.map(sale => {
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

                          <td style={{ minWidth: '160px' }}>
                            {openStatusId === sale.id ? (
                              <div className="d-flex gap-1">
                                {['pending', 'completed', 'cancelled'].map(statusOption => (
                                  <button
                                    key={statusOption}
                                    className={`btn btn-sm ${
                                      statusOption === 'completed'
                                        ? 'btn-success'
                                        : statusOption === 'cancelled'
                                        ? 'btn-danger'
                                        : 'btn-warning'
                                    }`}
                                    onClick={() => {
                                      handleStatusChange(sale.id, statusOption);
                                      setOpenStatusId(null);
                                    }}
                                  >
                                    {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <button
                                className={`btn btn-sm ${
                                  sale.status === 'completed'
                                    ? 'btn-success'
                                    : sale.status === 'cancelled'
                                    ? 'btn-danger'
                                    : 'btn-warning'
                                }`}
                                onClick={() => setOpenStatusId(sale.id)}
                              >
                                {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                              </button>
                            )}
                          </td>

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
                              <NavLink to={`/pages/sale/salelist/edit/${sale.id}`} title="Edit">
                                <i className="bi bi-pencil-square" style={{ fontSize: 20 }}></i>
                              </NavLink>
                              <NavLink to={`/pages/sale/salelist/show/${sale.id}`} title="View">
                                <i className="bi bi-eye" style={{ fontSize: 20 }}></i>
                              </NavLink>
                              <button onClick={() => handleDelete(sale.id)} className="btn btn-link p-0">
                               <i className="bi bi-trash" style={{ fontSize: '20px', color: 'red' }}></i>
                               </button>
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

export default SalesList;
