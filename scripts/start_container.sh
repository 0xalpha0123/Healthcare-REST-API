#!/bin/sh
cd /home/ec2-user/app/backend || exit
sudo chmod -R 755 postgres-data
sudo cp ../envs/backend.env .env
/usr/local/bin/docker-compose up --build -V -d prod
sh scripts/migrate.sh
#prune old images
sh ../close.sh