# Use Node.js official image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --only=production

# Copy source code
COPY . .

# Expose gRPC server port
EXPOSE 50051

# Run the gRPC server
CMD ["node", "server.js"]
