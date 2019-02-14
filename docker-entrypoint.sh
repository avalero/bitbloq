#!/bin/sh -xe
if [ -d /root/config/ ]; then
    #cp /root/config/env /usr/src/app/app/res/config/.env
    ls -l /root/config/
fi
npm start
