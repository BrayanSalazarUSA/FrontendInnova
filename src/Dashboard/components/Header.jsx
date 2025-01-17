import React from 'react';

const Header = ({ category, title }) => (
  <div className="mb-2 pl-3">
    <p className="p-0 text-lg text-gray-400" style={{ fontFamily: 'lato' }}>{category}</p>
    <p className="p-0 text-3xl font-extrabold tracking-tight text-slate-900">
      {title}
    </p>
  </div>
);

export default Header;