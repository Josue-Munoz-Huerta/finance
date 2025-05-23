const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const movementsRoutes = require('./routes/movements.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api/movements', movementsRoutes); // Nota el plural coherente

// Manejador de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});