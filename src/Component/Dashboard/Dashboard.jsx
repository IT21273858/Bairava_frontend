import React from 'react';
import Sidebar from './sidebar';
import TopBar from './TopBar';
import Widget from './Widget';
import { AiOutlineUser, AiOutlineDollar, AiOutlineCalendar } from 'react-icons/ai'; // Example icons
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import TransportWidget from './TransportWidget';

const Dashboard = () => {
  return (
    <div className="flex flex-row">
      <div className='flex'>
      <Sidebar />
      </div>
      <div className="flex-1 flex flex-col bg-gray-100 p-6">
        <TopBar />
        <div className="grid grid-cols-3 gap-6 mb-6">
        
          <Widget title="Total Customers" value="230,000" icon={<AiOutlineUser />}  />
          {/* <div className='flex flex-col gap-2'>
          <Widget title="Revenue" value="$5M" icon={<AiOutlineDollar />} style={{ height: '150px', width: '350px' }}  />
          <TransportWidget title="Transport" value="75" icon={<AiOutlineCalendar />}  />
          </div> */}
            {/* <Calendar className="hidden md:block" style={ {left:'2px'}} /> */}
          {/* <Widget title="Travel Status" value="150" icon={<AiOutlineCalendar />} /> */}
          <Widget title="Accommodation" value="200" icon={<AiOutlineCalendar />}  />
          <Widget title="Reminders" value="50" icon={<AiOutlineCalendar />} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
