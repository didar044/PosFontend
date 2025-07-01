import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

function PurchasesList() {
  const [purchasesData, setPurchasesData] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [openStatusId, setOpenStatusId] = useState(null);

  const fetchPurchases = async (page = 1) => {
    setLoading(false);
    try {
      const res = await fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/purchases?page=${page}`);
      const json = await res.json();
      setPurchasesData(json);
    } catch (error) {
      console.error('Failed to fetch purchases:', error);
      alert('Failed to load purchases');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  // const handleDelete = async (id) => {
  //   if (!window.confirm('Are you sure you want to delete this purchase?')) return;
  //   try {
  //     const res = await fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/purchases/${id}`, {
  //       method: 'DELETE',
  //     });
  //     if (res.ok) {
  //       fetchPurchases(purchasesData.current_page);
  //     } else {
  //       alert('Failed to delete purchase');
  //     }
  //   } catch (error) {
  //     console.error('Delete error:', error);
  //     alert('Failed to delete purchase');
  //   }
  // };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/purchases/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchPurchases(purchasesData.current_page);
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Status update error:', error);
      alert('Error updating status');
    }
  };
if (loading) return <p>Loading Purchase List...</p>;
  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h4>PURCHASE LIST</h4>
          <h6>Manage your purchases</h6>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table id="myTable" className="table datanew">
                <thead >
                  <tr>
                    <th><input type="checkbox" /></th>
                    <th>Id</th>
                    <th>Supplier</th>
                    <th>Warehouse</th>
                    <th>Reference</th>
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
                  {purchasesData.data.length === 0 ? (
                    <tr>
                      <td colSpan="12" className="text-center">No purchases found.</td>
                    </tr>
                  ) : (
                    purchasesData.data.map((purchase) => {
                      const due = (parseFloat(purchase.total_amount) - parseFloat(purchase.paid_amount)).toFixed(2);
                      const paymentStatus = parseFloat(purchase.paid_amount) >= parseFloat(purchase.total_amount)
                        ? 'Paid'
                        : 'Unpaid';

                      return (
                        <tr key={purchase.id}>
                          <td><input type="checkbox" /></td>
                          <td>{purchase.id}</td>
                          <td>{purchase.supplier?.name || `Nul`}</td>
                          <td>{purchase.warehouse?.name || `Nul`}</td>
                          <td>{purchase.reference || `Nul`}</td>
                          <td>{purchase.purchase_date}</td>

                          {/* Status column with 3 buttons toggle */}
                          <td style={{ minWidth: '160px' }}>
                            {openStatusId === purchase.id ? (
                              <div className="d-flex gap-1">
                                {['pending', 'completed', 'cancelled'].map((statusOption) => (
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
                                      handleStatusChange(purchase.id, statusOption);
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
                                  purchase.status === 'completed'
                                    ? 'btn-success'
                                    : purchase.status === 'cancelled'
                                    ? 'btn-danger'
                                    : 'btn-warning'
                                }`}
                                onClick={() => setOpenStatusId(purchase.id)}
                              >
                                {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                              </button>
                            )}
                          </td>

                          <td>{purchase.total_amount}</td>
                          <td>{purchase.paid_amount}</td>
                          <td>{due}</td>
                          <td>
                            <span className={`badges ${paymentStatus === 'Paid' ? 'bg-lightgreen' : 'bg-lightred'}`}>
                              {paymentStatus}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <NavLink to={`/pages/purchases/productlist/edit/${purchase.id}`} title="Edit">
                                <i className="bi bi-pencil-square" style={{ fontSize: 20 }}></i>
                              </NavLink>
    
                              
                              <NavLink to={`/pages/purchases/productlist/show/${purchase.id}`} title="View">
                                <i className="bi bi-eye" style={{ fontSize: 20 }}></i>
                              </NavLink>
                              {/* <button
                                onClick={() => handleDelete(purchase.id)}
                                className="btn border-0 bg-transparent"
                                title="Delete"
                              >
                                <img src="assets/img/icons/delete.svg" alt="Delete" />
                              </button> */}
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

export default PurchasesList;
