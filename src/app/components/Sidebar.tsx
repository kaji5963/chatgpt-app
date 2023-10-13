'use client';

import {
  Timestamp,
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { BiLogOut } from 'react-icons/bi';
import { auth, db } from '../../../firebase';
import { useAppContext } from '@/context/AppContext';

type RoomType = {
  id: string;
  name: string;
  createdAt: Timestamp;
};

const Sidebar = () => {
  const [rooms, setRooms] = useState<RoomType[]>([]);

  const { user, userId, setSelectedRoom, selectedRoom } = useAppContext();

  useEffect(() => {
    if (user) {
      const fetchRooms = async () => {
        const roomsCollectionRef = collection(db, 'rooms');
        const q = query(
          roomsCollectionRef,
          where('userId', '==', userId),
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

        return () => {
          unsubscribe();
        };
      };

      fetchRooms();
    }
  }, [userId]);

  const selectRoom = (roomId: string) => {
    setSelectedRoom(roomId);
  };

  const addNewRoom = async () => {
    const roomName = prompt('ルーム名を入力してください');
    if (roomName) {
      const newRoomRef = collection(db, 'rooms');
      await addDoc(newRoomRef, {
        name: roomName,
        userId: userId,
        createdAt: serverTimestamp(),
      });
    }
  };

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div className=" bg-custom-blue h-full overflow-y-auto px-5 flex flex-col">
      <div className="flex-grow">
        <div
          onClick={addNewRoom}
          className="cursor-pointer flex justify-evenly items-center border mt-2 rounded-md hover:bg-blue-800 duration-150"
        >
          <span className="text-white p-4 text-xl">＋</span>
          <h1 className="text-white text-xs font-semibold p-4">New Chat</h1>
        </div>
        <ul>
          {rooms.map((room) => {
            return (
              <li
                key={room.id}
                className="cursor-pointer border-b p-4 text-slate-100 hover:bg-slate-700 duration-150"
                onClick={() => selectRoom(room.id)}
              >
                {room.name}
              </li>
            );
          })}
        </ul>
      </div>

      {user && (
        <div className="mb-2 p-4 text-slate-100 text-lg font-medium">
          {user.email}
        </div>
      )}
      <div className="text-lg flex items-center justify-evenly mb-2 cursor-pointer pb-2 text-slate-100 hover:bg-slate-700 duration-150">
        <BiLogOut />
        <span onClick={handleLogout}>ログアウト</span>
      </div>
    </div>
  );
};

export default Sidebar;
