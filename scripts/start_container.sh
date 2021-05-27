#!/bin/sh
cd /app/backend || exit
git checkout dev
/usr/local/bin/docker-compose up -d dev