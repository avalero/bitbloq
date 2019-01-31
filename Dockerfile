FROM node:current

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY src package.json package-lock.json tsconfig.json ./

RUN npm install --yes
RUN chmod +x /usr/src/app/docker-entrypoint.sh

EXPOSE 4000

ENTRYPOINT ["/usr/src/app/docker-entrypoint.sh"]

