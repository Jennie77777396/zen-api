# Railway deployment Dockerfile for zen-api
# Multi-stage build: first install all deps (including dev) for building, then only production deps for runtime

FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (for better layer caching)
COPY package.json package-lock.json* ./

# Install ALL dependencies (including dev dependencies for building)
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy Prisma schema (needed for generate)
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Verify build succeeded (NestJS keeps src/ structure, so main.js is in dist/src/)
RUN ls -la dist/ && ls -la dist/src/ && test -f dist/src/main.js

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install ONLY production dependencies
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --production; fi

# Copy Prisma generated client from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Copy Prisma schema (needed for migrations if any)
COPY --from=builder /app/prisma ./prisma

# Verify files exist (NestJS keeps src/ structure)
RUN ls -la dist/ && test -f dist/src/main.js

# Expose port
EXPOSE 3000

# Start the application (NestJS outputs to dist/src/main.js)
CMD ["npm", "run", "start:prod"]
