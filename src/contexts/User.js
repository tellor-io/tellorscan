import React, { useState, createContext, useContext, useEffect } from 'react';
import { NetworkContext } from 'contexts/Network';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { chains } from 'utils/chains';
import TellorService from 'utils/tellorService';

export const setupUser = async (setCurrentUser) => {
    let user = { web3Modal: web3Modal }
    user.provider = await web3Modal.connect();
    user.web3 = new Web3(user.provider);
    const injectedChainId = await user.web3.eth.getChainId();
    user.address = (await user.web3.eth.getAccounts())[0]
    user.network = injectedChainId
    user.contracts = new TellorService(user.web3, chains[injectedChainId].contractAddr,)
    setCurrentUser(user)
    return injectedChainId
}

export const UserContext = createContext();

export const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider, // required
        options: {
            infuraId: "x",
        },
    },
};

const web3Modal = new Web3Modal({
    providerOptions, // required
    cacheProvider: true,
});

const resetUser = (setCurrentUser) => {
    setCurrentUser()
    web3Modal.clearCachedProvider()
}

const User = ({ children }) => {
    const [currentNetwork, setCurrentNetwork] = useContext(NetworkContext);
    const [currentUser, setCurrentUser] = useState();

    useEffect(() => {
        if (currentUser) {
            currentUser.provider.on("chainChanged", (chainId) => {
                resetUser(setCurrentUser)
                setCurrentNetwork(parseInt(chainId))
            });

            // Subscribe to accounts change
            currentUser.provider.on("accountsChanged", async (accounts) => {
                if (accounts.length == 0) {
                    resetUser(setCurrentUser)
                } else {
                    setupUser(setCurrentUser)
                }
            });
        }
    }, [currentUser])

    useEffect(() => {
        if (web3Modal.cachedProvider) {
            setupUser(setCurrentUser).then(res => setCurrentNetwork(res))
        }
    }, [])

    useEffect(() => {
        if (currentUser && +currentUser.network != +currentNetwork) {
            resetUser(setCurrentUser)
        }
    }, [currentNetwork])

    return (
        <UserContext.Provider value={[currentUser, setCurrentUser]}>
            {children}
        </UserContext.Provider >
    );
};

export default User;
