#!/bin/sh -xe
if [ -d /root/config/ ]; then
    #cp /root/config/env /usr/src/app/api/.env
    ls -l /usr/src/app/
fi
npm start
