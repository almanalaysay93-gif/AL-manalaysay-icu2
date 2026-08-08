# Use lightweight Node alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy application files
COPY . .

# Expose application port
EXPOSE 3000

# Set environment variables
ENV PORT=3000

# Start application server
CMD ["node", "server.js"]
