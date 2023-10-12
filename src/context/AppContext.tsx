"use client";

import { User, onAuthStateChanged } from 'firebase/auth';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../../firebase';

const defaultContextData = {
  user: null,
  setUser: () => {},
  userId: null,
  selectedRoom: null,
  setSelectedRoom: () => {},
};

type AppProviderProps = {
  children: ReactNode;
};

type AppContextType = {
  user: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  userId: string | null,
  selectedRoom: string | null,
  setSelectedRoom: React.Dispatch<React.SetStateAction<string | null>>
}

const AppContext = createContext<AppContextType>(defaultContextData);

export const AppProvider = ({ children }: AppProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (newUser) => {
      setUser(newUser);
      setUserId(newUser? newUser.uid : null);
    })

    return() => {
      unsubscribe();
    }
  },[]);

  return (
    <AppContext.Provider
      value={{ user, setUser, userId, selectedRoom, setSelectedRoom }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
}