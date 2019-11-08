FROM node:current as node

RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/src
WORKDIR /usr/src/app

COPY package.json package-lock.json tsconfig.json docker-entrypoint.sh migrate-mongo-config.js ./
COPY src ./src
COPY migrations ./migrations

RUN npm install --yes
RUN chmod +x /usr/src/app/docker-entrypoint.sh

EXPOSE 4000

ENTRYPOINT ["/usr/src/app/docker-entrypoint.sh"]
