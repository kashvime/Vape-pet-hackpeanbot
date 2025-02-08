FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

#expose the port 3000 for further use
EXPOSE 3000

#automatically run this command once this container comes online
CMD [ "node","app.js" ]