// src/components/Dashboard/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [service, setService] = useState('');
    const [country, setCountry] = useState('');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/');
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await axios.get('/api/sms/orders', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                setOrders(response.data.orders);
            } catch (err) {
                console.error(err);
                alert('Erreur lors de la récupération des commandes');
            }
        };
        fetchOrders();
    }, [token, navigate]);

    const handleBuyNumber = async () => {
        try {
            await axios.post('/api/sms/buy-number', { service, country }, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            alert('Numéro acheté avec succès');
            // Rafraîchir les commandes
            const response = await axios.get('/api/sms/orders', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setOrders(response.data.orders);
        } catch (err) {
            alert('Erreur lors de l\'achat du numéro');
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div>
            <h1>Tableau de Bord</h1>
            <button onClick={handleLogout}>Se déconnecter</button>
            <div>
                <h2>Acheter un Numéro SMS</h2>
                <input 
                    placeholder="Service (e.g., WhatsApp)" 
                    value={service} 
                    onChange={(e) => setService(e.target.value)} 
                />
                <input 
                    placeholder="Pays (e.g., US)" 
                    value={country} 
                    onChange={(e) => setCountry(e.target.value)} 
                />
                <button onClick={handleBuyNumber}>Acheter</button>
            </div>
            <h2>Mes Commandes</h2>
            <ul>
                {orders.map(order => (
                    <li key={order._id}>
                        Service: {order.service} | Pays: {order.country} | Numéro: {order.number} | Statut: {order.status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
