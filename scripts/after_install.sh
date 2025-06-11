#!/bin/bash

# Change working directoryy
cd /home/ec2-user/server

# Remove old modules and build
rm -rf node_modules
rm -rf client/node_modules
rm -rf client/build

# Install backend dependencies
npm install

# Install frontend and build
cd client
npm install
npm run build
