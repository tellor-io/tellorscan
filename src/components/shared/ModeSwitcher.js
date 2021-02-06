import React, { useState, useEffect, useContext } from 'react';

import { BulbOutlined } from '@ant-design/icons';
import tellorLogoDark from '../../assets/Tellor__Logo--Dark.png';
import tellorLogoLight from '../../assets/Tellor__Logo--Light.png';
import tellorLoaderDark from '../../assets/Tellor__Loader--Dark.json';
import tellorLoaderLight from '../../assets/Tellor__Loader--Light.json';
import { ThemeContext } from 'contexts/Theme';

const darkThemePropertiesMap = {
  background: '#000',
  'background-2': '#252525',
  'color-primary-1': '#5cfcb6',
  'color-primary-2': '#baffe1',
  'color-primary-3': '#99ffd1',
  'color-primary-4': '#37f3a1',
  'color-primary-5': '#00ff8f',
  'color-secondary-1': '#777777',
  'color-secondary-2': '#444444',
  'color-table-thead': '#00ff8f',
  'color-heading': '#00ff8f',
  'color-link': '#5cfcb6',
  'modal-color-background': '#444444',
  'modal-color-btn-default': '#5cfcb6',
};

const lightThemePropertiesMap = {
  background: '#EAFFF6',
  'background-2': '#fff',
  'color-primary-1': '#5cfcb6',
  'color-primary-2': '#252525',
  'color-primary-3': '#99ffd1',
  'color-primary-4': '#37f3a1',
  'color-primary-5': '#00ff8f',
  'color-secondary-1': '#777777',
  'color-secondary-2': '#444444',
  'color-table-thead': '#777777',
  'color-heading': '#000',
  'color-link': '#37F3A1',
  'modal-color-background': '#fff',
  'modal-color-btn-default': '#000',
};

const ModeSwitcher = ({ setLogo }) => {
  const [theme, setTheme] = useState({
    theme: 'dark',
    themePropertiesMap: darkThemePropertiesMap,
  });
  const [, setMode] = useContext(ThemeContext);

  useEffect(() => {
    const defaultTheme = localStorage.getItem('viewMode');
    if (theme.theme !== defaultTheme) {
      switchTheme(defaultTheme === null);
    } else {
      setMode(theme.theme === 'dark' ? tellorLoaderLight : tellorLoaderDark);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    for (const property in theme.themePropertiesMap) {
      if (theme.themePropertiesMap[property]) {
        setThemeProperty(property, theme.themePropertiesMap[property]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme.themePropertiesMap]);

  const switchTheme = (defaultTheme) => {
    let currentThemeDark = theme.theme === 'dark';
    let newTheme = currentThemeDark ? 'light' : 'dark';
    if (defaultTheme) {
      currentThemeDark = false;
      newTheme = 'dark';
    }

    setTheme({
      theme: newTheme,
      themePropertiesMap: currentThemeDark
        ? lightThemePropertiesMap
        : darkThemePropertiesMap,
    });

    setLogo(currentThemeDark ? tellorLogoLight : tellorLogoDark);
    setMode(currentThemeDark ? tellorLoaderDark : tellorLoaderLight);

    window.localStorage.setItem('viewMode', newTheme);
  };

  const setThemeProperty = (name, value) => {
    document.documentElement.style.setProperty(`--${name}`, value);
  };

  return (
    <>
      <BulbOutlined onClick={() => switchTheme()} />
    </>
  );
};

export default ModeSwitcher;
