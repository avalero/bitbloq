FROM node:current

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . ./

RUN cd bitbloq && npx lerna bootstrap
RUN cd bitbloq-space/frontend && npm install --yes

RUN npm link bitbloq/packages/ui
RUN npm link bitbloq/packages/3d
RUN npm link bitbloq/packages/lib3d

RUN chmod +x /usr/src/app/docker-entrypoint.sh

ENTRYPOINT ["/usr/src/app/docker-entrypoint.sh"]