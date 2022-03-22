#!/usr/bin/env bash

docker stop blue-micio-net
docker rm blue-micio-net

docker run -d \
  --name blue-micio-net \
  -p 8734 \
  --restart unless-stopped \
  -v $PWD:/usr/src/app \
  -v /vol/log/blue-micio-net_app:/var/log/blue-micio-net_app \
  -e NODE_ENV=production \
  -e VIRTUAL_HOST=blue.micio.net \
  -e LETSENCRYPT_HOST=blue.micio.net \
  -e LETSENCRYPT_EMAIL=something@sullo.co \
  -w /usr/src/app node:16 npm run start
