# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app/back

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# #update and utilities
# RUN apt-get update
# RUN apt-get install vim -y
RUN apk add vim

# Install app dependencies
RUN npm install
RUN npm install prisma --save-dev
RUN npm install @prisma/client express @types/express
RUN npm install -D typescript --save-dev
RUN npm install -D ts-node --save-dev
RUN npm install --save-dev @types/node
RUN npm install --save @nestjs/swagger
RUN npm install class-validator class-transformer
RUN npm install npm-run-all
RUN npm install @nestjs/passport
RUN npm install google-auth-library
RUN npm install passport-google-oauth20
RUN npm install --save @nestjs/config

# COPY Prisma files
COPY prisma/ /prisma/

# COPY ENV variable
COPY .env ./

# COPY tsconfig.json file
COPY tsconfig.json ./

# Bundle app source
COPY . .

# RUN Prisma Generate
RUN npx prisma generate

# Creates a "dist" folder with the production build
RUN npm run build
