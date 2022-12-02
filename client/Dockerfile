# syntax=docker/dockerfile:1
FROM node:12-alpine
RUN apk add --no-cache python2 g++ make
WORKDIR /client
COPY . .
RUN npm i
CMD ["npm", "start"]