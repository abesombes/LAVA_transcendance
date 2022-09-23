# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app/front
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
#update and utilities
# RUN apt-get update -y
# RUN apt-get upgrade -y
# RUN apt-get install vim -y

RUN apk add vim
# Install app dependencies
RUN npm install
# Bundle app source
COPY . .
# Creates a "dist" folder with the production build
RUN npm run build

