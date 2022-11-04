#!/usr/bin/env bash

docker stop bp-altermafia-com
docker rm bp-altermafia-com

docker run -d \
  --name bp-altermafia-com \
  -p 8773 \
  --restart unless-stopped \
  -v $PWD:/usr/src/app \
  -v /vol/log/bp-altermafia-com_app:/var/log/bp-altermafia-com_app \
  -e NODE_ENV=production \
  -e VIRTUAL_HOST=bp.altermafia.com \
  -e LETSENCRYPT_HOST=bp.altermafia.com \
  -e LETSENCRYPT_EMAIL=altermafia@sullo.co \
  -w /usr/src/app node:16 npm run start
