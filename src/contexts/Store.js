import React, { useState, useEffect, createContext } from 'react';
import Web3Modal from 'web3modal';

import { w3connect, providerOptions, createWeb3User } from '../utils/auth';
import { getChainData } from '../utils/chains';
import TellorService from 'utils/tellorService';

export const ContractContext = createContext();
export const CurrentUserContext = createContext();
export const LoaderContext = createContext(false);
export const Web3ModalContext = createContext();

const Store = ({ children }) => {
  const [contract, setContract] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(false);
  const [web3Modal, setWeb3Modal] = useState(
    new Web3Modal({
      network: getChainData(+process.env.REACT_APP_CHAIN_ID).network, // optional
      providerOptions, // required
      cacheProvider: true,
    }),
  );

  useEffect(() => {
    const initCurrentUser = async () => {
      let user;
      try {
        const w3c = await w3connect(web3Modal);
        setWeb3Modal(w3c);

        const [account] = await w3c.web3.eth.getAccounts();
        user = createWeb3User(account);
        setCurrentUser(user);
      } catch (e) {
        console.error(`Could not log in with web3`);
      }
    };

    if (web3Modal.cachedProvider) {
      initCurrentUser();
    }
  }, [web3Modal, currentUser]);

  useEffect(() => {
    const initContract = async () => {
      try {
        const tellorService = new TellorService(web3Modal.web3);
        await tellorService.initContract();
        setContract(tellorService);
      } catch (e) {
        console.error(`Could not init contract`);
      }
    };
    if (web3Modal.web3) {
      initContract();
    }
    // eslint-disable-next-line
  }, [web3Modal.web3]);

  return (
    <LoaderContext.Provider value={[loading, setLoading]}>
      <Web3ModalContext.Provider value={[web3Modal, setWeb3Modal]}>
        <CurrentUserContext.Provider value={[currentUser, setCurrentUser]}>
          <ContractContext.Provider value={[contract, setContract]}>
            {children}
          </ContractContext.Provider>
        </CurrentUserContext.Provider>
      </Web3ModalContext.Provider>
    </LoaderContext.Provider>
  );
};

export default Store;
