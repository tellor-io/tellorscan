import React, { useState, useEffect, useContext } from 'react';
import { Menu, Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { NetworkContext } from 'contexts/Network';
import { UserContext, setupUser } from 'contexts/User';
import { useAlert } from 'react-alert'
import { chains } from 'utils/chains';
import { truncateAddr } from 'utils/helpers';
import { fromWei } from 'utils/helpers';


export const Web3SignIn = ({activeDisputesCount}) => {
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [userBalance, setUserBalance] = useState(0);

  const [, setCurrentNetwork] = useContext(NetworkContext);
  const alert = useAlert()



  useEffect(() => {
    if (currentUser) {
      currentUser.contracts.balanceOf(currentUser.address).then(result => {
        let balance = fromWei(result)
        setUserBalance(balance)
      })
    }
  }, [currentUser]);
  

  const headerdropdown = () => {
    return (
    <div className="HeaderDropdown">
      <p>Your balance: </p>
      <h1 className="bold">{userBalance} TRB</h1>
    </div>
    )
  };
  
  return (
    (currentUser) ? 
    <Dropdown
    overlay={headerdropdown}
    trigger={['click']}
    >
      {/* 
      TO BE ADDED WHEN COUNTER IS FIXED (/REPLACED W THE ONE BELOW)!! :::
      
      <Button className={activeDisputesCount>0?"gotAddress_wCount":"gotAddress"}>
      {truncateAddr(currentUser.address)} {activeDisputesCount>0?<div className="activeDisputesCount"><p>{activeDisputesCount}</p></div>:null}
      </Button>
      
      */}    
      <Button className="gotAddress">
        {truncateAddr(currentUser.address)}
      </Button>
    </Dropdown>
    : (
      <Button
        type="default"
        size="large"
        onClick={() => {
          try {
            setupUser(setCurrentUser)
              .then(network => {
                setCurrentNetwork(network)
                alert.show("You are logged in to " + chains[network].network+". To login to a different network, switch the provider network.");
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
