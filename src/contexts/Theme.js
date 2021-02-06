import React, { useState, createContext } from 'react';

import tellorLoaderDark from '../assets/Tellor__Loader--Dark.json';
import tellorLoaderLight from '../assets/Tellor__Loader--Light.json';

export const ThemeContext = createContext();


const Theme = ({ children }) => {
    const [mode, setMode] = useState(
        window.localStorage.getItem('viewMode') === 'light'
            ? tellorLoaderLight
            : tellorLoaderDark,
    );
    return (
        <ThemeContext.Provider value={[mode, setMode]}>
            {children}
        </ThemeContext.Provider>
    );
};

export default Theme;
