import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Show.css';

function ShowPurchases() {
  const { id } = useParams();
  const [purchase, setPurchase] = useState(null);

  useEffect(() => {
    fetch(`http://didar.intelsofts.com/Laravel_React/B_POS/public/api/purchases/${id}`)
      .then(res => res.json())
      .then(data => setPurchase(data))
      .catch(err => console.error('Error fetching purchase data:', err));
  }, [id]);

  if (!purchase) return <div>Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h4>Purchase Details</h4>
          <h6>View purchase invoice</h6>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="card-sales-split">
            <h2>Purchase Id : {purchase.id}</h2>
            <ul>
              {/* <li><a href="#"><img src="/assets/img/icons/edit.svg" alt="edit" /></a></li>
              <li><a href="#"><img src="/assets/img/icons/pdf.svg" alt="pdf" /></a></li>
              <li><a href="#"><img src="/assets/img/icons/excel.svg" alt="excel" /></a></li> */}
              <li><a href="#"><img src="/assets/img/icons/printer.svg" alt="print" /></a></li>
            </ul>
          </div>

          {/* Invoice Info Section */}
          <div className="invoice-box table-height" style={{ overflow: 'auto' }}>
            <table style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <td colSpan="6">
                    <table style={{ width: '100%' }}>
                      <tbody>
                        <tr>
                          {/* Supplier Info */}
                          <td style={{ padding: '10px' }}>
                            <h5 style={{ color: '#7367f0' }}>Supplier Info</h5>
                            <div>{purchase.supplier?.name}</div>
                            <div>{purchase.supplier?.email}</div>
                            <div>{purchase.supplier?.phone}</div>
                            <div>{purchase.supplier?.address}</div>
                          </td>
                          {/* Warehouse Info */}
                          <td style={{ padding: '10px' }}>
                            <h5 style={{ color: '#7367f0' }}>Warehouse Info</h5>
                            <div>{purchase.warehouse?.name}</div>
                            <div>{purchase.warehouse?.location}</div>
                          </td>
                          {/* Purchase Info */}
                          <td style={{ padding: '10px' }}>
                            <h5 style={{ color: '#7367f0' }}>Invoice Info</h5>
                            <div>Invoice No: {purchase.id}</div>
                            <div>Ref: {purchase.reference}</div>
                            <div>Status: {purchase.status}</div>
                            <div>Date: {purchase.purchase_date}</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                {/* Table Header */}
                <tr style={{ backgroundColor: '#f3f2f7' }}>
                  <td>Product Id</td>
                  <td>Product</td>
                  <td>QTY</td>
                  <td>Unit Price</td>
                  <td>Discount</td>
                  <td>Tax</td>
                  <td>Subtotal</td>
                </tr>

                {/* Purchase Items */}
                {purchase.items?.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td>{item.product?.id}</td>
                    <td style={{ display: 'flex', alignItems: 'center' }}>
                      <img
                        src={`http://didar.intelsofts.com/Laravel_React/B_POS/public/img/product/${item.product?.img}`}
                        alt="product"
                        style={{ width: '60px', height: '60px', marginRight: '10px' }}
                      />
                      {item.product?.name}
                    </td>
                    <td>{item.quantity}</td>
                    <td>{item.unit_price}</td>
                    <td>{item.discount}</td>
                    <td>{item.tax_amount}</td>
                    <td>{item.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="row mt-4">
            <div className="col-lg-6">
              <ul>
                <li><strong>Order Tax:</strong> ${purchase.items?.reduce((sum, i) => sum + parseFloat(i.tax_amount), 0).toFixed(2)}</li>
                <li><strong>Discount:</strong> ${purchase.items?.reduce((sum, i) => sum + parseFloat(i.discount), 0).toFixed(2)}</li>
              </ul>
            </div>
            <div className="col-lg-6 text-end">
              <ul>
                <li><strong>Shipping:</strong> $0.00</li>
                <li><strong>Grand Total:</strong> ${purchase.total_amount}</li>
                <li><strong>Paid:</strong> ${purchase.paid_amount}</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="col-lg-12 mt-3">
            {/* <button className="btn btn-submit me-2">Update</button> */}
            <button className="btn btn-cancel">Back</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowPurchases;
