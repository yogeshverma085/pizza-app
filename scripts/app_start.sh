#!/bin/bash

# Change working directoryy
cd /home/ec2-user

# Stop and remove old PM2 process
pm2 delete pizzavillage || true

# Start the app with PM2
pm2 start index.js --name pizzavillage

# Save the process list for auto restart on reboot
pm2 save

# Setup PM2 to launch at system startup
pm2 startup systemd -u ec2-user --hp /home/ec2-user | sudo tee /dev/null