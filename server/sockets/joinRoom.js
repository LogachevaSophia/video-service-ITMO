module.exports = (io, rooms) => {
    io.on('connection', (socket) => {
        socket.on('join_room', (roomId) => {
            if (rooms[roomId]) {
                socket.join(roomId);
                console.log(`User ${socket.id} joined room: ${roomId}`);
                
                // Отправляем клиенту информацию о видео для синхронизации
                socket.emit('room_joined', { roomId, videoUrl: rooms[roomId].videoUrl });
            } else {
                socket.emit('error', { message: 'Room does not exist' });
            }
        });
    });
};
