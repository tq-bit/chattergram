FROM node:14-alpine

WORKDIR /backend

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8080
EXPOSE 9090

CMD [ "npm", "run", "dev" ]