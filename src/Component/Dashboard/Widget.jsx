import React from 'react';

const Widget = ({ title, value, icon, style }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow" style={style}>
      <div className="flex items-center">
        <div className="text-purple-600 text-2xl mr-4">{icon}</div>
        <div>
          <h2 className="font-bold text-purple-600">{title}</h2>
          <p className="text-3xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default Widget;
