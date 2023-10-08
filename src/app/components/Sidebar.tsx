import React from 'react';
import { BiLogOut } from 'react-icons/bi';

const Sidebar = () => {
  return (
    <div className=" bg-custom-blue h-full overflow-y-auto px-5 flex flex-col">
      <div className="flex-grow">
        <div className="cursor-pointer flex justify-evenly items-center border mt-2 rounded-md hover:bg-blue-800 duration-150">
          <span className="text-white p-4 text-xl">＋</span>
          <h1 className="text-white text-xs font-semibold p-4">New Chat</h1>
        </div>
        <ul className="cursor-pointer border-b p-4 text-slate-100 hover:bg-slate-700 duration-150">
          <li>Room 1</li>
        </ul>
        <ul className="cursor-pointer border-b p-4 text-slate-100 hover:bg-slate-700 duration-150">
          <li>Room 2</li>
        </ul>
        <ul className="cursor-pointer border-b p-4 text-slate-100 hover:bg-slate-700 duration-150">
          <li>Room 3</li>
        </ul>
      </div>

      <div className='text-lg flex items-center justify-evenly mb-2 cursor-pointer pb-2 text-slate-100 hover:bg-slate-700 duration-150'>
        <BiLogOut />
        <span>ログアウト</span>
      </div>
    </div>
  );
};

export default Sidebar;
