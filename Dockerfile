# =============================================================================
# Family Organizer - Production Dockerfile
# Multi-stage build optimized for Raspberry Pi and x86
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Build the application
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

# Add labels for better container management
LABEL maintainer="Family Organizer"
LABEL description="Family chore and schedule management app"
LABEL version="1.0.0"

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies
# Using --frozen-lockfile equivalent for reproducible builds
RUN npm ci --no-audit --no-fund

# Copy source files
COPY . .

# Build the application
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Production image with Nginx
# -----------------------------------------------------------------------------
FROM nginx:1.25-alpine AS production

# Labels
LABEL maintainer="Family Organizer"
LABEL description="Family chore and schedule management app"

# Install curl for healthcheck
RUN apk add --no-cache curl

# Remove default nginx config
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup && \
    chown -R appuser:appgroup /usr/share/nginx/html && \
    chown -R appuser:appgroup /var/cache/nginx && \
    chown -R appuser:appgroup /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R appuser:appgroup /var/run/nginx.pid

# Expose port 80
EXPOSE 80

# Health check - verify nginx is serving the app
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
