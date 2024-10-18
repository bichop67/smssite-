// src/components/Payment/TopUp.js
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('pk_live_51OQ9RsJP8iuf9C8WDXLSWyaZMFekEZEYYRVlg4IZI6EQcMz8ln5YPPLSs2oxfseeXKq01kWcV8a9fnZcKo536Kgs00NKvWEUQi'); // Remplace par ta clé publiable Stripe

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [amount, setAmount] = useState('');
    const token = localStorage.getItem('token');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        if (!amount || isNaN(amount) || amount <= 0) {
            alert('Veuillez entrer un montant valide');
            return;
        }

        try {
            // Créer un PaymentIntent sur le backend
            const { data } = await axios.post('/api/payment/create-payment-intent', { amount }, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            // Confirmer le paiement avec Stripe
            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (result.error) {
                alert(result.error.message);
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    // Informer le backend que le paiement est réussi
                    await axios.post('/api/payment/confirm', { amount }, {
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    alert('Paiement réussi, crédits ajoutés.');
                    setAmount('');
                }
            }
        } catch (err) {
            alert('Erreur lors du paiement');
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Recharger des Crédits</h2>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Montant en €"
                required
                min="1"
            />
            <CardElement />
            <button type="submit" disabled={!stripe}>Payer</button>
        </form>
    );
};

const TopUp = () => (
    <Elements stripe={stripePromise}>
        <CheckoutForm />
    </Elements>
);

export default TopUp;
