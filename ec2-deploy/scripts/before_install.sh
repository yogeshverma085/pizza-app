#!/bin/bash

# Change working directory
cd /home/ec2-user/server

# Set Node.js version to 16
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -

# Install Node.js and npm
sudo yum install -y nodejs npm

# Install PM2 globally
sudo npm install -g pm2
