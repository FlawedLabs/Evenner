import BasicLayout from '../../layout/BasicLayout';
import ThemeContext from '../../context/ThemeContext';
import { useState } from 'react';

interface ThemeProviderProps {
    children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    const toggleTheme = () => {
        if (theme === 'light') {
            window.localStorage.setItem('evenner_theme', 'dark');
            window.document.documentElement.classList.add('dark');
            setTheme('dark');
        } else {
            window.localStorage.setItem('evenner_theme', 'light');
            window.document.documentElement.classList.remove('dark');
            setTheme('light');
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <BasicLayout>{children}</BasicLayout>
        </ThemeContext.Provider>
    );
}
