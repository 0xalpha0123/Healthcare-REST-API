#!/bin/sh
cd /home/ec2-user/app/backend || exit
sudo cp ../envs/backend.env .env
git checkout dev
/usr/local/bin/docker-compose up -d dev