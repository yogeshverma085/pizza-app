#!/bin/bash

# Clean old application files before new deployment
echo "Cleaning old deployment..."
rm -rf /home/ec2-user/*

# Change working directory
cd /home/ec2-user

# Set Node.js version to 16
curl -sL https://rpm.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js and npm
sudo yum install -y nodejs npm

# Install PM2 globally
sudo npm install -g pm2