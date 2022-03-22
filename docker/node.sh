#!/usr/bin/env bash

docker stop super-micio-net
docker rm super-micio-net

docker run -d \
  --name super-micio-net \
  -p 8734 \
  --restart unless-stopped \
  -v $PWD:/usr/src/app \
  -v /vol/log/super-micio-net_app:/var/log/super-micio-net_app \
  -e NODE_ENV=production \
  -e VIRTUAL_HOST=super.micio.net \
  -e LETSENCRYPT_HOST=super.micio.net \
  -e LETSENCRYPT_EMAIL=something@sullo.co \
  -w /usr/src/app node:16 npm run start
