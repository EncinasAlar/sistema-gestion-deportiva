const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // Asegúrate de que apuntas correctamente al archivo de rutas

dotenv.config(); // Carga las variables de entorno del archivo .env

const app = express();

// Middleware para manejar JSON en el cuerpo de las solicitudes
app.use(express.json()); // Para manejar JSON en el cuerpo de las solicitudes
// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Rutas
app.use('/users', authRoutes);

// Inicio del servidor
app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});
