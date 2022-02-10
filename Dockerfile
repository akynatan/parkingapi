FROM node:12.22

WORKDIR /usr/app

COPY package.json ./

COPY . .

RUN npm install -g npm@8.4.1

RUN npm install --force

EXPOSE 3333

CMD ["npm", "run", "dev:server"]
