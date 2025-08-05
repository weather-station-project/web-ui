FROM node:lts-alpine AS builder

WORKDIR /app

COPY . .

# Install openssl and build the project
RUN apk add --no-cache openssl && \
    npm clean-install --ignore-scripts && \
    npm run build

FROM openresty/openresty:alpine

# Install curl, perl and gettext
RUN apk add --no-cache curl perl gettext

# Install lua-resty-http
RUN opm get ledgetech/lua-resty-http

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

EXPOSE 8443

# Entrypoint
CMD ash -c "envsubst < /usr/share/nginx/html/env-template.js > /usr/share/nginx/html/env.js && \
            envsubst '\$LOGIN \$PASSWORD \$BACKEND_URL \$SOCKET_URL \$DNS_RESOLVER \$KEY_FILE \$CERT_FILE' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && \
            nginx -g 'daemon off;'"