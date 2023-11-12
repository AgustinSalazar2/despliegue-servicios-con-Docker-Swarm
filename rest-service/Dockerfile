FROM node:16.14.2-alpine3.15

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5050

CMD [ "npm", "run", "dev" ]