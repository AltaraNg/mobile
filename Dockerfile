# Use the official Node.js image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm install --global expo-cli

# Copy the rest of the application files
COPY . .

# Expose the necessary ports (Expo runs on 19000, 19001, and 19002)
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Start the Expo server
CMD ["npm", "start"]
