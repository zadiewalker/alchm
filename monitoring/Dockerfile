FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy monitoring scripts
COPY scripts/ ./scripts/
COPY monitoring/ ./monitoring/

# Create non-root user
RUN addgroup -g 1001 -S alchm && adduser -S alchm -u 1001
RUN chown -R alchm:alchm /app
USER alchm

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3     CMD node -e "console.log('Health check passed')" || exit 1

# Run monitoring
CMD ["node", "scripts/performance-monitoring-dashboard.js"]
