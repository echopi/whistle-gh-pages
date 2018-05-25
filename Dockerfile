FROM node:carbon

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin
ENV NODE_ENV=production

RUN npm i -g -c gitbook-cli && \
apt-get install -y git

WORKDIR /home/node/app
VOLUME [ "/home/node/whistle", "/home/node/app/logs" ]

COPY package*.json ./
RUN npm install --registry=https://registry.npm.taobao.org
COPY . .

EXPOSE 6001
USER node
CMD [ "node", "server.js" ]
