// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Use ReactDOM.createRoot
import { Provider } from 'react-redux'; // Import Provider
import store from './redux/store'; // Import your store
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root
root.render(
    <React.StrictMode>
        <Provider store={store}> {/* Provide the store to your App */}
            <App />
        </Provider>
    </React.StrictMode>
);
