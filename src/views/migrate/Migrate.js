import React, { useState, useContext, useEffect } from 'react';
import Loader from 'components/shared/Loader';
import { fromWei } from 'utils/helpers';
import { Button } from 'antd';
import { UserContext } from 'contexts/User';
import EtherscanLink from 'components/shared/EtherscanlLnk';
import * as abiOracle from 'contracts/oracle.json';

const Migrate = () => {
    const [migrated, setMigrated] = useState(false);
    const [userBalance, setUserBalance] = useState(0);
    const [currentTx, setCurrentTx] = useState();
    const [currentUser,] = useContext(UserContext);
    const [cantMigrate, setCantMigrate] = useState();

    const [error, setError] = useState();
    const [processing, setProcessing] = useState(false);

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

    return (
        <>
            {error && <p className="ErrorMsg">Error Submitting Transaction:{error}</p>}
            {currentTx && <EtherscanLink txHash={currentTx} />}

            {!processing ? (
                <>
                    {currentUser ? (
                        <>
                            {cantMigrate ? (
                                <h4 className="ErrorMsg">{cantMigrate}</h4>
                            ) : (
                                <>
                                    <p className="BalanceStatus">
                                        {fromWei(userBalance)} TRB balance.
                      </p>
                                </>
                            )}
                        </>
                    ) : (
                        <h4 className="ErrorMsg">
                            You need to sign in with MetaMask to migrate
                        </h4>
                    )}
                    <Button
                        key="migrate"
                        type="primary"
                        size="large"
                        onClick={() => handleSubmit()}
                        disabled={cantMigrate}
                        style={{ marginRight: '15px' }}
                    >
                        Migrate
            </Button>
                </>
            ) : null}

            {processing && <Loader />}
        </>
    );
};

export default Migrate;
