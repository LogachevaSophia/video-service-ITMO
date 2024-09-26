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
    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room: ${roomId}`);
    });
    socket.on('video_action', (data) => {
        const { roomId, action } = data;
        console.log(`Video action "${action}" in room ${roomId} from user ${socket.id}`);
        socket.to(roomId).emit('sync_video', { action });
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Запуск сервера с поддержкой WebSocket
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

console.log('Сервер стартовал!');
