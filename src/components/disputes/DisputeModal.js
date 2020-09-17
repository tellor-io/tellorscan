import React, { useState } from 'react';
import { Modal, Button } from 'antd';

import MinerValues from 'components/mining-events/MinerValues';

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
      <Modal visible={visible} onCancel={handleCancel} footer={null}>
        <>
          <p>ID {miningEvent.requestId}</p>
          <p>Symbol {miningEvent.requestSymbol}</p>

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
