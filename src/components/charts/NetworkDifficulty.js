import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment'


const NetworkDifficulty = ({ data: data }) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart
                data={data}
                margin={{
                    top: 20,
                    right: 20,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="timestamp"
                    tickFormatter={
                        (unixTime) => moment(unixTime * 1000).format('Do HH:mm')}
                />
                <YAxis
                    reversed="true"
                    dataKey="difficulty"
                    type="number"
                />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="difficulty" dot={false} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default NetworkDifficulty;
