import React, { useState, useContext, useEffect } from 'react';
import { Button } from 'antd';
import { chains } from 'utils/chains';
import { fromWei } from 'utils/helpers';

import { UserContext } from 'contexts/User';
import { NetworkContext } from 'contexts/Network';

const Disputer = ({
  id,
  time,
  minerIndex,
  onCancel
}) => {
  const [currentTx, setCurrentTx] = useState();
  const [error, setError] = useState();
  const [disputeFee, setDisputeFee] = useState();
  const [userBalance, setUserBalance] = useState(0);

  const [currentNetwork] = useContext(NetworkContext);
  const [currentUser,] = useContext(UserContext);
  const [txLink, setTxLink] = useState(1);


  useEffect(() => {
    if(currentNetwork){
        if(currentNetwork === 1){
            setTxLink("https://etherscan.io/")
        }
        if(currentNetwork === 4){
            setTxLink("https://rinkeby.etherscan.io/")
        }
      }
  },[currentNetwork]);

  const triggerDispute = async ({id,minerIndex,time}) => {
    try {
      await currentUser.contracts.beginDispute(
        currentUser.address,
        id,
        time,
        minerIndex,
        setCurrentTx,
      );
    } catch (e) {
      console.error(`Error submitting dispute: ${e.toString()}`);
      setError(e);
    }
}

  useEffect(() => {
    fetch(chains[currentNetwork].apiURL + "/getDisputeFee")
      .then(response => response.json())
      .then(data =>
        setDisputeFee(fromWei(data.disputeFee))
      );
  }, [])

  useEffect(() => {
    if (currentUser && disputeFee) {
      currentUser.contracts.balanceOf(currentUser.address).then(result => {
        let balance = fromWei(result)
        setUserBalance(balance)
      })
    }
  }, [currentUser, disputeFee]);

  return (
    <>
        <div>
            <p className="disputeFee">Dispute fee: {disputeFee} TRB</p>
            {userBalance >= disputeFee?null:<p>Your balance is to low to start a dispute.</p>}
        </div>
        <div>
            <div>
            <p className="onCancel" onClick={onCancel}>cancel</p >
            <Button disabled={userBalance < disputeFee} onClick={() => triggerDispute({minerIndex:minerIndex,time:time,id:id})}>dispute value</Button>
            </div>
            {currentTx?
                <a href={txLink+"tx/"+currentTx} target="_blank" rel="noopener noreferrer">Show tx on Etherscan</a>
                :
                null
            }
        </div>
    </>
  );
};

export default Disputer;

