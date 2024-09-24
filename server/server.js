const config_json = {
    "server": {
        "port": 5000,
       // "whitelist": ["http://localhost:5000", "http://localhost:5173","http://192.168.0.109:5173", "http://192.168.0.108"]
        "whitelist": ["*"]
    }
}
const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');
const blocksRoutes = require('./routes/blocks')
const http = require('http');
const socketIO = require('socket.io'); // Для работы с WebSockets

dotenv.config();

const app = express()
const PORT = process.env.PORT || 5000;

// use cors for connect back and front
const cors = require("cors")
const whitelist = config_json.server.whitelist;


const corsOptions = {
    origin: '*',  // Разрешаем все источники
    credentials: true  // Разрешаем cookie и авторизацию, если это нужно
};
app.use(cors(corsOptions));

// Use Node.js body parsing middleware 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));


// Роуты
app.use('/auth', authRoutes);

app.use('/blocks', blocksRoutes)

// Создаём HTTP сервер
const server = http.createServer(app);
// Настраиваем Socket.IO поверх HTTP сервера
const io = socketIO(server, {
    cors: {
        origin: '*',  // Разрешаем все источники
        methods: ["GET", "POST"],
        credentials: true  // Если используете cookie или авторизацию
    },
    transports: ['polling', 'websocket'],  // Явно указываем поддерживаемые транспорты
});
app.use((req, res, next) => {
    console.log('Request Origin:', req.headers.origin);
    console.log('Request Host:', req.headers.host);
    next();
});

// WebSocket логика
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
  
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

// app.listen(PORT, () => {
//     console.log(`Server started on port ${PORT}`);
// });
// Запуск сервера с поддержкой WebSocket
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

console.log('Сервер стартовал!');
