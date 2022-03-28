# Build stage
FROM node:14-alpine as build-stage
WORKDIR /frontend
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# Prod stage
FROM nginx as production-stage
COPY --from=build-stage /frontend/dist usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]