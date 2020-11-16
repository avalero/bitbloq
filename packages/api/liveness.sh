#!/bin/sh -xe

curl 'http://localhost:4000/graphql' -H 'content-type: application/json' --data-binary '{"operationName":null,"variables":{},"query":"mutation {\n  login(email: \"liveness@probe.com\", password: \"test\")\n}\n"}' --compressed -k --max-time 2 --connect-timeout 2; exit $?