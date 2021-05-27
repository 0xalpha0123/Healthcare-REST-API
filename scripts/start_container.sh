#!/bin/sh
cd /home/ec2-user/app/backend || exit
sudo chmod - R755 /postgres-data
sudo cp ../envs/backend.env .env
git checkout dev
/usr/local/bin/docker-compose up -d