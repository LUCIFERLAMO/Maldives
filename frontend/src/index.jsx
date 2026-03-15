import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const nativeFetch = window.fetch.bind(window);
window.fetch = (input, init = {}) => {
    try {
        const requestUrl = typeof input === 'string' ? input : input?.url || '';
        const isApiRequest = requestUrl.includes('/api/');

        if (!isApiRequest) {
            return nativeFetch(input, init);
        }

        const storedUser = localStorage.getItem('user');
        const token = storedUser ? JSON.parse(storedUser)?.token : null;

        const headers = new Headers(init?.headers || (input instanceof Request ? input.headers : undefined));
        if (!headers.has('X-Requested-With')) {
            headers.set('X-Requested-With', 'XMLHttpRequest');
        }
        if (!headers.has('Authorization')) {
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
        }

        return nativeFetch(input, { ...init, headers });
    } catch (error) {
        return nativeFetch(input, init);
    }
};

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}

console.log("Frontend App Mounting...");
const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
