#!/bin/bash

# Change working directoryy
cd /home/ec2-user/server

# Stop and remove old PM2 process
pm2 delete pizzavillage || true

# Start the app with PM2
pm2 start server.js --name pizzavillage
