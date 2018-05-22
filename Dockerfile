FROM node:carbon

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

RUN npm i -g -c gitbook-cli && \
apt-get install -y git

WORKDIR /usr/src/app
VOLUME [ "/usr/src/whistle" ]

COPY package*.json ./
RUN npm install -c
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]
