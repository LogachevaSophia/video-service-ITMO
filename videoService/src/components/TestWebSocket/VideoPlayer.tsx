import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { baseURL } from '../../API/axiosConfig';

const socket = io(baseURL);

interface VideoProps {
  roomId: string | undefined;
}

export const VideoPlayer: React.FC<VideoProps> = ({ roomId }) => {
  const [videoAction, setVideoAction] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Присоединение к комнате
    if (roomId) {
      console.log(`Joining room: ${roomId}`);
      socket.emit('join_room', roomId);
    }

    // Обработка синхронизации видео (старт/стоп)
    const handleVideoAction = (data: { action: string }) => {
      console.log(`Video action received: ${data.action}`);
      setVideoAction(data.action);

      if (videoRef.current) {
        // Проверяем текущее состояние видео перед вызовом play или pause
        if (data.action === 'start') {
          videoRef.current.play().catch((error) => {
            console.error('Error playing video:', error);
          });
        } else if (data.action === 'stop') {
          videoRef.current.pause();
        }
      }
    };

    // Подписка на событие video_action
    socket.on('video_action', handleVideoAction);

    // Очистка сокета при размонтировании компонента
    return () => {
      socket.off('video_action', handleVideoAction); // Отключение обработчика события
    };
  }, [roomId]);

  // Функция для отправки событий видео
  const handleVideoActionSend = (action: string) => {
    console.log(`Sending action: ${action}`);
    socket.emit('video_action', { roomId, action });

    if (videoRef.current) {
      // Проверяем текущее состояние видео перед вызовом play или pause
      if (action === 'start') {
        videoRef.current.play().catch((error) => {
          console.error('Error playing video:', error);
        });
      } else if (action === 'stop') {
        videoRef.current.pause();
      }
    }
  };

  return (
    <div>
      <video ref={videoRef} width="600" controls>
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <div>
        <button onClick={() => handleVideoActionSend('start')}>Start</button>
        <button onClick={() => handleVideoActionSend('stop')}>Stop</button>
      </div>

      {videoAction === 'start' && <p>Video is playing...</p>}
      {videoAction === 'stop' && <p>Video is stopped.</p>}
    </div>
  );
};
