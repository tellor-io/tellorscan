module.exports = {
  apps : [
    {
      name: "js-mock-miner",
      script: "./tellorscan/packages/mockMiner/dist/index.js",
      env: {
        WEB3_URL: "wss://mainnet.infura.io/ws/v3/fbb0461697da49bb8c2815a43b97fc45",
        CONTRACT_ADDRESS: "0xbAF31Bbbba24AF83c8a7a76e16E109d921E4182a",
        MINE_SLEEP_CYCLE: '10m',
        REQUEST_RATE: '1h',
        QUERY_STR: "json(https://api.gdax.com/products/ETH-USD/ticker).price",
        AWS_REGION: "us-east-1"
      }
    }
  ]
}
