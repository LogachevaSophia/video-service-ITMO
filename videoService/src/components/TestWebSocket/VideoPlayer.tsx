import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { baseURL } from '../../API/axiosConfig';

const socket = io(baseURL);

interface VideoProps {
  roomId: string | undefined;
  s3VideoUrl: string | null | undefined;
}

export const VideoPlayer: React.FC<VideoProps> = ({ roomId, s3VideoUrl }) => {
  const [videoAction, setVideoAction] = useState<string | null>("stop");
  const [isSyncing, setIsSyncing] = useState(false); // Флаг синхронизации
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Присоединение к комнате
    if (roomId) {
      socket.emit('join_room', roomId);
    }

    // Обработка синхронизации видео при подключении
    socket.on('sync_on_join', (data) => {
      const { currentTime, isPlaying } = data;

      if (videoRef.current) {
        setIsSyncing(true); // Ставим флаг, что это синхронизация
        videoRef.current.currentTime = currentTime; // Синхронизация времени
        if (isPlaying) {
          videoRef.current.play().catch((error) => {
            console.error('Error playing video:', error);
          });
        } else {
          videoRef.current.pause();
        }
      }
    });

    // Обработка синхронизации видео (старт/стоп/перемотка)
    socket.on('sync_video', (data) => {
      const { action, currentTime } = data;
      setIsSyncing(true); // Ставим флаг, что это синхронизация
      setVideoAction(action);
      if (videoRef.current) {
        videoRef.current.currentTime = currentTime; // Синхронизация времени
        if (action === 'start') {
          videoRef.current.play().catch((error) => {
            console.error('Error playing video:', error);
          });
        } else if (action === 'stop') {
          videoRef.current.pause();
        }
      }
    });

    // Очистка сокета при размонтировании компонента
    return () => {
      socket.off('sync_video');
      socket.off('sync_on_join');
    };
  }, [roomId]);

  // Функция для отправки действий видео (play, pause, seek)
  const handleVideoAction = (data: { action: string }) => {
    if (videoRef.current && !isSyncing) { // Отправляем действие только если это не синхронизация
      const currentTime = videoRef.current.currentTime;
      socket.emit('video_action', { roomId, action: data.action, currentTime });
      setVideoAction(data.action);
      if (data.action === 'start') {
        videoRef.current.play().catch((error) => {
          console.error('Error playing video:', error);
        });
      } else if (data.action === 'stop') {
        videoRef.current.pause();
      }
    }
    setIsSyncing(false); // Сбрасываем флаг после выполнения
  };

  // Функция для обработки перемотки
  const handleVideoSeek = () => {
    if (videoRef.current && !isSyncing) { // Только если перемотка не синхронизирована
      const currentTime = videoRef.current.currentTime;
      socket.emit('video_action', { roomId, action: 'seek', currentTime });
    }
    setIsSyncing(false); // Сбрасываем флаг после выполнения
  };

  // Пользовательское взаимодействие для начала видео
  const handleUserPlay = () => {
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        handleVideoAction({ action: 'start' });
      }).catch((error) => {
        console.error('Error starting video:', error);
      });
    }
  };

  return s3VideoUrl && (
    <div>
      <video
        ref={videoRef}
        width="600"
        controls
        onPlay={handleUserPlay}
        onPause={() => handleVideoAction({ action: 'stop' })}
        onSeeked={handleVideoSeek} // Обрабатываем событие перемотки
      >
        <source src={s3VideoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {videoAction === 'start' && <p>Video is playing...</p>}
      {videoAction === 'stop' && <p>Video is stopped.</p>}
    </div>
  );
};
