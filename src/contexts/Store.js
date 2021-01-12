import React, { useState, useEffect, createContext } from 'react';
import Web3Modal from 'web3modal';
import Web3 from 'web3';

import { w3connect, providerOptions, createWeb3User } from '../utils/auth';
import { getChainData } from '../utils/chains';
import TellorService from 'utils/tellorService';
import tellorLoaderDark from '../assets/Tellor__Loader--Dark.json';
import tellorLoaderLight from '../assets/Tellor__Loader--Light.json';

export const ContractContext = createContext();
export const OpenDisputesContext = createContext();
export const CurrentUserContext = createContext();
export const NetworkContext = createContext();
export const Web3ModalContext = createContext();
export const ModeContext = createContext();

const Store = ({ children }) => {
  const [contract, setContract] = useState();
  const [openDisputes, setOpenDisputes] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [currentNetwork, setCurrentNetwork] = useState(
    window.localStorage.getItem('defaultNetwork') || '1',
  );

  const [mode, setMode] = useState(
    window.localStorage.getItem('viewMode') === 'light'
      ? tellorLoaderLight
      : tellorLoaderDark,
  );

  const [web3Modal, setWeb3Modal] = useState(
    new Web3Modal({
      providerOptions, // required
      cacheProvider: true,
    }),
  );

  useEffect(() => {
    setWeb3Modal(
      new Web3Modal({
        network: getChainData(+currentNetwork).network,
        providerOptions, // required
        cacheProvider: true,
      }),
    );
  }, [currentNetwork]);

  useEffect(() => {
    const initCurrentUser = async () => {
      try {
        const w3c = await w3connect(web3Modal, currentNetwork);
        setWeb3Modal(w3c);

        const [account] = await w3c.web3.eth.getAccounts();
        let user = createWeb3User(account);
        setCurrentUser(user);
      } catch (e) {
        console.error(`Could not log in with web3`);
        setCurrentUser();
      }
    };

    if (web3Modal.cachedProvider) {
      initCurrentUser();
    }
  }, [web3Modal, currentUser, currentNetwork]);

  useEffect(() => {
    const initContract = async (web3) => {
      try {
        const injectedChainId = await web3.eth.getChainId();

        if (injectedChainId !== +currentNetwork) {
          const nodeURL = currentNetwork === '1' ? process.env.REACT_APP_NODE_URL_MAINNET : process.env.REACT_APP_NODE_URL_RINKEBY;
          web3 = new Web3(nodeURL);
        }


        const tellorService = new TellorService(web3, currentNetwork);
        await tellorService.initContract();
        const disputeFee = await tellorService.getDisputeFee();

        setContract({ service: tellorService, disputeFee });
      } catch (e) {
        console.error(`Could not init contract`, e);
      }
    };

    const nodeURL = currentNetwork === '1' ? process.env.REACT_APP_NODE_URL_MAINNET : process.env.REACT_APP_NODE_URL_RINKEBY;

    initContract(web3Modal.web3 || new Web3("https://mainnet.infura.io/v3/973335d4f41d4c53b1af5b20ef2be9f3"));
  }, [currentNetwork, web3Modal]);

  useEffect(() => {
    const initCurrentUserBalance = async () => {
      try {
        const balance = await contract.service.getBalance(currentUser.username);
        const updatedUser = { ...currentUser, balance };
        setCurrentUser(updatedUser);
      } catch (e) {
        console.error(`Could not get balance`);
      }
    };

    if (contract && currentUser && !currentUser.hasOwnProperty('balance')) {
      initCurrentUserBalance();
    }
  }, [currentUser, contract]);

  return (
    <Web3ModalContext.Provider value={[web3Modal, setWeb3Modal]}>
      <CurrentUserContext.Provider value={[currentUser, setCurrentUser]}>
        <NetworkContext.Provider value={[currentNetwork, setCurrentNetwork]}>
          <ModeContext.Provider value={[mode, setMode]}>
            <ContractContext.Provider value={[contract, setContract]}>
              <OpenDisputesContext.Provider
                value={[openDisputes, setOpenDisputes]}
              >
                {children}
              </OpenDisputesContext.Provider>
            </ContractContext.Provider>
          </ModeContext.Provider>
        </NetworkContext.Provider>
      </CurrentUserContext.Provider>
    </Web3ModalContext.Provider>
  );
};

export default Store;
