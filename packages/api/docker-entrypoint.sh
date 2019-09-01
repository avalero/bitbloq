#!/bin/sh -xe
if [ -d /root/config/ ]; then
    cp /root/config/env /usr/src/app/.env
    cp /root/config/bitbloq3-contacts.json /usr/src/app/
fi
npm start