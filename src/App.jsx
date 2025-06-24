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



function App() {
  return (
      //  <BrowserRouter basename="/Laravel_React/dist">
     <BrowserRouter> 
      <Routes>
        <Route path='/' element={<MainLayout/>}>


          <Route index element={<DashBoard />} />
          
           <Route path='pages/product/brand' element={<Brand/>}/>
           <Route path='pages/product/brand/add' element={<AddBrand />} />
           <Route path='pages/product/brand/edit/:id' element={<EditBrand/>} />

           <Route path='pages/product/categorielist' element={<CategoryList/>}/>
           <Route path='pages/product/categorielist/add' element={<AddCategorie/>} />
           <Route path='pages/product/categorielist/edit/:id' element={<EditCategorie/>} />
        

          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


export default App;
