// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Route pour l'inscription
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    console.log("Données reçues pour l'inscription :", req.body);

    // Validation simple
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Veuillez remplir tous les champs' });
    }

    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Utilisateur existant trouvé');
            return res.status(400).json({ message: 'L\'utilisateur existe déjà' });
        }

        // Hash du mot de passe
        console.log('Aucun utilisateur existant, génération du hash du mot de passe');
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer un nouvel utilisateur
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        // Enregistrer l'utilisateur dans la base de données
        await newUser.save();
        console.log('Nouvel utilisateur créé et enregistré avec succès');

        // Créer un token JWT
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(201).json({ token });
    } catch (err) {
        console.error('Erreur lors de l\'inscription :', err);
        res.status(500).json({ error: 'Erreur serveur lors de l\'inscription' });
    }
});

// Route pour la connexion
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log("Données reçues pour la connexion :", req.body);

    if (!email || !password) {
        return res.status(400).json({ message: 'Veuillez remplir tous les champs' });
    }

    try {
        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Utilisateur non trouvé');
            return res.status(400).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Mot de passe incorrect');
            return res.status(400).json({ message: 'Mot de passe incorrect' });
        }

        // Créer un token JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ token });
    } catch (err) {
        console.error('Erreur lors de la connexion :', err);
        res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
    }
});

module.exports = router;
