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
RUN npm install prisma --save-dev
RUN npm install @prisma/client express @types/express
RUN npm install -D typescript --save-dev
RUN npm install -D ts-node --save-dev
RUN npm install --save-dev @types/node

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
