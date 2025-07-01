import React, { useEffect, useState } from 'react';

function StockList() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://didar.intelsofts.com/Laravel_React/B_POS/public/api/stocks')
      .then(res => res.json())
      .then(data => {
        setStocks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch stocks:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading stocks...</p>;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h4>Stock List</h4>
          <h6>Manage your Stock</h6>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table datanew">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product Name</th>
                  <th>Image</th>
                  <th>Warehouse Name</th>
                  <th>Address</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {stocks.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">No stocks found</td>
                  </tr>
                ) : (
                  stocks.map(stock => (
                    <tr key={stock.id}>
                      <td>{stock.id}</td>
                      <td>{stock.product ? stock.product.name : 'N/A'}</td>
                       <td>
                            {stock.product ? (
                            <img
                                src={`http://didar.intelsofts.com/Laravel_React/B_POS/public/img/product/${stock.product.img}`}
                                alt={stock.product.name}
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                            ) : (
                            'N/A'
                            )}
                        </td>
                      <td>{stock.warehouse ? stock.warehouse.name : 'N/A'}</td>
                      <td>{stock.warehouse ? stock.warehouse.location : 'N/A'}</td>
                      <td>{stock.quantity}</td>
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

export default StockList;
