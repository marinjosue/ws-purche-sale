require('dotenv').config();
const express = require('express');
const cors = require('cors');

const stockRoutes = require('./routes/stocksRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/stocks', stockRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
