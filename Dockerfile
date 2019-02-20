FROM node:current as node

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app/

COPY . ./

WORKDIR /usr/src/app/bitbloq-space/frontend
RUN npm install --yes
RUN npm link ../../bitbloq/packages/ui
RUN npm link ../../bitbloq/packages/3d
RUN npm link ../../bitbloq/packages/lib3d

WORKDIR /usr/src/app/bitbloq
RUN npx lerna bootstrap

WORKDIR /usr/src/app/bitbloq-space/frontend
RUN npm run build
RUN mv public ../../

FROM nginx:1.13

WORKDIR /usr/src/app/
COPY --from=node /usr/src/app/public/ /usr/share/nginx/html
COPY /bitbloq-space/frontend/nginx-config.conf /etc/nginx/conf.d/default.conf

RUN rm -rf bitbloq bitbloq-space