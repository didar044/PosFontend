import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom'; // assuming dynamic route like /sales/:id

function ShowSales() {
  const { id } = useParams(); // get sale id from URL
  const [sale, setSale] = useState(null);

  useEffect(() => {
    fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/sales/${id}`)
      .then(res => res.json())
      .then(data => setSale(data))
      .catch(err => console.error('Error fetching sale:', err));
  }, [id]);

  if (!sale) return <div>Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h4>Sale Details</h4>
          <h6>View sale details</h6>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="card-sales-split">
            <h2>Sale Detail : SL{sale.id.toString().padStart(4, '0')}</h2>
          </div>

          <div className="invoice-box table-height" style={{ maxWidth: '1600px', overflow: 'auto' }}>
            <table style={{ width: '100%', lineHeight: 'inherit', textAlign: 'left' }}>
              <tbody>
                <tr className="top">
                  <td colSpan="6">
                    <table style={{ width: '100%' }}>
                      <tbody>
                        <tr>
                          {/* Customer Info */}
                          <td>
                            <h5 style={{ color: '#7367f0' }}>Customer Info</h5>
                            <p>{sale.customer?.name || 'Walk-in-customer'}</p>
                            <p>{sale.customer?.email || 'N/A'}</p>
                            <p>{sale.customer?.phone}</p>
                            <p>{sale.customer?.address}</p>
                          </td>

                          {/* Company Info (Static) */}
                          <td>
                            <h5 style={{ color: '#7367f0' }}>Company Info</h5>
                            <p>DGT</p>
                            <p>company@email.com</p>
                            <p>6315996770</p>
                            <p>3618 Abia Martin Drive</p>
                          </td>

                          {/* Invoice Info */}
                          <td>
                            <h5 style={{ color: '#7367f0' }}>Invoice Info</h5>
                            <p>Reference</p>
                            <p>{sale.payment_method}</p>
                            <p>{sale.status}</p>
                          </td>

                          {/* Invoice Code */}
                          <td style={{ textAlign: 'right' }}>
                            <h5>&nbsp;</h5>
                            <p>SL{sale.id.toString().padStart(4, '0')}</p>
                            <p style={{ color: '#2e7d32' }}>
                              {sale.paid_amount >= sale.total_amount ? 'Paid' : 'Unpaid'}
                            </p>
                            <p style={{ color: '#2e7d32' }}>{sale.status}</p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                {/* Table Header */}
                <tr className="heading" style={{ background: '#f3f2f7' }}>
                  <td>Product Name</td>
                  <td>QTY</td>
                  <td>Price</td>
                  <td>Discount</td>
                  <td>Tax</td>
                  <td>Subtotal</td>
                </tr>

                {/* Sale Items */}
                {sale.items?.map((item, index) => (
                  <tr key={index} className="details" style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td>{`Product #${item.product_id}`}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unit_price}</td>
                    <td>0.00</td>
                    <td>0.00</td>
                    <td>{item.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="row mt-4">
            <div className="col-lg-6">
              <ul className="total-order">
                <li>
                  <h4>Order Tax</h4>
                  <h5>$ 0.00 (0.00%)</h5>
                </li>
                <li>
                  <h4>Discount</h4>
                  <h5>$ 0.00</h5>
                </li>
              </ul>
            </div>
            <div className="col-lg-6">
              <ul className="total-order">
                <li>
                  <h4>Shipping</h4>
                  <h5>$ 0.00</h5>
                </li>
                <li className="total">
                  <h4>Grand Total</h4>
                  <h5>${sale.total_amount}</h5>
                </li>
              </ul>
            </div>
            <div className="col-lg-6"   > 
               <ul style={{color:'green'}}>
                <li >
                  <h2>Paid Amount </h2>
                    <h3>${sale.paid_amount}</h3>
                    </li>
               </ul>
              
            </div>
            <div className="col-lg-12 mt-3">
             
              <NavLink to="/pages/sale/salelist" className="btn btn-submit">Back</NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowSales; 