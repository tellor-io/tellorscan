module.exports = {
  apps : [
    {
      name: "js-mock-miner",
      script: "./tellorscan/packages/mockMiner/dist/index.js",
      env: {
        WEB3_URL: "wss://rinkeby.infura.io/ws/v3/fbb0461697da49bb8c2815a43b97fc45",
        CONTRACT_ADDRESS: "0x3f1571E4DFC9f3A016D90e0C9824C56fD8107a3e",
        MINE_SLEEP_CYCLE: '10m',
        REQUEST_RATE: '1h',
        QUERY_STR: "json(https://api.gdax.com/products/ETH-USD/ticker).price",
        AWS_REGION: "us-east-1"
      }
    }
  ]
}
