import { Dispatch, SetStateAction } from 'react';
import { createContext } from 'react';

export type AppContextType = {
    theme: 'light' | 'dark';
    toggleTheme: Function;
};

// UseEffect hook to reload the page when reading from the localStorage? (Maybe there's a better way)
const ThemeContext = createContext<AppContextType>({
    theme: 'light',
    toggleTheme: () => {},
});

export default ThemeContext;
