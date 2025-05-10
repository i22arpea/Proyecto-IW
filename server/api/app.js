const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const Routes = require('./routes/server.routes');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Conectado a MongoDB Atlas'))
.catch((err) => console.error('❌ Error de conexión con MongoDB:', err));

function startExpress() {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(Routes);

    app.get('*', (req, res) => {
        res.status(200).json({
            Routes: [
                '/api/wordle',
                '/api/wordle/checkword/:word',
                '/api/wordle/updateword',
                '/api/wordle/setword/:word',
                '/api/wordle/random',
            ],
        });
    });

    app.listen(process.env.PORT || 4000, () => {
        console.log(`Server running on port: ${process.env.PORT || 4000}`);
    });
}

module.exports = startExpress;
