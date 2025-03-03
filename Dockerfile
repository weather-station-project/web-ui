FROM node:lts-alpine AS builder

WORKDIR /app

COPY . .

RUN apk add --no-cache openssl && \
    npm clean-install --ignore-scripts --omit=dev && \
    npm run build

FROM nginx:stable-alpine

# Copy nginx configuration files
COPY nginx-configs/nginx.conf /etc/nginx/nginx.conf
COPY nginx-configs/default.conf /etc/nginx/conf.d/configfile.template
COPY nginx-configs/mime.types /etc/nginx/mime.types
COPY nginx-configs/gzip.conf /etc/nginx/gzip.conf

# Copy static files
COPY --from=builder /app/dist/ /usr/share/nginx/html/

# Add permissions for nginx user
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

USER nginx
EXPOSE 8080

# Entrypoint
CMD ash -c "envsubst < /usr/share/nginx/html/env-template.js > /usr/share/nginx/html/env.js && \
            envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && \
            nginx -g 'daemon off;'"