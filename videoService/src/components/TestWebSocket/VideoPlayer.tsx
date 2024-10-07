import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { baseURL } from '../../API/axiosConfig';
const socket = io(baseURL);
interface VideoProps {
  roomId: string | undefined;
  s3VideoUrl: string,
}
export const VideoPlayer: React.FC<VideoProps> = ({ roomId, s3VideoUrl }) => {
  const [videoAction, setVideoAction] = useState<string | null>("stop");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // const s3VideoUrl = "https://www.w3schools.com/html/mov_bbb.mp4"
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  useEffect(() => {
    // Присоединение к комнате
    if (roomId) {
      // alert(roomId)
      socket.emit('join_room', roomId);
    }

    // Обработка синхронизации видео (старт/стоп)
    socket.on('sync_video', (data) => {
      // alert(`Video action: ${data.action}`);
      console.log('sync_video', data);
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
    });
    // Очистка сокета при размонтировании компонента
    return () => {
      socket.off('sync_video'); // Отключение обработчика события
    };
  }, [roomId, socket]);
  // Функция для отправки событий видео
  const handleVideoAction = (data: { action: string }) => {
    // alert("action")
    socket.emit('video_action', { roomId, action: data.action });
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

  // Пользовательское взаимодействие для начала видео
  const handleUserPlay = () => {
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true); // Обновляем состояние после начала воспроизведения
        handleVideoAction({action: 'start'});
      }).catch((error) => {
        console.error('Error starting video:', error);
      });
    }
  };

  return (
    <div>
      <video ref={videoRef} width="600" controls>
        <source src={s3VideoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div>
        <button onClick={handleUserPlay}>Start</button>
        <button onClick={() => handleVideoAction({ action:'stop'})}>Stop</button>
      </div>
      {/* <div>
        <button onClick={() => handleVideoAction({ action: 'start' })}>Start</button>
        <button onClick={() => handleVideoAction({ action: 'stop' })}>Stop</button>
      </div> */}
      {videoAction === 'start' && <p>Video is playing...</p>}
      {videoAction === 'stop' && <p>Video is stopped.</p>}
    </div>
  );
};