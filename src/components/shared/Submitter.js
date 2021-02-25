import React, { useContext } from 'react';
import { UserContext } from 'contexts/User';
import { Button, Alert } from 'antd';
import { Web3SignIn } from 'components/shared/Web3SignIn';
import EtherscanLink from 'components/shared/EtherscanlLnk';

const Submitter = ({ error, cantSubmit, processing, currentTx, handleSubmit, buttonText }) => {
    const [currentUser,] = useContext(UserContext);
    return (
        <>
            { !currentUser ? (
                <Web3SignIn />
            ) : null}
            { error && (
                <Alert
                    message={error}
                    type="error"
                    style={{ marginBottom: 10 }}
                />
            )}
            {cantSubmit ? (
                <Alert
                    message={cantSubmit}
                    type="error"
                    style={{ marginBottom: 10 }}
                />
            ) : null}

            <Button key="submit" disabled={!currentUser || cantSubmit} type="primary" onClick={handleSubmit}>{buttonText}</Button>
            { currentTx && <EtherscanLink className={processing ? "fader" : ""} txHash={currentTx} />}
        </>
    )
};

export default Submitter;