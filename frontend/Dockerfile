FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Build the app (optional, for production)
# RUN npm run build

# Start development server
CMD ["npm", "run", "dev"]
