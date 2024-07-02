import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const InactivityHandler = ({ children }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    let timer;

    const resetTimer = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            logout();
            navigate('/login');
        }, 300000);
    };

    useEffect(() => {
        const events = ['mousemove', 'keypress'];

        const reset = () => {
            resetTimer();
        };

        events.forEach(event => window.addEventListener(event, reset));

        resetTimer();

        return () => {
            events.forEach(event => window.removeEventListener(event, reset));
            clearTimeout(timer);
        };
    }, []);

    return <>{children}</>;
};

export default InactivityHandler;