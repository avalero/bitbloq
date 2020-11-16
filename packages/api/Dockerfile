FROM node:12.13.0 as node

RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/src
WORKDIR /usr/src/app

COPY liveness.sh package.json package-lock.json tsconfig.json docker-entrypoint.sh migrate-mongo-config.js ./
COPY src ./src
COPY migrations ./migrations
COPY auth-service ./auth-service

RUN npm install --yes
RUN chmod +x /usr/src/app/docker-entrypoint.sh
RUN chmod +x /usr/src/app/liveness.sh

EXPOSE 4000

ENTRYPOINT ["/usr/src/app/docker-entrypoint.sh"]
