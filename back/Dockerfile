# Base image
FROM node:18-buster

# Create app directory
WORKDIR /usr/src/app/back
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
#update and utilities
RUN apt-get update
RUN apt-get install vim -y
# Install app dependencies
RUN npm install
# Install NestJS TypeORM and DotEnv extension
RUN npm install @nestjs/config
RUN npm install @nestjs/typeorm typeorm mysql2
RUN npm install --save dotenv
# Bundle app source
COPY . .
# Creates a "dist" folder with the production build
RUN npm run build