#!/bin/sh -xe
if [ -d /root/config/ ]; then
    cp /root/config/env /usr/src/app/api/.env
fi
npm start
