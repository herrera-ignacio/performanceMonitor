FROM node:latest

WORKDIR /usr/app

COPY ./ ./
RUN npm install

EXPOSE 80

CMD ["npm", "run", "dev"]
