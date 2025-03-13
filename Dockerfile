FROM node:lts-alpine AS builder

WORKDIR /app

COPY . .

RUN apk add --no-cache openssl && \
    npm clean-install --ignore-scripts && \
    npm run build

FROM openresty/openresty:alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Copy nginx configuration files
COPY nginx-configs/nginx.conf /usr/local/openresty/nginx/conf/nginx.conf
COPY nginx-configs/default.conf /etc/nginx/conf.d/configfile.template
COPY nginx-configs/mime.types /etc/nginx/mime.types
COPY nginx-configs/gzip.conf /etc/nginx/gzip.conf

# Copy static files
COPY --from=builder /app/dist/ /usr/share/nginx/html/

# Create nginx.pid file to hold the process id
RUN touch /var/run/nginx.pid

# Create logs folder
RUN mkdir -p /var/log/nginx

EXPOSE 5173

# Entrypoint
CMD ash -c "envsubst '\$LOGIN \$PASSWORD \$BACKEND_URL \$SOCKET_URL' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && \
            nginx -g 'daemon off;'"