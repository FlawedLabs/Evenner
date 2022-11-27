import { createContext, useState } from 'react';
import BasicLayout from '../../layout/BasicLayout';
import { getThemeFromLocalStorage } from '../../lib/ThemeUtils';
import ThemeContext from '../../context/ThemeContext';

interface ThemeProviderProps {
    children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
    // Read theme from local storage
    const [theme, setTheme] = useState(getThemeFromLocalStorage);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <BasicLayout>{children}</BasicLayout>
        </ThemeContext.Provider>
    );
}
