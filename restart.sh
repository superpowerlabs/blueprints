#!/bin/env bash

if [[ "$1" == "pull" ]]; then git pull; fi

pnpm i
pnpm build
pm2 restart blueprints
