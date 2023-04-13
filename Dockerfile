FROM node:16-alpine

WORKDIR /product-api

COPY package*.json ./

RUN npm i

COPY . .

CMD ["npm", "run", "start"]

EXPOSE 3000