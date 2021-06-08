import React, { useState } from 'react';
import { Table} from 'antd';
import { truncateAddr,getGranPrice } from '../../utils/helpers';
import {ReactComponent as Miner} from 'assets/miner.svg';
import { Collapse } from 'antd';
import Disputer from '../shared/Disputer';

const { Panel } = Collapse;

const AllEVentsOnIDTable = ({records,isMobile}) => {
    const [disputeCollapser,setDisputeCollapser] = useState("");
    console.log("disputeCollapser >>>",disputeCollapser);
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
              width:'33%',
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
              width:'30%',
              sorter: (a, b) => a.value - b.value,
              render: (value) => <>{value} USD</>,
            },
            {
              title: 'update in block',
              dataIndex: 'blockNumber',
              key: 'blockNumber',
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
                      return (
                        <div key={index} className="AllEVentsOnIDTable__minerVals">
                            {record.minerValues.map((minerval,i)=>{
                                return(
                                    <div key={i} className="AllEVentsOnIDTable__InnerBox">
                                        <div className="AllEVentsOnIDTable__Inner">
                                            <div>
                                            <Miner />
                                            <p><a href={record.txLink+"/address/"+minerval.miner} target="_blank" rel="noopener noreferrer">{truncateAddr(minerval.miner)}</a> submitted</p>
                                            <p>{getGranPrice(minerval.values[record.idIndex], record.id)}</p>
                                            </div>
                                            {parseInt(disputeCollapser, 10) === i?
                                            null 
                                            :
                                            <p className="disputeClick" onClick={() => setDisputeCollapser(i.toString())}>dispute value</p>
                                            }
                                        </div>
                                        <div className="disputeCollapser">
                                            <Collapse
                                                activeKey={disputeCollapser}>
                                                <Panel header="This is panel header 1" key={i}>
                                                    <Disputer
                                                        id={record.id}
                                                        minerAddr={minerval.miner}
                                                        timestamp={record.date}
                                                        onCancel={() => setDisputeCollapser("")} />
                                                </Panel>
                                            </Collapse>
                                        </div>

                                    </div>
                                )
                            })}
                        </div>
                        )
                  }}
                   />
        </div>
    );
}

export default AllEVentsOnIDTable;
