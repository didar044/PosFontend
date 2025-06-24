import React from 'react';
import Preloader from './Preloader';
import { Header } from './Header';
import SideBar from './SideBar';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <>
      <Preloader/>
      <div className="main-wrapper">
        <Header />
        <SideBar />
        <div className="page-wrapper">
          <div className="content">
            <Outlet/>
          </div>
        </div>
      </div>
    </>
  )
}
