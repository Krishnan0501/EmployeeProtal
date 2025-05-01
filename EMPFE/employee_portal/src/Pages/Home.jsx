import React from 'react';
import "./Home.css";
import { Sidebar } from './SideBar';

export const Home = () => {
    return (
      <div className="app-container">
        <Sidebar setActiveSection={setActiveSection} />
        <MainContent activeSection={activeSection} />
      </div>
  )
}
