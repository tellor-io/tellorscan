import React, { useContext } from 'react';

import { Web3ModalContext, CurrentUserContext } from '../../contexts/Store';
import { createWeb3User, w3connect, signInWithWeb3 } from '../../utils/auth';
import { Button } from 'antd';

export const Web3SignIn = () => {
  const [web3Modal, setWeb3Modal] = useContext(Web3ModalContext);
  const [, setCurrentUser] = useContext(CurrentUserContext);

  return (
    <Button
      type="default"
      size="large"
      onClick={async () => {
        try {
          // const w3c = await w3connect(web3Modal);
          const w3c = await signInWithWeb3();

          console.log('after w3connect', w3connect);
          const [account] = await w3c.web3.eth.getAccounts();
          setWeb3Modal(w3c);
          const user = createWeb3User(account);
          setCurrentUser(user);
        } catch (err) {
          console.log('web3Modal error', err);
        }
      }}
    >
      Connect
    </Button>
  );
};
