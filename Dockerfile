# =============================================================================
# Family Organizer - Production Dockerfile
# Multi-stage build with Node.js backend for file persistence
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Build the frontend application
# -----------------------------------------------------------------------------
FROM node:20-alpine AS frontend-builder

LABEL maintainer="Family Organizer"
LABEL description="Family chore and schedule management app"
LABEL version="1.0.0"

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies
RUN npm ci --no-audit --no-fund

# Copy source files
COPY . .

# Build the frontend
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Production image with Node.js server
# -----------------------------------------------------------------------------
FROM node:20-alpine AS production

LABEL maintainer="Family Organizer"
LABEL description="Family chore and schedule management app"

# Install curl for healthcheck
RUN apk add --no-cache curl

WORKDIR /app

# Copy server files
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --no-audit --no-fund --omit=dev

# Copy server source
COPY server/index.js ./

# Copy built frontend from builder stage
WORKDIR /app
COPY --from=frontend-builder /app/dist ./dist

# Create data directory
RUN mkdir -p /data && chown -R node:node /data

# Create non-root user for security
USER node

# Environment variables
ENV NODE_ENV=production
ENV PORT=80
ENV DATA_DIR=/data

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/api/health || exit 1

# Start the server
CMD ["node", "server/index.js"]
