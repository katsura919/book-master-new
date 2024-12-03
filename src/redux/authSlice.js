// src/redux/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiBaseUrl = 'http://localhost:5000';
// Async Thunks for Login and Register actions
export const login = createAsyncThunk(
    'auth/login',
    async ({ username, password, navigate}, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${apiBaseUrl}/api/login`, { username, password });
            const { token, id, username: loggedInUser } = response.data;

            localStorage.setItem('token', token); // Store token in localStorage
            navigate('/');
            return { id, username: loggedInUser, token };
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data.message : 'Login failed');
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async ({ firstName, lastName, username, password, navigate }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${apiBaseUrl}/api/register`, { firstName, lastName, username, password });
            const { token, id, username: registeredUser } = response.data;

            localStorage.setItem('token', token); // Store token in localStorage
            navigate('/');
            return { id, username: registeredUser, token };
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data.message : 'Registration failed');
        }
    }
);

export const logout = createAsyncThunk('auth/logout', async () => {
    localStorage.removeItem('token'); // Clear token from localStorage
});

// Slice definition
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: !!localStorage.getItem('token'), // Check token for session persistence
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.user = { id: action.payload.id, username: action.payload.username };
                state.token = action.payload.token;
                state.error = null;
                localStorage.setItem('user', JSON.stringify(action.payload)); // Store user in localStorage
            })
            .addCase(login.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.user = { id: action.payload.id, username: action.payload.username };
                state.token = action.payload.token;
                state.error = null;
                localStorage.setItem('user', JSON.stringify(action.payload)); // Store user in localStorage
            })
            .addCase(register.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.error = null;
                localStorage.removeItem('user'); // Clear user from localStorage
            });
    },
});

export default authSlice.reducer;
