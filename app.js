// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement
dotenv.config();

// Ajouter des logs pour vérifier les variables
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY);
console.log('MONGODB_URI:', process.env.MONGODB_URI);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à la base de données
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connexion à MongoDB réussie'))
.catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Importer les routes
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');

// Utiliser les routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);

// Servir les fichiers statiques du frontend en production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client', 'build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    });
}

// Middleware pour gérer les erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erreur interne du serveur' });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
