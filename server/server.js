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
const videoRoutes = require('./routes/video')
const http = require('http');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
// Use sockets modules
const rooms = {}; // объект для хранения комнат и связанных с ними видео
const socketIO = require('socket.io');
const { setupSocket } = require('./sockets/socket'); 

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
                url: `http://89.169.175.33:${PORT}`,
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
app.use('/video', videoRoutes);

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



// Вызываем функцию, где содержится логика WebSocket
setupSocket(io, rooms); // передаем объект io


// Запуск сервера с поддержкой WebSocket
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

console.log('Сервер стартовал!');
