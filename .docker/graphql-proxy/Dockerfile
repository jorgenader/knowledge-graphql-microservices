# Based on Node 10 Alpine image
FROM node:12-alpine

# Install system requirements
RUN apk add --no-cache alpine-sdk python bash


# Set the default directory where CMD will execute
WORKDIR /app

COPY . /app

RUN yarn install --production --frozen-lockfile

RUN yarn build

ARG PORT=4000
ENV PORT $PORT

# Expose our application ports
EXPOSE $PORT

# Set the default command to execute when creating a new container
CMD yarn start
