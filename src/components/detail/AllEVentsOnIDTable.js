import React, { useState, useEffect, useContext } from 'react';
import { useLocation,useHistory } from 'react-router-dom';
import { Button, Table, Collapse,Input } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { truncateAddr } from '../../utils/helpers';
import {ReactComponent as Miner} from 'assets/miner.svg';
import { useMediaQuery } from 'react-responsive';

import { UserContext } from 'contexts/User';
import { NetworkContext } from 'contexts/Network';


const AllEVentsOnIDTable = ({records,isMobile}) => {
    let columns;
    if(isMobile){
        columns = [
            {
            title: 'date',
            dataIndex: 'date',
            key: 'date',
            width:'50%',
            sorter: (a, b) => a.date - b.date,
            render: (date) => {
                const humandate = new Date(date * 1000).toLocaleString();
                return(
                    <>{humandate}</>
                )},
            },
            {
            title: 'value',
            dataIndex: 'value',
            key: 'value',
            width:'50%',
            sorter: (a, b) => a.value - b.value,
            render: (value) => <>{value} USD</>,
            },
        ];
    } else {
        columns = [
            {
              title: 'date',
              dataIndex: 'date',
              key: 'date',
              width:'30%',
              sorter: (a, b) => a.date - b.date,
              render: (date) => {
                const humandate = new Date(date * 1000).toLocaleString();
                return(
                    <>{humandate}</>
                )},
            },
            {
              title: 'value',
              dataIndex: 'value',
              key: 'value',
              width:'33%',
              sorter: (a, b) => a.value - b.value,
              render: (value) => <>{value} USD</>,
            },
            {
              title: 'block',
              dataIndex: 'block',
              key: 'block',
              width:'33%',
              sorter: (a, b) => a.block - b.block
            },
        ];
      }

    return (
        <div className="AllEVentsOnIDTable">
            <Table
                dataSource={records}
                columns={columns}
                expandRowByClick={true}
                expandIconColumnIndex={4}
                expandedRowRender={(record, index) => {
                      return <p key={index}>
                        {isMobile?
                        <><p>{record.value}</p></>
                        :
                        <><p>Desktop</p></>
                        }</p>;
                  }}
                   />
        </div>
    );
}

export default AllEVentsOnIDTable;
