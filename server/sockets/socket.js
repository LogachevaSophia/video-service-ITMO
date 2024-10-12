// sockets.js
function setupSocket(io, rooms) {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        // создание новой комнаты
        socket.on('create_room', (videoUrl) => {
            const roomId = uuidv4(); // создаем уникальный идентификатор комнаты
            rooms[roomId] = { videoUrl }; // сохраняем видео, связанное с комнатой
            socket.join(roomId);
            console.log(`Room ${roomId} created with video: ${videoUrl} by user ${socket.id}`);

            // Отправляем клиенту ID новой комнаты
            socket.emit('room_created', { roomId, videoUrl });
        });
        // Присоединение пользователя к комнате
        socket.on('join_room', (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room: ${roomId}`);
            if (rooms[roomId]){
                const {currentTime, isPlaying, lastActionTimestamp} = rooms[roomId];
                let syncedCurrentTime = currentTime;
                if (isPlaying && lastActionTimestamp) {
                    const timeElapsed = (Date.now() - lastActionTimestamp) / 1000;
                    syncedCurrentTime += timeElapsed;
                }
                socket.emit("sync_on_join", { currentTime: syncedCurrentTime, isPlaying })
            }
        });

        // Обработка событий Start/Stop
        socket.on('video_action', (data) => {
            const { roomId, action, currentTime  } = data;
            console.log(`Video action "${action}" in room ${roomId} from user ${socket.id}`);
            if (rooms[roomId]){
                rooms[roomId].currentTime = currentTime;
                rooms[roomId].isPlaying = (action === "start")
                if (action === "start"){
                    rooms[roomId].lastActionTimestamp =Date.now();
                }
            }
            // Отправляем событие всем в комнате, кроме отправителя
            socket.to(roomId).emit('sync_video', { action, currentTime });
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
}

module.exports = { setupSocket };
