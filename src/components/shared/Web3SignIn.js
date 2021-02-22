import React, { useContext } from 'react';

import { NetworkContext } from 'contexts/Network';
import { UserContext, setupUser } from 'contexts/User';
import { Button } from 'antd';
import { useAlert } from 'react-alert'
import { chains } from 'utils/chains';



export const Web3SignIn = () => {
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [, setCurrentNetwork] = useContext(NetworkContext);
  const alert = useAlert()

  return (
    (currentUser) ? null : (
      <Button
        type="default"
        size="large"
        onClick={() => {
          try {
            setupUser(setCurrentUser)
              .then(network => {
                setCurrentNetwork(network)
                alert.show("Logged in to:" + chains[network].network)
                alert.show("To login to a different network switch the provider network.")
              })
          } catch (err) {
            console.log('login error', err);
          }
        }}
      >
        Connect
      </Button>)
  );
};
