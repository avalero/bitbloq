FROM node:10.15.3 as node

RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/src
WORKDIR /usr/src/app

COPY package.json package-lock.json tsconfig.json docker-entrypoint.sh ./
COPY src ./src

RUN npm install --yes
RUN chmod +x /usr/src/app/docker-entrypoint.sh

EXPOSE 4000

ENTRYPOINT ["/usr/src/app/docker-entrypoint.sh"]
