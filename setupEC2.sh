#!/bin/sh

# Copy this file to the newly created EC2 instance. Change permissions to
# execute (chmod u+x ./setupEC2.sh)
#
# Run the script once at fresh instance. It will install all the libraries
# and dependencies to run node and pm2
#
# Copy the ecosystem.config.js file from tellorscan project prior to
# running this installation

sudo apt update
sudo apt install nodejs npm
sudo npm i -g pm2

git clone https://github.com/tellor-io/tellorscan
cd tellorscan
cd packages/mockMiner
npm i
npm run build
cd
pm2 start ./ecosystem.config.js

# Now you can tail -F .pm2/logs/js-mock-miner* to see mocker miner output
