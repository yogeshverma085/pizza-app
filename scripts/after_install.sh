#!/bin/bash

# Exit on any error
set -e

echo "Navigating to project root..."
cd /home/ec2-user

echo "Cleaning old node_modules and frontend build..."
rm -rf node_modules
rm -rf client/node_modules
rm -rf client/build

echo "Installing backend dependencies..."
npm install

echo "Installing frontend dependencies and building React app..."
cd client
npm install
npm run build

echo "After install script completed successfully."