import React from 'react';
import { FaPaperPlane } from 'react-icons/fa';

const Chat = () => {
  return (
    <div className="bg-gray-500 h-full p-4 flex flex-col">
      <h1 className="text-2xl text-white font-semibold mb-4">Room1</h1>

      <div className="flex-grow overflow-y-auto mb-4">
        <div className="text-right">
          <div className="bg-blue-500 inline-block rounded px-4 py-2">
            <h1 className="text-white font-medium">hello</h1>
          </div>
        </div>

        <div className="text-left">
          <div className="bg-green-500 inline-block rounded px-4 py-2">
            <h1 className="text-white font-medium">how are you</h1>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 relative">
        <input
          type="text"
          placeholder="send a message"
          className="border-2 rounded w-full p-2 pr-10 focus:outline-none"
        />

        <button className='absolute inset-y-0 right-4 flex items-center'>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default Chat;
