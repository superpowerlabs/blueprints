#!/bin/env bash

git pull && pnpm i && pnpm build && pm2 restart blueprints

#
##!/usr/bin/env bash
#
#if [[ "$1" == "pull" ]]; then git pull; fi
#
#pnpm i
#pnpm build
#
#echo "Syncing build folders"
#rsync -a build/ build0 --delete
#
#pm2 restart staking
#
