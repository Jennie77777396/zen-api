# Railway deployment Dockerfile for zen-api
# Multi-stage build: first install all deps (including dev) for building, then only production deps for runtime

FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./
COPY package-lock.json* ./

# Install ALL dependencies (including dev dependencies for building)
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json ./
COPY package-lock.json* ./

# Install ONLY production dependencies
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --production; fi

# Copy Prisma schema and generated client from builder
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma /app/node_modules/@prisma

# Copy built application from builder
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/prisma /app/prisma

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
