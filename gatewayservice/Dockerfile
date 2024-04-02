# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/gatewayservice

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the app source code to the working directory
COPY . .

EXPOSE 7999
EXPOSE 8000

# Define the command to run your app
CMD ["node", "gateway-service.js"]
