FROM node:current

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY bitbloq bitbloq-space ./
RUN cd bitbloq
RUN npx lerna bootstrap
RUN cd ../bitbloq-space/frontend
RUN npm install --yes
RUN npm link ../../bitbloq/packages/ui
RUN npm link ../../bitbloq/packages/3d
RUN npm link ../../bitbloq/packages/lib3d

ENTRYPOINT ["/usr/src/app/docker-entrypoint.sh"]