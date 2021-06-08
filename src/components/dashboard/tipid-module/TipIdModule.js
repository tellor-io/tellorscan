import React, {useState, useEffect} from 'react';
import { Menu, Dropdown, Button, Collapse,Input } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const { Panel } = Collapse;

const TipIdItem = ({ symbol, tip }) => {
  return(
    <div className="TipId_Item">
      <div>
      <p>{symbol}</p>
        <div></div>
      </div>
      <p>tip {tip} TRB</p>
    </div>
  )
}


const TipIdModule = () => {
  const [selectedId,setSelectedId] = useState(null);
  const [tipAmount,setTipAmount] = useState(null);

  const handleMenuClick = (e) => {
    setSelectedId(e.key)
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="id1">
       id1
      </Menu.Item>
      <Menu.Item key="id2">
       id2
      </Menu.Item>
      <Menu.Item key="id3">
        id3
      </Menu.Item>
    </Menu>
  );
  
  return (
    <div className="TipId">
      <p>up next for mining:</p>
      <TipIdItem symbol={"XRP/USD"} tip={"0,2"}/> 
      <TipIdItem symbol={"ATOM/USD"} tip={"0,1"}/> 
      <TipIdItem symbol={"TRX/ETH"} tip={"0,05"}/> 
      <TipIdItem symbol={"ZEC/ETH"} tip={"0,05"}/> 
      <TipIdItem symbol={"BNB/BTC"} tip={"0,025"}/> 
      <div className="DropDownAndButton">
        <p>Tip an ID to get it mined by the network sooner</p>
      <Dropdown
        overlay={menu}
        trigger={['click']}
        >
        <Button className="dropper">
          {selectedId ? selectedId: "Select an ID to tip" }
          <DownOutlined /> 
        </Button>
      </Dropdown>

      <div className="tipCollapser">
        <Collapse
          defaultActiveKey={['0']}
          activeKey={selectedId ? ['1'] : ['0']}>
          <Panel header="This is panel header 1" key="1">
            <p>How much do you want to tip {selectedId}?</p>
            <Input
              size="large"
              placeholder="TIP amount"
              suffix={"ETH"}
              type="number"
              onChange={(e) => setTipAmount(e.target.value)}/>
          </Panel>
        </Collapse>
      </div>


      <Button
        disabled={!tipAmount}
        onClick={startTipFlow}>Tip ID</Button>
      </div>
    </div>
  );
};

export default TipIdModule;
