#!/bin/sh
cd /home/ec2-user/app/backend || exit
sudo cp ../envs/backend.env .env
sudo chmod 744 postgres-data/*
git checkout dev
/usr/local/bin/docker-compose up -d