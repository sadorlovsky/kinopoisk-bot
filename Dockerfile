FROM mhart/alpine-node

COPY package.json /tmp/
RUN cd /tmp && npm install
RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app

WORKDIR /usr/src/app
COPY . /usr/src/app

CMD ["npm", "start"]
