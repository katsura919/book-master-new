import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const error = useSelector((state) => state.auth.error);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        dispatch(register({ firstName, lastName, username, password, navigate }));
    };

    return (
        <div className="register-card">
            <h2 className="register-header">
                Register
            </h2>
            <p className="register-subtitle">Unauthorized registration is prohibited.</p>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="register-form">
                <div className="input-group">
                    <input
                        className="input-field half-width"
                        type="text"
                        placeholder="Firstname"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    <input
                        className="input-field half-width"
                        type="text"
                        placeholder="Lastname"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>
                <input
                    className="input-field"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    className="input-field"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    className="input-field"
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit" className="submit-button">Submit</button>
            </form>
            <div className="footer-text">
                Already have an account? 
                <p className="gotoreg" onClick={() => navigate('/login')} style={{cursor: 'pointer', color: '#4a90e2' }}>
                    Signin
                </p>
            </div>
        </div>
    );
};

export default Register;
