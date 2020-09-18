import React from 'react';
import styled from 'styled-components';
import { DownOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Button } from 'antd';

let networkId = 'Mainnet';
let connectedNetwork = networkId;

const menu = (
  <Menu>
    <Menu.Item>Mainnet</Menu.Item>
    <Menu.Item>Rinkeby</Menu.Item>
  </Menu>
);

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
    margin-right: 5px;
  }
  &:hover {
    span:nth-child(1) {
      background-color: white;
    }
    svg {
      fill: white;
    }
  }
`;

const NetworkSwitcher = ({ networkId }) => {
  return (
    <NetworkDropdown
      overlay={menu}
      trigger={['click']}
      placement="bottomLeft"
      arrow
    >
      <Button size="large" type="default">
        <span />
        Mainnet
      </Button>
    </NetworkDropdown>
  );
};

export default NetworkSwitcher;
