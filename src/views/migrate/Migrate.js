import React, { useState, useContext, useEffect } from 'react';
import Loader from 'components/shared/Loader';
import { fromWei } from 'utils/helpers';
import { Collapse, Button, Radio } from 'antd';
import { UserContext } from 'contexts/User';
import { Web3SignIn } from 'components/shared/Web3SignIn';
import EtherscanLink from 'components/shared/EtherscanlLnk';
import * as abiOracle from 'contracts/oracle.json';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const { Panel } = Collapse;

const Migrate = () => {
    const [migrated, setMigrated] = useState(false);
    const [userBalance, setUserBalance] = useState(0);
    const [currentTx, setCurrentTx] = useState();
    const [currentUser,] = useContext(UserContext);
    const [cantMigrate, setCantMigrate] = useState();
    const [showFeedback, setShowFeedback] = useState(false);

    const [error, setError] = useState();
    const [processing, setProcessing] = useState(false);

    const contractaddress = "0x88dF592F8eb5D7Bd38bFeF7dEb0fBc02cf3778a0";

    useEffect(() => {
        if (currentUser) {
            setCurrentTx()
            currentUser.contracts.isMigrated(currentUser.address)
                .then(res => setMigrated(res));

            let oldContractAddr = "0xfe41cb708cd98c5b20423433309e55b53f79134a"
            if (currentUser.network == 1) {
                oldContractAddr = "0x0Ba45A8b5d5575935B8158a88C631E9F9C95a2e5"
            }
            let oldContract = new currentUser.web3.eth.Contract(abiOracle.default, oldContractAddr);

            oldContract.methods.balanceOf(currentUser.address)
                .call().then(result => { return setUserBalance(+result) });
        }

        console.log("currentUser",currentUser);
    }, [currentUser]);



    const handleSubmit = async () => {
        setProcessing(true);
        try {
            await currentUser.contracts.migrate(
                currentUser.address,
                setCurrentTx,
            );
        } catch (e) {
            setError(e)
        } finally {
            await currentUser.contracts.isMigrated(currentUser.address)
                .then(res => {
                    console.log('res migrate', res);
                    setMigrated(res);
                })
        }
        setProcessing(false)
    };

    useEffect(() => {
        if (userBalance == 0) {
            setCantMigrate("can't migrate with zero balance")
            return
        } else {
            setCantMigrate()
        }
        if (migrated) {
            setCantMigrate("already migrated")
            return
        }

    }, [currentUser, userBalance, migrated])


    const clickedCopy = () => {
        setShowFeedback(true);
        setTimeout(function() {
          setShowFeedback(false);
        }, 2000);
      }


    return (
    <>
      <div className="Migration">
        <div className="Intro">
          <div className="View">
            <h1>On this page, we’ll assist you in migrating your Tributes (TRB) to the new version of the contract.</h1>
            <Collapse>
                <Panel header="Why do I need to migrate my TRB?" key="1">
                  <p>The Tellor system experienced a major bug on monday 2/15 while deploying the upgrade to v2.6.1.  This froze the network including the TRB token, however no funds were lost.  The solution was to redeploy Tellor and to do so requires a token swap.  This migration page will help you through this simple process.</p>
              </Panel>
            </Collapse>

            <Collapse>
                <Panel header="What are the steps I need to take?" key="2">
                <ul>
                  <li>In Metamask, choose the account containing the TRB you want to migrate.</li>
                  <li>Click the "Connect" button in step 1.</li>
                  <li>If you are connected, your pubkey will appear in step 1. Also, in step 2 your balance will now be visible under "Current Balance", and the "Migrate TRB" button will now be enabled.</li>
                  <li>Click the "Migrate TRB" button in step 2.</li>
                  <li>Upon clicking the "Migrate TRB" button, the MetaMask modal will ask you to confirm this transaction. Make sure you have ETH to pay the gas of this transaction!</li>
                  <li>After confirming the transaction in MetaMask, you can follow its process on Etherscan. When this transaction has reached sufficient confirmations, your new balance will be visible under "New balance".</li>
                  <li>Your tokens are now successfully migrated to the new contract!</li>
                </ul>
                <br />
                <br />
                <p>In order for your new TRB balance to show up in your Metamask assets you may need to add a new token using this address:</p>
                <div className="leftrow">
                  <p>{contractaddress}</p>
                  <CopyToClipboard text={contractaddress}
                    onCopy={() => clickedCopy(true)}>
                    <span className="copier">copy</span>
                  </CopyToClipboard>
                  {showFeedback?
                    <p>copied!</p>
                  :
                  null }
                </div>
              <p>(Link: <a href="https://metamask.zendesk.com/hc/en-us/articles/360015489011-How-to-manage-ERC-20-Tokens">How to add new token to metamask.</a>)</p>
              </Panel>
            </Collapse>
          </div>
        </div>

        <div className="View Step">
          <h2><span className="nr">1.</span> Connect with the Metamask</h2>
          {!currentUser ? null : (
              <p className="connected">Connected as: <span>{currentUser.address}</span></p>
            )}
            <Web3SignIn />
        </div>
        <div className="Line"></div>
        <div className={currentUser ? "View Step fullop" : "View Step halfop"}>
          <h2><span className="nr">2.</span> Migrate your TRB</h2>
          <div className="Balances">
            <div className="Balance">
              <p className={migrated ? "halfop" : "fullop"}>Current balance:</p>
              <h1 className={migrated ? "halfop" : "fullop"}>{fromWei(userBalance)} TRB</h1>
            </div>
            <div className="Balance">
              <p></p>
              <h1 className={migrated ? "halfop" : "fullop"}>&#62;</h1>
            </div>
            <div className="Balance">
              <p>New balance:</p>
              <h1>{migrated ? fromWei(userBalance) : "0"} TRB</h1>
            </div>
          </div>
          {migrated ?
          null
          :
          <Button
              key="migration"
              size="large"
              type="default"
              onClick={() => handleSubmit()}
              disabled={cantMigrate}>
            Migrate TRB
          </Button>
          }
        </div>
          <div className="View">
          {error && <p className="ErrorMsg">Error Submitting Transaction:{error}</p>}
          {currentTx && <EtherscanLink txHash={currentTx} />}
          </div>
        {migrated ?
        <div className="Success">
          <div className="View">
            <h1>You successfully migrated your TRB!</h1>
          </div>
        </div>
        :
        null }
      </div>
    </>
    );
};

export default Migrate;
