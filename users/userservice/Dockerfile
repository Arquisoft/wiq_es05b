# Use an official Node.js runtime as a parent image
FROM node:20

RUN wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | apt-key add -
RUN apt install apt-transport-https -y --no-install-recommends && apt clean
RUN echo "deb https://artifacts.elastic.co/packages/8.x/apt stable main" | tee -a /etc/apt/sources.list.d/elastic-8.x.list
RUN apt update && apt install filebeat -y --no-install-recommends && apt clean

COPY filebeat.yml /etc/filebeat/filebeat.yml

# Set the working directory in the container
WORKDIR /usr/src/userservice

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the app source code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 8001

# Define the command to run your app
CMD service filebeat start && node user-service.js
