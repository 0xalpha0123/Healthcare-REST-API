#!/bin/sh
cd /app/backend || exit
cp /app/envs/backend.env .env
git checkout dev
/usr/local/bin/docker-compose up -d dev