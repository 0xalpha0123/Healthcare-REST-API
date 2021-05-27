#!/bin/sh
cd /home/ec2-user/app/backend || exit
sudo cp ../envs/backend.env .env
sudo chmod 755 postgres-data
/usr/local/bin/docker-compose up --build -V -d prod
#prune old images
sh ../close.sh