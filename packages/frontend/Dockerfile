FROM node:current as node

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app/

COPY . ./

RUN npx lerna bootstrap --ci

WORKDIR /usr/src/app/packages/frontend
RUN npm run build

FROM nginx:1.13

COPY --from=node /usr/src/app/packages/frontend/public/ /usr/share/nginx/html
COPY /packages/frontend/nginx-config.conf /etc/nginx/conf.d/default.conf

CMD /bin/bash -c "nginx -g 'daemon off;'"
