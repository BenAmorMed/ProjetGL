import api from './api';

const login = async (username, password) => {
    try {
        const response = await api.post('/auth/login', {
            username,
            password
        });

        const authResponse = response.data;
        // Store token in localStorage
        localStorage.setItem('token', authResponse.token);
        // Store user info
        const user = {
            id: authResponse.id,
            username: authResponse.username,
            email: authResponse.email,
            role: authResponse.role
        };
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    } catch (error) {
        console.error('Login error:', error);
        throw new Error('Invalid username or password');
    }
};

const register = async (username, email, password, role) => {
    try {
        const response = await api.post('/auth/register', {
            username,
            email,
            password,
            role
        });

        const authResponse = response.data;
        // Store token in localStorage
        localStorage.setItem('token', authResponse.token);
        // Store user info
        const user = {
            id: authResponse.id,
            username: authResponse.username,
            email: authResponse.email,
            role: authResponse.role
        };
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
};

const getToken = () => {
    return localStorage.getItem('token');
};

export default {
    login,
    register,
    logout,
    getCurrentUser,
    getToken,
};
