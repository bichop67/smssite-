// routes/payment.js
const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const auth = require('../middlewares/auth');
const User = require('../models/User');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15', // Assure-toi d'utiliser une version compatible
});

// Créer un PaymentIntent
router.post('/create-payment-intent', auth, async (req, res) => {
    const { amount } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convertir en centimes
            currency: 'eur',
            metadata: { userId: req.user.id },
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la création du paiement' });
    }
});

// Confirmer le paiement et ajouter les crédits
router.post('/confirm', auth, async (req, res) => {
    const { amount } = req.body;

    try {
        const user = await User.findById(req.user.id);
        user.credits += amount;
        await user.save();
        res.json({ message: 'Crédits ajoutés avec succès', credits: user.credits });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de l\'ajout des crédits' });
    }
});

module.exports = router;
