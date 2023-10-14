'use client';

import { User, onAuthStateChanged } from 'firebase/auth';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { auth } from '../../firebase';
import { useRouter } from 'next/navigation';

const defaultContextData = {
  user: null,
  setUser: () => {},
  userId: null,
  selectedRoom: null,
  setSelectedRoom: () => {},
  selectRoomName: null,
  setSelectRoomName: () => {},
};

type AppProviderProps = {
  children: ReactNode;
};

type AppContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  userId: string | null;
  selectedRoom: string | null;
  setSelectedRoom: React.Dispatch<React.SetStateAction<string | null>>;
  selectRoomName: string | null;
  setSelectRoomName: React.Dispatch<React.SetStateAction<string | null>>;
};

const AppContext = createContext<AppContextType>(defaultContextData);

export const AppProvider = ({ children }: AppProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectRoomName, setSelectRoomName] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (newUser) => {
      setUser(newUser);
      setUserId(newUser ? newUser.uid : null);

      if (!newUser) {
        router.push('/auth/login');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        userId,
        selectedRoom,
        setSelectedRoom,
        selectRoomName,
        setSelectRoomName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
