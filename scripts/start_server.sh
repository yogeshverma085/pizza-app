#!/bin/bash
cd /home/ec2-user/pizzavillage
pm2 stop all || true
pm2 start server.js

