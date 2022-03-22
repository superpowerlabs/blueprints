#!/usr/bin/env bash

pm2 start index.js -i max --name blueprints && pm2 save
