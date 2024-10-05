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
        });

        // Обработка событий Start/Stop
        socket.on('video_action', (data) => {
            const { roomId, action } = data;
            console.log(`Video action "${action}" in room ${roomId} from user ${socket.id}`);

            // Отправляем событие всем в комнате, кроме отправителя
            socket.to(roomId).emit('sync_video', { action });
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
}

module.exports = { setupSocket };
