import { useState } from 'react';

const useTheme = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    const toggle = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        setTheme(newTheme);
    };

    return {
        theme,
        setTheme,
    };
};
