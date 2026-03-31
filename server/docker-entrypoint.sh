#!/bin/sh
set -eu

mkdir -p /data

needs_seed=0
if [ ! -f /data/taskflow.db ]; then
  needs_seed=1
fi

npm exec prisma migrate deploy

if [ "$needs_seed" = "1" ]; then
  npm run prisma:seed
fi

exec npm run start:api
