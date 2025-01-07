const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const validator = require('validator');
const jwtSecret = process.env.JWT_SECRET;
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
    const { name, email, password, dni, birthYear } = req.body;

    // Validar formato de email
    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validar formato de DNI español
    const dniRegex = /^[XYZ]?\d{5,8}[A-Z]$/;
    if (!dniRegex.test(dni)) {
        return res.status(400).json({ error: 'Invalid DNI format' });
    }

    // Validar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: 'User already exists with this email' });
    }

    try {
        // Crear un nuevo usuario
        const user = new User({ name, email, password, dni, birthYear});
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error.message);
        res.status(500).json({ error: 'Error registering new user: ' + error.message });
    }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar el usuario por email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Comparar la contraseña ingresada con la almacenada
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generar un token JWT
        // Generar un token JWT
        const token = jwt.sign(
            { 
                sub: user._id, // Añade el campo `sub` para el sujeto
                role: user.role,
                type: 'access'
            },
            jwtSecret,
            { algorithm: 'HS256', expiresIn: '1h' }
        );


        res.status(200).json({ token });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Ruta para verificar el token
router.get('/verify', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Obtener token del encabezado Authorization

    if (!token) {
        return res.status(401).json({ error: 'Token is missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ message: 'Token is valid', user: decoded });
    } catch (error) {
        console.error('Error verifying token:', error.message);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});

// Ruta para obtener todos los usuarios con rol "user" --> Admin
router.get('/', async (req, res) => {
    try {
        // Filtra los usuarios que tienen el rol "user"
        const users = await User.find({ role: 'user' }, '-password'); // Excluye la contraseña del resultado
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ error: 'Error fetching users' });
    }
});


// Ruta para eliminar un usuario por ID --> Admin
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    console.log('ID recibido para eliminar:', id); // Depuración

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).json({ error: 'Error deleting user' });
    }
});
// Ruta para obtener un usuario desde el JWT
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Token missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.sub).select('-password'); // Excluir la contraseña

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error.message);
        res.status(500).json({ error: 'Error fetching user' });
    }
});

// Ruta para actualizar datos del usuario desde el JWT
router.put('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Token missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { email, password } = req.body;

        const updateData = {};
        if (email) updateData.email = email;

        if (password) {
            // Encriptar la contraseña antes de actualizarla
            const saltRounds = 10;
            const hashedPassword = bcrypt.hashSync(password, saltRounds);
            updateData.password = hashedPassword;
        }

        // Actualizar los datos del usuario
        const user = await User.findByIdAndUpdate(decoded.sub, updateData, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(500).json({ error: 'Error updating user' });
    }
});



router.patch('/update', async (req, res) => {
    const { email, password } = req.body;
    const userId = req.user.sub; // Usar el ID del token JWT
  
    try {
      const updateData = {};
      if (email) updateData.email = email;
      if (password) updateData.password = password;
  
      const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
      res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (err) {
      res.status(500).json({ error: 'Error updating user' });
    }
  });

module.exports = router;
