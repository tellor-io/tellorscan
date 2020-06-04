import React, { useState, useEffect, createContext } from 'react';
import Web3Modal from 'web3modal';
import Web3 from 'web3';

import { w3connect, providerOptions, createWeb3User } from '../utils/auth';
import { getChainData } from '../utils/chains';
import TellorService from 'utils/tellorService';

export const ContractContext = createContext();
export const OpenDisputesContext = createContext();
export const CurrentUserContext = createContext();
export const Web3ModalContext = createContext();

const Store = ({ children }) => {
  const [contract, setContract] = useState();
  const [openDisputes, setOpenDisputes] = useState();
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
      try {
        const w3c = await w3connect(web3Modal);
        setWeb3Modal(w3c);

        const [account] = await w3c.web3.eth.getAccounts();
        let user = createWeb3User(account);
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
    const initContract = async (web3) => {
      try {
        const tellorService = new TellorService(web3);
        await tellorService.initContract();
        const disputeFee = await tellorService.getDisputeFee();
        setContract({ service: tellorService, disputeFee });
      } catch (e) {
        console.error(`Could not init contract`);
      }
    };

    initContract(web3Modal.web3 || new Web3(process.env.REACT_APP_INFURA_URI));
  }, [web3Modal]);

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
        <ContractContext.Provider value={[contract, setContract]}>
          <OpenDisputesContext.Provider value={[openDisputes, setOpenDisputes]}>
            {children}
          </OpenDisputesContext.Provider>
        </ContractContext.Provider>
      </CurrentUserContext.Provider>
    </Web3ModalContext.Provider>
  );
};

export default Store;
