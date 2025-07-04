import React from 'react';
import { useEffect, useState } from 'react';


function DashBoard() {

  //  const [loading, setLoading] = useState(false);

    const [dashboardData, setDashboardData] = useState({
    totalpurchase: 0,
    totalpurchasedue: 0,
    totalsale: 0,
    totalsaledue: 0,
    customers: 0,
    suppliers: 0,
    purchaseinvoice: 0,
    saleinvoice: 0,
  });

  useEffect(() => {
    fetch("http://didar.intelsofts.com/Laravel_React/B_POS/public/api/dashboards")
      .then((res) => res.json())
      .then((data) => setDashboardData(data))
      .catch((err) => console.error("Dashboard API error:", err));
  }, []);


  const [products, setProducts] = useState([]);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://didar.intelsofts.com/Laravel_React/B_POS/public/api/products');
        const result = await response.json();

        if (Array.isArray(result.data)) {
          // Get the first 4 products from the 'data' field
          setProducts(result.data.slice(-4));
        } else {
          console.error('Unexpected API format:', result);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);
console.log(products);
  
  if (products.length === 0) return <p>Loading Purchase List...</p>;
  return (
    <>
      <div className="row">
        <div className="col-lg-3 col-sm-6 col-12">
          <div className="dash-widget">
            <div className="dash-widgetimg">
              <span>
                  <i className="bi-credit-card" style={{color:'#070738',fontSize:'20px'}}></i> 
              </span>
            </div>
            <div className="dash-widgetcontent">
              <h5>
                $ <span className="counters" >
                  {dashboardData.totalpurchase.toLocaleString()}
                </span>
              </h5>
              <h6>Total Purchase </h6>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-sm-6 col-12">
          <div className="dash-widget dash1">
            <div className="dash-widgetimg">
              <span>
                <i className=" bi bi-cash-coin me-2" style={{color:'green',fontSize:'20px'}}></i>
              </span>
            </div>
            <div className="dash-widgetcontent">
              <h5>
                $ <span className="counters" >{dashboardData.totalpurchasedue.toLocaleString()}</span>
              </h5>
              <h6>     Total Purchase Due </h6>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6 col-12">
          <div className="dash-widget dash3">
            <div className="dash-widgetimg">
              <span>
                
                <i className="bi bi-cash-stack me-2" style={{color:'orange',fontSize:'20px'}} ></i>
              </span>
            </div>
            <div className="dash-widgetcontent">
              <h5>
                $ <span className="counters" >{dashboardData.totalsale.toLocaleString()}</span>
              </h5>
              <h6>Total Sales</h6>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6 col-12">
          <div className="dash-widget dash2">
            <div className="dash-widgetimg">
              <span>
                <i className=" bi bi-coin me-2" style={{color:'#173317', fontSize:'20px'}} ></i>
              </span>
            </div>
            <div className="dash-widgetcontent">
              <h5>
                {/* $ <span className="counters" data-count="{dashboardData.totalsaledue.toLocaleString()}">{dashboardData.totalsaledue.toLocaleString()}</span> */}
               $ <span className="counters" >{dashboardData.totalsaledue.toLocaleString()}</span>
              </h5>
              <h6>Total Sale Due</h6>
            </div>
          </div>
        </div>
        

        <div className="col-lg-3 col-sm-6 col-12 d-flex">
          <div className="dash-count">
            <div className="dash-counts">
              <h4>{dashboardData.customers.toLocaleString()}</h4>
              <h5>Customers</h5>
            </div>
            <div className="dash-imgs">
              <i className="bi bi-person " style={{fontSize:'50px'}}></i>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6 col-12 d-flex">
          <div className="dash-count das1">
            <div className="dash-counts">
              <h4>{dashboardData.suppliers.toLocaleString()}</h4>
              <h5>Suppliers</h5>
            </div>
            <div className="dash-imgs">
              <i className="bi bi-person-check-fill" style={{fontSize:'50px'}}></i>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6 col-12 d-flex">
          <div className="dash-count das2">
            <div className="dash-counts">
              <h4>{dashboardData.purchaseinvoice.toLocaleString()}</h4>
              <h5>Purchase Invoice</h5>
            </div>
            <div className="dash-imgs">
              <i class="bi bi-receipt" style={{fontSize:'50px'}}></i>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6 col-12 d-flex">
          <div className="dash-count das3">
            <div className="dash-counts">
              <h4>{dashboardData.saleinvoice.toLocaleString()}</h4>
              <h5>Sales Invoice</h5>
            </div>
            <div className="dash-imgs">
              <i class="bi bi-file-earmark" style={{fontSize:'50px'}}></i>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-7 col-sm-12 col-12 d-flex">
          <div className="card flex-fill">
            <div className="card-header pb-0 d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Purchase &amp; Sales</h5>
              <div className="graph-sets">
                <ul>
                  <li>
                    <span>Sales</span>
                  </li>
                  <li>
                    <span>Purchase</span>
                  </li>
                </ul>
                <div className="dropdown">
                  <button
                    className="btn btn-white btn-sm dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    2022
                    <img
                      src="assets/img/icons/dropdown.svg"
                      alt="img"
                      className="ms-2"
                    />
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <li>
                      <a href="javascript:void(0);" className="dropdown-item">
                        2022
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0);" className="dropdown-item">
                        2021
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0);" className="dropdown-item">
                        2020
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div id="sales_charts" />
            </div>
          </div>
        </div>


        <div className="col-lg-5 col-sm-12 col-12 d-flex">
          <div className="card flex-fill">
            <div className="card-header pb-0 d-flex justify-content-between align-items-center">
              <h4 className="card-title mb-0">Recently Added Products</h4>
              <div className="dropdown">
                <a href="#" data-bs-toggle="dropdown" className="dropset">
                  <i className="fa fa-ellipsis-v"></i>
                </a>
                <ul className="dropdown-menu">
                  <li><a href="/productlist" className="dropdown-item">Product List</a></li>
                  <li><a href="/addproduct" className="dropdown-item">Product Add</a></li>
                </ul>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive dataview">
                <table className="table datatable">
                  <thead>
                    <tr>
                      <th>Sno</th>
                      <th>Products</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <tr key={product.id}>
                        <td>{index + 1}</td>
                        <td className="productimgname">
                          
                            <img
                              src={`http://didar.intelsofts.com/Laravel_React/B_POS/public/img/product/${product.img}`}
                              alt={product.name}
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                          
                          {product.name}
                        </td>
                        <td>${product.price}</td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr><td colSpan="3" className="text-center">No recent products found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-0">
        <div className="card-body">
          <h4 className="card-title">Expired Products</h4>
          <div className="table-responsive dataview">
            <table className="table datatable">
              <thead>
                <tr>
                  <th>SNo</th>
                  <th>Product Code</th>
                  <th>Product Name</th>
                  <th>Brand Name</th>
                  <th>Category Name</th>
                  <th>Expiry Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td><a href="#">IT0001</a></td>
                  <td className="productimgname">
                    <a className="product-img" href="productlist.html">
                      <img src="assets/img/product/product2.jpg" alt="product" />
                    </a>
                    <a href="productlist.html">Orange</a>
                  </td>
                  <td>N/D</td>
                  <td>Fruits</td>
                  <td>12-12-2022</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td><a href="#">IT0002</a></td>
                  <td className="productimgname">
                    <a className="product-img" href="productlist.html">
                      <img src="assets/img/product/product3.jpg" alt="product" />
                    </a>
                    <a href="productlist.html">Pineapple</a>
                  </td>
                  <td>N/D</td>
                  <td>Fruits</td>
                  <td>25-11-2022</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td><a href="#">IT0003</a></td>
                  <td className="productimgname">
                    <a className="product-img" href="productlist.html">
                      <img src="assets/img/product/product4.jpg" alt="product" />
                    </a>
                    <a href="productlist.html">Strawberry</a>
                  </td>
                  <td>N/D</td>
                  <td>Fruits</td>
                  <td>19-11-2022</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td><a href="#">IT0004</a></td>
                  <td className="productimgname">
                    <a className="product-img" href="productlist.html">
                      <img src="assets/img/product/product5.jpg" alt="product" />
                    </a>
                    <a href="productlist.html">Avocado</a>
                  </td>
                  <td>N/D</td>
                  <td>Fruits</td>
                  <td>20-11-2022</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashBoard;
