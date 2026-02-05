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

# Install production dependencies + Prisma CLI (needed for migrations)
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --production; fi
RUN npm install prisma --save-dev --no-save || npm install -g prisma

# Copy Prisma generated client from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Copy Prisma schema and migrations (needed for migrations)
COPY --from=builder /app/prisma ./prisma

# Copy Prisma CLI binary if it exists
COPY --from=builder /app/node_modules/.bin/prisma* ./node_modules/.bin/ 2>/dev/null || true

# Verify files exist (NestJS keeps src/ structure)
RUN ls -la dist/ && test -f dist/src/main.js

# Expose port
EXPOSE 3000

# Create startup script that runs migrations before starting the app
RUN echo '#!/bin/sh\nnpx prisma migrate deploy\nnode dist/src/main.js' > /app/start.sh && chmod +x /app/start.sh

# Start the application (runs migrations first, then starts the app)
CMD ["/app/start.sh"]
