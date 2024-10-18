import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('your_publishable_key_here');

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [amount, setAmount] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { data } = await axios.post('http://localhost:5000/api/payment/create-payment-intent', { amount });

        const result = await stripe.confirmCardPayment(data.clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            },
        });

        if (result.error) {
            console.error(result.error.message);
        } else {
            if (result.paymentIntent.status === 'succeeded') {
                // Mettre à jour les crédits de l'utilisateur
                await axios.post('http://localhost:5000/api/payment/confirm', { amount }, {
                    headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
                });
                alert('Paiement réussi!');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                placeholder="Montant en €" 
                required 
            />
            <CardElement />
            <button type="submit" disabled={!stripe}>
                Payer
            </button>
        </form>
    );
};

const TopUp = () => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
};

export default TopUp;
