import React, {useState, useEffect} from 'react';
import { Menu, Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';

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
  const handleMenuClick = (e) => {
    console.log('click', e);
    setSelectedId(e.key)
  }

  const startTipFlow = () => {
    console.log('startTipFlow!');
  }

  console.log('selectedId:::', selectedId);

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
      <Button
        disabled={!selectedId}
        onClick={startTipFlow}>Tip ID</Button>
      </div>
    </div>
  );
};

export default TipIdModule;
