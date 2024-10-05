module.exports = (io, rooms) => {
    io.on('connection', (socket) => {
        socket.on('video_action', (data) => {
            const { roomId, action } = data;
            console.log(`Video action "${action}" in room ${roomId} from socket id= ${socket.id}`);
            socket.to(roomId).emit('sync_video', { action });
        });
    });
};
