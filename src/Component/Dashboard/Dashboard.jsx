import React from 'react';
import Sidebar from './sidebar';
import TopBar from './TopBar';
import Widget from './Widget';
import { AiOutlineUser, AiOutlineDollar, AiOutlineCalendar } from 'react-icons/ai'; // Example icons
import 'react-calendar/dist/Calendar.css';

const Dashboard = () => {
  return (
    <div className="flex flex-row">
      <div className='flex'>
      <Sidebar />
      </div>
      <div className="flex-1 flex flex-col bg-gray-100 p-6 md:ml-44 ">
        <TopBar />
        <div className="grid md:grid-cols-3 gap-6 mb-6 mt-16">
        
          <Widget title="Total Products" value="products" icon={<AiOutlineUser />}  />
          <Widget title="Expiring Products" value="expiary" icon={<AiOutlineCalendar />}  />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
