# Based on Node 12 Alpine image
FROM node:12-alpine

# Define default application port
ENV PORT 4000

# Expose our application ports
EXPOSE 4000

# Install system requirements
RUN apk add --no-cache alpine-sdk python bash


# Set the default directory where CMD will execute
WORKDIR /app

COPY package.json /app
COPY yarn.lock /app

RUN yarn install --frozen-lockfile

COPY . /app

RUN yarn build

# Set the default command to execute when creating a new container
CMD yarn start
