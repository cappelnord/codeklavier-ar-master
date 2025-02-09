FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the port that the app listens on
EXPOSE 3000

VOLUME /data

ENV DATA_PATH="/data/"
ENV WEBPAGE="https://codeklavier.space/arquatic/"

# Define the command to run the app
CMD ["node", "index.js"]