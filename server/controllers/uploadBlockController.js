const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/connection');
const logger = require('../logger/logger');

exports.upload = async (req, res) => {
    const connection = await db.getConnection(); // Получаем соединение для транзакции
    await connection.beginTransaction(); // Начинаем транзакцию

    try {
        const { title, description, videos } = req.body;
        const userId = req.user.id; // Получаем id пользователя из токена

        // Первый INSERT: вставляем данные о блоке
        const [blockResult] = await connection.query(
            'INSERT INTO block (Name, Description, Preview, Author) VALUES (?, ?, ?, ?)',
            [title, description, "preview_url", userId]
        );
        const blockId = blockResult.insertId; // Получаем id вставленного блока

        for (let i = 0; i < videos.length; i++) {
            await connection.query(
                'INSERT INTO video (Name, Description, Preview, Link, BlockId, Cost) VALUES (?, ?, ?, ?, ?, ?)',
                [videos[i].title, videos[i].description, "previewtest", videos[i].link, blockId, videos[i].cost]
            );
        }

        // Фиксируем транзакцию, если все прошло успешно
        await connection.commit();
        res.status(201).json({ message: 'Block and video uploaded successfully' });

    } catch (error) {
        await connection.rollback();
        logger.error(`Error upload block Error: ${error.message}`);
        res.status(500).json({ error: `Error /block/upload: ${error}` });
    } finally {
        connection.release(); // Освобождаем соединение
    }
};

exports.ping = async (req, res) => {
    logger.info('Ping request received');
    res.status(200).json({ message: "pong" });
};

