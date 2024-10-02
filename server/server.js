// server.js
const config_json = {
    "server": {
        "port": 5000,
        "whitelist": ["*"]
    }
}

const express = require('express');
const dotenv = require('dotenv').config();
const db = require("./db/connection")
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');
const blocksRoutes = require('./routes/blocks');
const http = require('http');
const socketIO = require('socket.io');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const app = express();
const PORT = process.env.PORT || 5000;

// use cors for connect back and front
const cors = require("cors");
const whitelist = config_json.server.whitelist;

const corsOptions = {
    origin: '*',
    credentials: true
};
app.use(cors(corsOptions));

// Use Node.js body parsing middleware 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Swagger definition
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'API Documentation',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
    },
    apis: ['./routes/*.js'], // Укажите путь к файлам с описаниями API
};

const rooms = {}; // объект для хранения комнат и связанных с ними видео

// Создание документации
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Настройка Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Роуты
app.use('/auth', authRoutes);
app.use('/blocks', blocksRoutes);

// Создаём HTTP сервер
const server = http.createServer(app);

// Настраиваем Socket.IO
const io = socketIO(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['polling', 'websocket'],
});

// WebSocket логика
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

    // подключение к существующей комнате
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
     // обработка действий с видео (воспроизведение, пауза, и т.д.)
     socket.on('video_action', (data) => {
        const { roomId, action } = data;
        console.log(`Video action "${action}" in room ${roomId} from user ${socket.id}`);
        socket.to(roomId).emit('sync_video', { action });
    });

    // обработка отключения пользователя
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });









    // socket.on('join_room', (roomId) => {
    //     socket.join(roomId);
    //     console.log(`User ${socket.id} joined room: ${roomId}`);
    // });
    // socket.on('video_action', (data) => {
    //     const { roomId, action } = data;
    //     console.log(`Video action "${action}" in room ${roomId} from user ${socket.id}`);
    //     socket.to(roomId).emit('sync_video', { action });
    // });
    // socket.on('disconnect', () => {
    //     console.log('User disconnected:', socket.id);
    // });
});

// Запуск сервера с поддержкой WebSocket
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

console.log('Сервер стартовал!');
