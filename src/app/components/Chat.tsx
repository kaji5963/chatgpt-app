'use client';

import {
  Timestamp,
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { db } from '../../../firebase';
import { useAppContext } from '@/context/AppContext';
import LoadingIcons from 'react-loading-icons';
import OpenAI from 'openai';

type MessageType = {
  text: string;
  sender: string;
  createdAt: Timestamp;
};

const Chat = () => {
  const [inputMessage, setInputMessage] = useState<string>('');
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { selectedRoom, selectRoomName } = useAppContext();

  const scrollRef = useRef<HTMLDivElement>(null);

  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPEN_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  useEffect(() => {
    if (selectedRoom) {
      const fetchMessage = async () => {
        const roomDocRef = doc(db, 'rooms', selectedRoom);

        const messageCollectionRef = collection(roomDocRef, 'messages');

        const q = query(messageCollectionRef, orderBy('createdAt'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const newMessages = snapshot.docs.map(
            (doc) => doc.data() as MessageType
          );
          setMessages(newMessages);
        });

        return () => {
          unsubscribe();
        };
      };
      fetchMessage();
    }
  }, [selectedRoom]);

  useEffect(() => {
    if (scrollRef.current) {
      const element = scrollRef.current;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: 'smooth',
      });
    }
  });

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const messageData = {
      text: inputMessage,
      sender: 'user',
      createdAt: serverTimestamp(),
    };

    const roomDocRef = doc(db, 'rooms', selectedRoom!);
    const messageCollectionRef = collection(roomDocRef, 'messages');
    await addDoc(messageCollectionRef, messageData);

    setInputMessage('');
    setIsLoading(true);

    const gptResponse = await openai.chat.completions.create({
      messages: [{ role: 'user', content: inputMessage }],
      model: 'gpt-3.5-turbo-0301',
    });
    const botResponse = gptResponse.choices[0].message.content;

    setIsLoading(false);

    await addDoc(messageCollectionRef, {
      text: botResponse,
      sender: 'bot',
      createdAt: serverTimestamp(),
    });
  };

  return (
    <div className="bg-gray-500 h-full p-4 flex flex-col">
      <h1 className="text-2xl text-white font-semibold mb-4">
        {selectRoomName}
      </h1>

      <div className="flex-grow overflow-y-auto mb-4" ref={scrollRef}>
        {messages.map((message, index) => {
          return (
            <div
              key={index}
              className={message.sender === 'user' ? 'text-right' : 'text-left'}
            >
              <div
                className={
                  message.sender === 'user'
                    ? 'bg-blue-500 inline-block rounded px-4 py-2'
                    : 'bg-green-500 inline-block rounded px-4 py-2'
                }
              >
                <p className="text-white">{message.text}</p>
              </div>
            </div>
          );
        })}
        {isLoading && <LoadingIcons.SpinningCircles />}
      </div>

      <div className="flex-shrink-0 relative">
        <input
          type="text"
          placeholder="send a message"
          className="border-2 rounded w-full p-2 pr-10 focus:outline-none"
          value={inputMessage}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInputMessage(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
        />

        <button
          className="absolute inset-y-0 right-4 flex items-center"
          onClick={() => sendMessage()}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default Chat;
