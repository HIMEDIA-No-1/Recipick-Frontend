#!/bin/sh

if [ -f "/usr/share/nginx/html/env.js" ]; then
    echo "Substituting environment variables in env.js..."
    envsubst < /usr/share/nginx/html/env.js > /tmp/env.js
    mv /tmp/env.js /usr/share/nginx/html/env.js
    echo "Environment variables substituted successfully"
fi

exec nginx -g 'daemon off;'