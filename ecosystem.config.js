module.exports = {
  apps : [
    {
      name: "js-mock-miner",
      script: "./tellorscan/packages/mockMiner/dist/index.js",
      env: {
        WEB3_URL: "fill in",
        CONTRACT_ADDRESS: "fill in",
        MINE_SLEEP_CYCLE: '10m',
        REQUEST_RATE: '1h',
        QUERY_STR: "json(https://api.gdax.com/products/BTC-USD/ticker).price",
        AWS_REGION: "us-east-1"
      }
    }
  ]
}
