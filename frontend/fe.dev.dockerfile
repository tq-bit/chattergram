FROM node:14-alpine

WORKDIR /frontend

EXPOSE 3000

CMD [ "npm", "run", "dev" ]