#!/usr/bin/env bash

pnpm i
pnpm build
delete blueprints
pm2 start index.js -i max --name blueprints
pm2 save
