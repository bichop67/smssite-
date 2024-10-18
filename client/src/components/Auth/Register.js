// src/components/Auth/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Envoie une requête POST au backend pour enregistrer l'utilisateur
            await axios.post('/api/auth/register', formData);
            alert('Inscription réussie, veuillez vous connecter.');
            navigate('/');
        } catch (err) {
            alert('Erreur lors de l\'inscription');
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Inscription</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    name="username" 
                    placeholder="Nom d'utilisateur" 
                    value={formData.username}
                    onChange={handleChange} 
                    required 
                />
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
                <button type="submit">S'inscrire</button>
            </form>
        </div>
    );
};

export default Register;
