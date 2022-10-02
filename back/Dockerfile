FROM node:18-alpine

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

ENV PATH=$PATH:/home/node/.npm-global/bin
# Create app directory
WORKDIR /usr/src/app/back

COPY package.json .

# Install app dependencies
RUN npm install
RUN npm install -g npm-run-all --save-dev

# RUN Prisma Generate
# RUN npx prisma generate

# Creates a "dist" folder with the production build
# RUN npm run build

