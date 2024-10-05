module.exports = (io, rooms) => {

    io.on('connection', (socket) => {
        socket.on('create_room', (videoUrl) => {
            const roomId = uuidv4();
            // Добавляем новую комнату в общий объект rooms
            rooms[roomId] = { videoUrl };
            socket.join(roomId);
            console.log(`Room ${roomId} created with video: ${videoUrl} by user ${socket.id}`);
            
            // Отправляем клиенту ID новой комнаты
            socket.emit('room_created', { roomId, videoUrl });
        });
    });

}