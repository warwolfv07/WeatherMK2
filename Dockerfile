#Dockerfile for weather app

FROM node:18

RUN mkdir -p /app

WORKDIR /app

COPY package*.json ./

COPY ./public ./public

COPY config.js ./

COPY index.js ./

RUN npm install

EXPOSE 3000

CMD ["node","index.js"]