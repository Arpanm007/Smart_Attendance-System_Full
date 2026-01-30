'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const role = Cookies.get('role');
        if (role) {
            setUserRole(role);
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        Cookies.set('token', userData.token);
        Cookies.set('userId', userData._id);
        console.log("ID:", userData._id);
        Cookies.set('role', userData.role);
        console.log(userData.token);
    };

    const getUserInfo = () => {
        const token = Cookies.get('token');
        const userId = Cookies.get('userId');
        return { token, userId };
    };

    const logout = () => {
        setUserRole(null);
        Cookies.remove('token');
        Cookies.remove('userId');
    };

    return (
        <AuthContext.Provider value={{ userRole, login, logout, loading, getUserInfo }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);