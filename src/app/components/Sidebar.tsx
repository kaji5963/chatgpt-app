'use client';

import {
  Timestamp,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { BiLogOut } from 'react-icons/bi';
import { db } from '../../../firebase';

type RoomType = {
  id: string;
  name: string;
  createdAt: Timestamp;
};

const Sidebar = () => {
  const [rooms, setRooms] = useState<RoomType[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const roomsCollectionRef = collection(db, 'rooms');
      const q = query(
        roomsCollectionRef,
        where('userId', '==', 'fKigMNvtgpY54HmVHN6VyArN4wG3'),
        orderBy('createdAt')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newRooms = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          createdAt: doc.data().createdAt,
        }));
        setRooms(newRooms);
      });

      return() => {
        unsubscribe();
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className=" bg-custom-blue h-full overflow-y-auto px-5 flex flex-col">
      <div className="flex-grow">
        <div className="cursor-pointer flex justify-evenly items-center border mt-2 rounded-md hover:bg-blue-800 duration-150">
          <span className="text-white p-4 text-xl">＋</span>
          <h1 className="text-white text-xs font-semibold p-4">New Chat</h1>
        </div>
        <ul>
          {rooms.map((room) => {
            return (
              <li
                key={room.id}
                className="cursor-pointer border-b p-4 text-slate-100 hover:bg-slate-700 duration-150"
              >
                {room.name}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="text-lg flex items-center justify-evenly mb-2 cursor-pointer pb-2 text-slate-100 hover:bg-slate-700 duration-150">
        <BiLogOut />
        <span>ログアウト</span>
      </div>
    </div>
  );
};

export default Sidebar;
