import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import DashBoard from './dashboard/DashBoard';



import Brand from './pages/product/brand/Brand';
import AddBrand from './pages/product/brand/AddBrand';
import EditBrand from './pages/product/brand/EditBrand';
import CategoryList from './pages/product/category/CategoryList';
import AddCategorie from './pages/product/category/AddCategorie';
import EditCategorie from './pages/product/category/EditCategorie';
import SupplierList from './pages/supplier/SupplierList';
import AddSupplier from './pages/supplier/AddSupplier';
import EditSupplier from './pages/supplier/EditSupplier';
import WarehouseList from './pages/warehouse/warehouse/WarehouseList';
import EditWarehouse from './pages/warehouse/warehouse/EditWarehouse';
import AddWarehouse from './pages/warehouse/warehouse/AddWarehouse';
import ProductList from './pages/product/product/ProductList';
import AddProduct from './pages/product/product/AddProduct';
import EditProduct from './pages/product/product/EditProduct';
import ShowProduct from './pages/product/product/ShowProduct';
import PurchasesList from './pages/purchases/PurchasesList';
import AddPurchases from './pages/purchases/AddPurchases';
import ShowPurchases from './pages/purchases/ShowPurchases';
import EditPurchases from './pages/purchases/EditPurchases';
import StockList from './pages/stock/stock/StockList';
import StockTransferList from './pages/stock/stocktransfer/StockTransferList';
import StockTransfer from './pages/stock/stocktransfer/StockTransfer';
import CustomerList from './pages/customer/CustomerList';
import AddCustomer from './pages/customer/AddCustomer';
import EditCustomer from './pages/customer/EditCustomer';
import ExpanseCategorie from './pages/expense/ecpensecategorie/ExpanseCategorie';
import AddExpanseCategorie from './pages/expense/ecpensecategorie/AddExpanseCategorie';
import EditRxpenseCategorie from './pages/expense/ecpensecategorie/EditRxpenseCategorie';
import Expense from './pages/expense/expense/Expense';
import AddExpanse from './pages/expense/expense/AddExpanse';
import EditExpanse from './pages/expense/expense/EditExpanse';
import SalesList from './pages/sales/SalesList';
import Saleorder from './pages/sales/Saleorder';
import EditSale from './pages/sales/EditSale';
import ShowSales from './pages/sales/ShowSales';
import SaleInvoice from './pages/sales/SaleInvoice';
import Reciept from './pages/sales/Reciept';
import PurchasesInvoice from './pages/purchases/PurchasesInvoice';
import PurchasesReceipt from './pages/purchases/PurchasesReceipt';





function App() {
  return (
         <BrowserRouter basename="/Laravel_React/dist">
       {/* <BrowserRouter>  */}
      <Routes>
        <Route path='/' element={<MainLayout/>}>


           <Route index element={<DashBoard />} />
          
           <Route path='pages/product/brand' element={<Brand/>}/>
           <Route path='pages/product/brand/add' element={<AddBrand />} />
           <Route path='pages/product/brand/edit/:id' element={<EditBrand/>} />

           <Route path='pages/product/categorielist' element={<CategoryList/>}/>
           <Route path='pages/product/categorielist/add' element={<AddCategorie/>} />
           <Route path='pages/product/categorielist/edit/:id' element={<EditCategorie/>} />

           <Route path='pages/supplier/supplierlist'  element={<SupplierList/>}/>
           <Route path='pages/supplier/supplierlist/add' element={<AddSupplier/>} />
           <Route path='pages/supplier/supplierlist/edit/:id' element={<EditSupplier/>} />

           <Route path='pages/warehouse/warehouselist'  element={ <WarehouseList/>}/>
           <Route path='pages/warehouse/warehouselist/add' element={<AddWarehouse/>} />
           <Route path='pages/warehouse/warehouselist/edit/:id' element={ <EditWarehouse/>} />
           
           <Route path='pages/product/productlist'  element={ <ProductList/>}/>
           <Route path='pages/product/productlist/add'  element={ <AddProduct/>}/>
           <Route path='pages/product/productlist/edit/:id' element={ <EditProduct/>} />
           <Route path='pages/product/productlist/show/:id' element={ <ShowProduct/>} />

           <Route path='pages/purchases/productlist' element={ <PurchasesList/>} />
           <Route path='pages/purchases/productlist/add'  element={ <AddPurchases/>}/>
           <Route path='pages/purchases/productlist/show/:id' element={ <ShowPurchases/>} />
           <Route path='pages/purchases/productlist/edit/:id' element={ <EditPurchases/>} />
           <Route path='pages/purchases/purchasesinvoice' element={<PurchasesInvoice/>} />
           <Route path='pages/purchases/purchasesreceipt/show/:id' element={ <PurchasesReceipt/>} />

           <Route path='pages/stock/stocklist' element={ <StockList/>} />
          
           <Route path='pages/stocktransfer/stocktransferlist' element={ <StockTransferList/>} />
           <Route path='pages/stocktransfer/stocktransfer' element={<StockTransfer/>} />

           <Route path='pages/customer/customerlist' element={ <CustomerList/>} />
           <Route path='pages/customer/customerlist/add' element={ <AddCustomer/>} />
           <Route path='pages/customer/customerlist/edit/:id' element={ <EditCustomer/>} />
          
           <Route path='pages/expansecategorie/expansecategorielist' element={ <ExpanseCategorie/> } />
           <Route path='pages/expansecategorie/expansecategorielist/add' element={ <AddExpanseCategorie/> } />
           <Route path='pages/expansecategorie/expansecategorielist/edit/:id' element={ <EditRxpenseCategorie/> } />

           <Route path='pages/expanse/expanselist' element={ <Expense/> } />
           <Route path='pages/expanse/expanselist/add' element={ <AddExpanse/> } />
           <Route path='pages/expanse/expanse/edit/:id' element={ <EditExpanse/> } />

            <Route path='pages/sale/salelist' element={ <SalesList/> } />
            <Route path='pages/sale/saleorder' element={ <Saleorder/> } />
            <Route path='pages/sale/salelist/edit/:id' element={ <EditSale/> } />
            <Route path='pages/sale/salelist/show/:id' element={ <ShowSales/> } />
            <Route path='pages/sale/saleinvoice' element={ <SaleInvoice/> } />
            
            <Route path='pages/sale/receipt/show/:id' element={ <Reciept/> } />
            

        </Route>
      </Routes>
    </BrowserRouter>
  );
}


export default App;
