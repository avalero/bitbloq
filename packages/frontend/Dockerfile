FROM node:12.13.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app/

COPY . ./

ENV NODE_ENV=production

RUN npm install -g yarn
RUN yarn install

WORKDIR /usr/src/app/packages/frontend
RUN npm run build

CMD /bin/bash -c "npm run start -- -p 80"
