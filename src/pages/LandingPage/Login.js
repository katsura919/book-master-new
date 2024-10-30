import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';

import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle visibility

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ username, password, navigate }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle state on click
  };

  return (
    <div className='login-container'>
        <StyledWrapper>
          <form className="form" onSubmit={handleSubmit}>
            <p className="form-title">Sign in to your account</p>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div className="input-container">
              <input
                placeholder="Enter username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-container">
              <input
                placeholder="Enter password"
                type={showPassword ? 'text' : 'password'} // Toggle between text/password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'} // Accessibility
              >
                <svg
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {showPassword ? (
                    // Eye-off icon (for hiding password)
                    <path
                      d="M17.94 17.94A10 10 0 016.06 6.06M12 12a3 3 0 11-6 0 3 3 0 016 0z"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : (
                    // Eye icon (for showing password)
                    <>
                      <path
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </>
                  )}
                </svg>
              </button>
            </div>

            <button className="submit" type="submit">
              Sign in
            </button>

            <div className="btn-container">
              <div className="signup-link">
                No account?{' '}
                <p className="gotoreg" onClick={() => navigate('/register')}>
                  Sign up
                </p>
              </div>
            </div>
          </form>
        </StyledWrapper>
    </div>
  );
};

const StyledWrapper = styled.div`
  .form {
    margin-top: 90px;
    background-color: #fff;
    padding: 1rem;
    max-width: 350px;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  .form-title {
    font-size: 1.25rem;
    font-weight: 600;
    text-align: center;
    color: #000;
  }

  .input-container {
    position: relative;
    margin: 8px 0;
  }

  .input-container input {
    width: 280px;
    padding: 1rem;
    padding-right: 3rem;
    font-size: 0.875rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    background-color: #fff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    outline: none;
  }

  .toggle-password-btn {
    position: absolute;
    top: 0;
    right: 10px;
    height: 100%;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .toggle-password-btn svg {
    width: 1rem;
    height: 1rem;
    color: #9ca3af;
  }

  .submit {
    width: 100%;
    padding: 0.75rem 1.25rem;
    background-color: #4f46e5;
    color: #ffffff;
    font-size: 0.875rem;
    font-weight: 500;
    text-transform: uppercase;
    border-radius: 0.5rem;
  }

  .signup-link {
    color: #6b7280;
    font-size: 0.875rem;
    text-align: center;
  }

  .gotoreg {
    text-decoration: underline;
    cursor: pointer;
  }
`;

export default Login;
