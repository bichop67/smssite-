// src/components/Auth/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/auth/login', formData);
            localStorage.setItem('token', data.token);
            navigate('/dashboard');
        } catch (err) {
            alert('Erreur lors de la connexion');
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Connexion</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    name="email" 
                    type="email" 
                    placeholder="Email" 
                    value={formData.email}
                    onChange={handleChange} 
                    required 
                />
                <input 
                    name="password" 
                    type="password" 
                    placeholder="Mot de passe" 
                    value={formData.password}
                    onChange={handleChange} 
                    required 
                />
                <button type="submit">Se connecter</button>
            </form>
        </div>
    );
};

export default Login;
