import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import styled from 'styled-components';

import MinerValues from 'components/mining-events/MinerValues';

const RowDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  > *:first-child {
    margin-right: 25px;
  }
`;

const DisputeModal = ({ miningEvent, valueIndex }) => {
  const [visible, setVisible] = useState(false);

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <Button type="default" onClick={() => setVisible(true)}>
        View Miner Values
      </Button>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title="Miner Values"
      >
        <>
          <RowDiv>
            <div>
              <h6>ID</h6>
              <p>{miningEvent.requestId}</p>
            </div>
            <div>
              <h6>Symbol</h6>
              <p>{miningEvent.requestSymbol}</p>
            </div>
          </RowDiv>

          <MinerValues
            miningEvent={miningEvent}
            valueIndex={valueIndex}
            closeMinerValuesModal={handleCancel}
          />
        </>
      </Modal>
    </>
  );
};

export default DisputeModal;
