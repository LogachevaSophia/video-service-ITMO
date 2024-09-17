const config_json = {
    "server": {
      "port": 5000,
      "whitelist": ["http://localhost:3000", "http://localhost:5173"]
    }
  }
const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');

dotenv.config();

const app = express()
const PORT = process.env.PORT || 5000;

// use cors for connect back and front
const cors = require("cors")
const whitelist = config_json.server.whitelist;


const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true,
}
app.use(cors(corsOptions))

// Use Node.js body parsing middleware 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));


// Роуты
app.use('/auth', authRoutes);



app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

console.log('Сервер стартовал!');
