import React, { useState, useContext, useEffect } from 'react';
import { Button } from 'antd';
import { chains } from 'utils/chains';
import { fromWei } from 'utils/helpers';

import { UserContext } from 'contexts/User';
import { NetworkContext } from 'contexts/Network';

const Disputer = ({
  id,
  timestamp,
  minerAddr,
  onCancel
}) => {
  const [currentTx, setCurrentTx] = useState();
  const [error, setError] = useState();
  const [disputeFee, setDisputeFee] = useState();
  const [userBalance, setUserBalance] = useState(0);

  const [currentNetwork] = useContext(NetworkContext);
  const [currentUser,] = useContext(UserContext);
  const [txLink, setTxLink] = useState(1);

  const [minerIndex, setMinerIndex] = useState();
  const [dataReady, setDataReady] = useState(false);


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

  const triggerDispute = async ({id,minerIndex,timestamp}) => {
    try {
      await currentUser.contracts.beginDispute(
        currentUser.address,
        id,
        timestamp,
        minerIndex,
        setCurrentTx,
      );
    } catch (e) {
      console.error(`Error submitting dispute: ${e.toString()}`);
      setError(e);
    }
}

/* MINERINDEX FIX */
useEffect(() => {
  fetch(chains[currentNetwork].apiURL + "/getMiners/" + id + "/" + timestamp)
    .then(response => response.json())
    .then(data => {
      for (let index = 0; index < data.length; index++) {
        if (data[index].toLowerCase() == minerAddr.toLowerCase()) {
          setMinerIndex(index)
          return
        }
      }
    });
}, [])


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

  useEffect(() => {
    if (currentUser && disputeFee && (minerIndex || minerIndex===0)) {
      setDataReady(true);
    }
  }, [currentUser, disputeFee,minerIndex]);

  return (
    <>
    {dataReady?
      <>
        <div>
          {/* <p>minerIndex= {minerIndex} - userBalance= {userBalance}</p> */}
            <p className="disputeFee">Dispute fee: {disputeFee} TRB</p>
            {userBalance >= disputeFee?null:<p>Your balance is to low to start a dispute.</p>}
        </div>
        <div>
            <div>
            <p className="onCancel" onClick={onCancel}>cancel</p >
            <Button disabled={userBalance < disputeFee} onClick={() => triggerDispute({minerIndex:minerIndex,timestamp:timestamp,id:id})}>dispute value</Button>
            </div>
            {currentTx?
                <a href={txLink+"tx/"+currentTx} target="_blank" rel="noopener noreferrer">Show tx on Etherscan</a>
                :
                null
            }
        </div>
      </>
      :<p> loading ...</p>
    }
    </>
  );
};

export default Disputer;

