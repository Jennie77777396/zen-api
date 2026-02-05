# Railway deployment Dockerfile for zen-api
FROM node:20-alpine

WORKDIR /app

# Copy package files (package-lock.json is optional)
COPY package.json ./
COPY package-lock.json* ./

# Install dependencies
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --production; fi

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
