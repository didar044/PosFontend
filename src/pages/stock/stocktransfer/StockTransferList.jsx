import React, { useEffect, useState } from 'react';

function StockTransferList() {
  const [stockTransfers, setStockTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetch('http://didar.intelsofts.com/Laravel_React/B_POS/public/api/stocktransfers')
      .then(res => res.json())
      .then(data => {
        setStockTransfers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching stock transfers:', err);
        setLoading(false);
      });
  }, []);

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'inprogress' ? 'completed' : 'inprogress';

    setUpdatingId(id);

    try {

        const res = await fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/stocktransfers/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setStockTransfers(prev =>
          prev.map(item =>
            item.id === id ? { ...item, status: newStatus } : item
          )
        );
        alert('Status updated successfully');
      } else {
        const errorData = await res.json();
        alert('Failed to update status: ' + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p>Loading stock transfers...</p>;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h4>Stock Transfer List</h4>
          <h6>Manage your stock movements</h6>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table datanew">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Image</th>
                  <th>From Warehouse</th>
                  <th>Address</th>
                  <th>To Warehouse</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Quantity</th>
                  
                  <th>Transfer Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stockTransfers.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="text-center">No stock transfers found</td>
                  </tr>
                ) : (
                  stockTransfers.map(stock => (
                    <tr key={stock.id}>
                      <td>{stock.id}</td>
                      <td>{stock.product?.name || 'N/A'}</td>
                      <td>
                        {stock.product ? (
                          <img
                            src={`http://didar.intelsofts.com/Laravel_React/B_POS/public/img/product/${stock.product.img || 'default.jpg'}`}
                            alt={stock.product.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                        ) : 'N/A'}
                      </td>
                      <td>{stock.from_warehouse?.name || 'N/A'}</td>
                      <td>{stock.from_warehouse?.location || 'N/A'}</td>
                      <td>{stock.to_warehouse?.name || 'N/A'}</td>
                      <td>{stock.to_warehouse?.location || 'N/A'}</td>
                      <td>
                        {stock.status === 'completed' ? (
                          <span className="badge sm bg-success">Completed</span>
                        ) : (
                          <span className="badge bg-warning">In Progress</span>
                        )}
                      </td>
                      <td>{stock.quantity}</td>
                      
                      <td>{stock.transfer_date}</td>
                      <td>
                        <button  style={{
                            padding: '2px 6px',
                            fontSize: '12px',
                            lineHeight: '1.9',
                          }}
                          disabled={updatingId === stock.id}
                          onClick={() => handleStatusChange(stock.id, stock.status)}
                          className={`btn btn-sm ${
                            stock.status === 'inprogress' ? 'btn-success': 'btn-warning' 
                          }`}
                        >
                          {stock.status === 'inprogress' ? 'Mark Completed' : 'Revert to In Progress'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockTransferList;
