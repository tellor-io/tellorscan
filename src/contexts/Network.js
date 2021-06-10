import React, { useState, createContext } from 'react';

export const NetworkContext = createContext();


const Network = ({ children }) => {
  const [currentNetwork, setCurrentNetwork] = useState(
    window.localStorage.getItem('defaultNetwork') || 1
  );

  return (
    <NetworkContext.Provider value={[currentNetwork, setCurrentNetwork]}>
      {children}
    </NetworkContext.Provider >
  );
};

export default Network;
