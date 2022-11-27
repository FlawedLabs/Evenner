import { createContext } from 'react';
import { getThemeFromLocalStorage } from '../lib/ThemeUtils';

const ThemeContext = createContext<{
    theme: 'light' | 'dark';
    setTheme: Function;
}>({ theme: 'light', setTheme: () => {} });

export default ThemeContext;
