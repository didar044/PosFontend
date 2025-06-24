import React from 'react';
import { NavLink } from 'react-router-dom';


function SideBar() {
  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-inner slimscroll">
        <div id="sidebar-menu" className="sidebar-menu">
          <ul>
            <li className="active">
              <NavLink to="./">
                <i className="bi bi-speedometer2"></i>
                <span>Dashboard</span>
              </NavLink>
            </li>

            <li className="submenu">
              <a href="javascript:void(0);">
                <i className='bx bx-cube'></i>
                <span>Product</span>
                <span className="menu-arrow"></span>
              </a>
              <ul>
                
                {/* <li><NavLink to="/">Product List</NavLink></li> */}
                <li><NavLink to="pages/product/brand">Brand </NavLink></li>
                 <li><NavLink to="pages/product/categorielist">Category List</NavLink></li>
                {/* <li><a href="addproduct.html">Add Product</a></li>
                
                <li><a href="addcategory.html">Add Category</a></li>
                <li><a href="subcategorylist.html">Sub Category List</a></li>
                <li><a href="subaddcategory.html">Add Sub Category</a></li> */}
                
                {/* <li><a href="addbrand.html">Add Brand</a></li>
                <li><a href="importproduct.html">Import Products</a></li>
                <li><a href="barcode.html">Print Barcode</a></li> */}
              </ul>
            </li>

            <li className="submenu">
              <a href="javascript:void(0);">
                <i class="fas fa-truck"></i> 
                <span>Supplier</span>
                <span className="menu-arrow"></span>
              </a>
              <ul>
                <li><NavLink to="/pages/supplier/supplierlist">Supplier  List</NavLink></li> 
                <li><NavLink to="/pages/supplier/supplierlist/add">Add Supplier </NavLink></li> 
                {/* <li><a href="pos.html">POS</a></li>
                <li><a href="pos.html">New Sales</a></li>
                <li><a href="salesreturnlists.html">Sales Return List</a></li>
                <li><a href="createsalesreturns.html">New Sales Return</a></li> */}
              </ul>
            </li>

           {/*<li className="submenu">
              <a href="javascript:void(0);">
                <img src="assets/img/icons/sales1.svg" alt="Sales" />
                <span>Sales</span>
                <span className="menu-arrow"></span>
              </a>
              <ul>
                <li><a href="saleslist.html">Sales List</a></li>
                <li><a href="pos.html">POS</a></li>
                <li><a href="pos.html">New Sales</a></li>
                <li><a href="salesreturnlists.html">Sales Return List</a></li>
                <li><a href="createsalesreturns.html">New Sales Return</a></li>
              </ul>
            </li>

            <li className="submenu">
              <a href="javascript:void(0);">
                <img src="assets/img/icons/purchase1.svg" alt="Purchase" />
                <span>Purchase</span>
                <span className="menu-arrow"></span>
              </a>
              <ul>
                <li><a href="purchaselist.html">Purchase List</a></li>
                <li><a href="addpurchase.html">Add Purchase</a></li>
                <li><a href="importpurchase.html">Import Purchase</a></li>
              </ul>
            </li>

            <li className="submenu">
              <a href="javascript:void(0);">
                <img src="assets/img/icons/expense1.svg" alt="Expense" />
                <span>Expense</span>
                <span className="menu-arrow"></span>
              </a>
              <ul>
                <li><a href="expenselist.html">Expense List</a></li>
                <li><a href="createexpense.html">Add Expense</a></li>
                <li><a href="expensecategory.html">Expense Category</a></li>
              </ul>
            </li>

            <li className="submenu">
              <a href="javascript:void(0);">
                <img src="assets/img/icons/quotation1.svg" alt="Quotation" />
                <span>Quotation</span>
                <span className="menu-arrow"></span>
              </a>
              <ul>
                <li><a href="quotationList.html">Quotation List</a></li>
                <li><a href="addquotation.html">Add Quotation</a></li>
              </ul>
            </li>

            <li className="submenu">
              <a href="javascript:void(0);">
                <img src="assets/img/icons/transfer1.svg" alt="Transfer" />
                <span>Transfer</span>
                <span className="menu-arrow"></span>
              </a>
              <ul>
                <li><a href="transferlist.html">Transfer List</a></li>
                <li><a href="addtransfer.html">Add Transfer</a></li>
                <li><a href="importtransfer.html">Import Transfer</a></li>
              </ul>
            </li>

            <li className="submenu">
              <a href="javascript:void(0);">
                <img src="assets/img/icons/return1.svg" alt="Return" />
                <span>Return</span>
                <span className="menu-arrow"></span>
              </a>
              <ul>
                <li><a href="salesreturnlist.html">Sales Return List</a></li>
                <li><a href="createsalesreturn.html">Add Sales Return</a></li>
                <li><a href="purchasereturnlist.html">Purchase Return List</a></li>
                <li><a href="createpurchasereturn.html">Add Purchase Return</a></li>
              </ul>
            </li>

            <li className="submenu">
              <a href="javascript:void(0);">
                <img src="assets/img/icons/users1.svg" alt="People" />
                <span>People</span>
                <span className="menu-arrow"></span>
              </a>
              <ul>
                <li><a href="customerlist.html">Customer List</a></li>
                <li><a href="addcustomer.html">Add Customer</a></li>
                <li><a href="supplierlist.html">Supplier List</a></li>
                <li><a href="addsupplier.html">Add Supplier</a></li>
                <li><a href="userlist.html">User List</a></li>
                <li><a href="adduser.html">Add User</a></li>
                <li><a href="storelist.html">Store List</a></li>
                <li><a href="addstore.html">Add Store</a></li>
              </ul>
            </li>

            <li className="submenu">
              <a href="javascript:void(0);">
                <img src="assets/img/icons/places.svg" alt="Places" />
                <span>Places</span>
                <span className="menu-arrow"></span>
              </a>
              <ul>
                <li><a href="newcountry.html">New Country</a></li>
                <li><a href="countrieslist.html">Countries List</a></li>
                <li><a href="newstate.html">New State</a></li>
                <li><a href="statelist.html">State List</a></li>
              </ul>
            </li>

            <li>
              <a href="components.html">
                <i data-feather="layers"></i>
                <span>Components</span>
              </a>
            </li>

            <li>
              <a href="blankpage.html">
                <i data-feather="file"></i>
                <span>Blank Page</span>
              </a>
            </li>

            <li className="submenu">
              <a href="javascript:void(0);">
                <i data-feather="alert-octagon"></i>
                <span>Error Pages</span>
                <span className="menu-arrow"></span>
              </a>
              <ul>
                <li><a href="error-404.html">404 Error</a></li>
                <li><a href="error-500.html">500 Error</a></li>
              </ul>
            </li>

            <li className="submenu">
              <a href="javascript:void(0);">
                <i data-feather="bar-chart-2"></i>
                <span>Charts</span>
                <span className="menu-arrow"></span>
              </a>
              <ul>
                <li><a href="chart-apex.html">Apex Charts</a></li>
                <li><a href="chart-js.html">Chart Js</a></li>
                <li><a href="chart-morris.html">Morris Charts</a></li>
                <li><a href="chart-flot.html">Flot Charts</a></li>
                <li><a href="chart-peity.html">Peity Charts</a></li>
              </ul>
            </li>

            <li className="submenu">
              <a href="javascript:void(0);">
                <img src="assets/img/icons/time.svg" alt="Report" />
                <span>Report</span>
                <span className="menu-arrow"></span>
              </a>
              <ul>
                <li><a href="purchaseorderreport.html">Purchase Order Report</a></li>
                <li><a href="inventoryreport.html">Inventory Report</a></li>
                <li><a href="salesreport.html">Sales Report</a></li>
                <li><a href="invoicereport.html">Invoice Report</a></li>
                <li><a href="purchasereport.html">Purchase Report</a></li>
                <li><a href="supplierreport.html">Supplier Report</a></li>
                <li><a href="customerreport.html">Customer Report</a></li>
              </ul>
            </li>

            <li className="submenu">
              <a href="javascript:void(0);">
                <img src="assets/img/icons/settings.svg" alt="Settings" />
                <span>Settings</span>
                <span className="menu-arrow"></span>
              </a>
              <ul>
                <li><a href="generalsettings.html">General Settings</a></li>
                <li><a href="emailsettings.html">Email Settings</a></li>
                <li><a href="paymentsettings.html">Payment Settings</a></li>
                <li><a href="currencysettings.html">Currency Settings</a></li>
                <li><a href="grouppermissions.html">Group Permissions</a></li>
                <li><a href="taxrates.html">Tax Rates</a></li>
              </ul>
            </li> */}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
