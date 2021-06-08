import React, { useContext } from 'react';
import styled from 'styled-components';
import { DownOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Button } from 'antd';
import { NetworkContext } from 'contexts/Network';

let networkId = 'Mainnet';
let connectedNetwork = networkId;


const NetworkDropdown = styled(Dropdown)`
  display: flex;
  align-items: center;
  font-size: 13px !important;
  border: none !important;
  span:nth-child(1) {
    height: 6px;
    width: 6px;
    border-radius: 50%;
    background-color: ${networkId !== connectedNetwork
    ? '#dd5858'
    : '#00ff8f;'};
    margin-right: 15px;
  }
  &:hover {
    span:nth-child(1) {
      background-color: #00ff8f;
    }
    svg {
      fill: #555555;
    }
  }
`;

const NetworkSwitcher = () => {
  const [currentNetwork, setCurrentNetwork] = useContext(NetworkContext);

  const label = +currentNetwork === 1 ? 'Mainnet' : 'Rinkeby';

  const handleSelect = async (item) => {
    window.localStorage.setItem('defaultNetwork', item.key);
    setCurrentNetwork(+item.key);
  };

  const menu = (
    <Menu>
      <Menu.Item onClick={handleSelect} key="1">
        Mainnet
      </Menu.Item>
      <Menu.Item onClick={handleSelect} key="4">
        Rinkeby
      </Menu.Item>
    </Menu>
  );

  return (
    <NetworkDropdown
      overlay={menu}
      trigger={['click']}
      placement="bottomLeft"
      arrow
    >
      <Button size="large" type="default">
        <span />
        {label}
        <DownOutlined />
      </Button>
    </NetworkDropdown>
  );
};

export default NetworkSwitcher;
