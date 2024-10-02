import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { baseURL } from '../../API/axiosConfig';

const socket = io(baseURL);

interface VideoProps {
  roomId: string | undefined;
}

export const VideoPlayer: React.FC<VideoProps> = ({ roomId }) => {
  const [videoAction, setVideoAction] = useState<string | null>(null);

  useEffect(() => {
    // Присоединение к комнате
    if (roomId) {
        alert(roomId)
      socket.emit('join_room', roomId);
    }

    // Обработка синхронизации видео (старт/стоп)
    socket.on('sync_video', (data) => {
      alert(`Video action: ${data.action}`);
      console.log('sync_video', data);
      setVideoAction(data.action);
    });

    // Очистка сокета при размонтировании компонента
    return () => {
      socket.off('sync_video'); // Отключение обработчика события
    };
  }, [roomId]);

  // Функция для отправки событий видео
  const handleVideoAction = (action: string) => {
    alert("action")
    socket.emit('video_action', { roomId, action });
  };

  return (
    <div>
      {/* <iframe
        width="720"
        height="405"
        src="https://rutube.ru/play/embed/65a95f0f34e0abda4b7768afde058e08/"
        frameBorder="0"
        allow="clipboard-write; autoplay"
        allowFullScreen
      ></iframe> */}
      <div>
        <button onClick={() => handleVideoAction('start')}>Start</button>
        <button onClick={() => handleVideoAction('stop')}>Stop</button>
      </div>
      {videoAction === 'start' && <p>Video is playing...</p>}
      {videoAction === 'stop' && <p>Video is stopped.</p>}
    </div>
  );
};
