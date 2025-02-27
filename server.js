require('dotenv').config();
const express = require('express');
const cors = require('cors');

const stockRoutes = require('./routes/stocksRoutes');

const app = express();


app.use(cors());
app.use(express.json());

// Rutas
app.use('/stocks', stockRoutes);

const PORT = process.env.PORT || 3011;
app.listen(PORT, () => {
    console.log(`Servitor corridor en el puerto ${PORT}`);
});