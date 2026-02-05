FROM ghcr.io/disciple153/gda-backup:latest

# Install Node.js for the frontend
RUN apt-get update && apt-get install -y nodejs npm nginx && rm -rf /var/lib/apt/lists/*

# Copy React app
WORKDIR /app/frontend
COPY frontend/ .

# Install dependencies and build
RUN npm install && npm run build

# Copy built frontend to nginx directory
RUN mkdir -p /var/www/html && cp -r dist/* /var/www/html/

# Copy simple server
COPY simple-server.js /app/server.js

# Copy nginx config and startup script
COPY nginx.conf /etc/nginx/nginx.conf
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose port
EXPOSE 80

CMD ["/start.sh"]