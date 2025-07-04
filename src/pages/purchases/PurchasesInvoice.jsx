



import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

function PurchasesInvoice() {
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

                      if (purchase.status !== 'completed') return null;
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

                          <td>{purchase.status}</td>

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
                             
                              <NavLink to={`/pages/purchases/purchasesreceipt/show/${purchase.id}`} title="Receipt">
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

export default PurchasesInvoice
